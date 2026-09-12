import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { and, eq, gt, sql } from "drizzle-orm";
import { cookies } from "next/headers";
import { getDb, isDbConfigured } from "@/db";
import { brands, creators, ledgerEntries, sessions, users } from "@/db/schema";
import { SESSION_COOKIE, SESSION_TTL_DAYS } from "../constants";
import type { Role } from "../schemas";

const DAY_MS = 86_400_000;
const TOKEN_BYTES = 32;

export type Viewer = {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  csrfToken: string;
  brand: { id: string; slug: string; company: string; walletCents: number } | null;
  creator: { id: string; handle: string; avatarUrl: string; headline: string; availableCents: number } | null;
};

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function createSession(userId: string) {
  const token = randomBytes(TOKEN_BYTES).toString("base64url");
  const csrfToken = randomBytes(TOKEN_BYTES).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_TTL_DAYS * DAY_MS);
  await getDb().insert(sessions).values({ userId, tokenHash: hashToken(token), csrfToken, expiresAt });
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });
}

export async function destroySession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (token && isDbConfigured()) {
    await getDb().delete(sessions).where(eq(sessions.tokenHash, hashToken(token)));
  }
  cookieStore.delete(SESSION_COOKIE);
}

// null = no valid session. Throws only if the db is configured but unreachable.
export async function getViewer(): Promise<Viewer | null> {
  if (!isDbConfigured()) return null;
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const db = getDb();
  const [row] = await db
    .select({ user: users, csrfToken: sessions.csrfToken })
    .from(sessions)
    .innerJoin(users, eq(users.id, sessions.userId))
    .where(and(eq(sessions.tokenHash, hashToken(token)), gt(sessions.expiresAt, new Date())));
  if (!row) return null;

  const [brand] = await db
    .select({ id: brands.id, slug: brands.slug, company: brands.company, walletCents: brands.walletCents })
    .from(brands)
    .where(eq(brands.ownerUserId, row.user.id));
  const [creator] = await db
    .select({ id: creators.id, handle: creators.handle, avatarUrl: creators.avatarUrl, headline: creators.headline })
    .from(creators)
    .where(eq(creators.userId, row.user.id));

  const availableCents = creator ? await creatorAvailableCents(creator.id) : 0;

  return {
    userId: row.user.id,
    email: row.user.email,
    firstName: row.user.firstName,
    lastName: row.user.lastName,
    role: row.user.role,
    csrfToken: row.csrfToken,
    brand: brand ?? null,
    creator: creator ? { ...creator, availableCents } : null,
  };
}

// Completed payouts minus withdrawals: what the creator can withdraw now.
async function creatorAvailableCents(creatorId: string) {
  const [row] = await getDb()
    .select({ total: sql<number>`coalesce(sum(${ledgerEntries.amountCents}), 0)::int` })
    .from(ledgerEntries)
    .where(and(eq(ledgerEntries.creatorId, creatorId), eq(ledgerEntries.status, "completed")));
  return row?.total ?? 0;
}
