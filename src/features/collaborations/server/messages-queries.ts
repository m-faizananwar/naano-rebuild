import "server-only";
import { and, asc, desc, eq, inArray, sql } from "drizzle-orm";
import { getDb } from "@/db";
import { campaigns, collaborations, creators, messages, users } from "@/db/schema";
import { THREAD_STATUSES } from "@/lib/collaboration-labels";
import type { MessageDto, ThreadDetailDto, ThreadDto, ViewerRole } from "../schemas";
import { type CollaborationRow, collaborationSelect, initialOf } from "./dto";
import { MAX_THREAD_MESSAGES, MESSAGE_PREVIEW_CHARS } from "../ui-constants";

export type ThreadScope = { role: ViewerRole; ownerId: string; userId: string };

function ownerFilter(scope: ThreadScope) {
  return scope.role === "creator" ? eq(collaborations.creatorId, scope.ownerId) : eq(campaigns.brandId, scope.ownerId);
}

function preview(body: string | null) {
  if (!body) return null;
  const oneLine = body.replace(/\s+/g, " ").trim();
  return oneLine.length > MESSAGE_PREVIEW_CHARS ? `${oneLine.slice(0, MESSAGE_PREVIEW_CHARS)}…` : oneLine;
}

function toThreadDto(row: CollaborationRow, role: ViewerRole, last: { body: string | null; at: Date | null }): ThreadDto {
  const creatorName = `${row.creatorFirstName} ${row.creatorLastName}`.trim();
  const counterpartName = role === "brand" ? creatorName : row.brandCompany;
  return {
    collaborationId: row.collab.id,
    campaignId: row.collab.campaignId,
    campaignName: row.campaignName,
    status: row.collab.status,
    counterpartName,
    counterpartAvatarUrl: role === "brand" ? row.creatorAvatarUrl : null,
    counterpartInitial: initialOf(counterpartName),
    lastMessagePreview: preview(last.body),
    lastMessageAt: last.at ? last.at.toISOString() : null,
  };
}

async function lastMessages(collaborationIds: string[]) {
  if (collaborationIds.length === 0) return new Map<string, { body: string | null; at: Date | null }>();
  const rows = await getDb()
    .selectDistinctOn([messages.collaborationId], {
      collaborationId: messages.collaborationId,
      body: messages.body,
      at: messages.createdAt,
    })
    .from(messages)
    .where(inArray(messages.collaborationId, collaborationIds))
    .orderBy(messages.collaborationId, desc(messages.createdAt));
  return new Map(rows.map((r) => [r.collaborationId, { body: r.body, at: r.at }]));
}

// One thread per accepted-or-later collaboration on the viewer's side,
// newest activity first.
export async function listThreads(scope: ThreadScope): Promise<ThreadDto[]> {
  const rows = await collaborationSelect().where(
    and(ownerFilter(scope), inArray(collaborations.status, [...THREAD_STATUSES])),
  );
  const last = await lastMessages(rows.map((r) => r.collab.id));
  return rows
    .map((r) => toThreadDto(r, scope.role, last.get(r.collab.id) ?? { body: null, at: null }))
    .sort((a, b) => (b.lastMessageAt ?? "").localeCompare(a.lastMessageAt ?? ""));
}

// The viewer must be a party (owner filter) for the thread to exist at all.
export async function getThread(scope: ThreadScope, collaborationId: string): Promise<ThreadDetailDto | null> {
  const [row] = await collaborationSelect().where(and(eq(collaborations.id, collaborationId), ownerFilter(scope)));
  if (!row || !THREAD_STATUSES.includes(row.collab.status)) return null;

  const list = await getDb()
    .select({
      id: messages.id,
      body: messages.body,
      createdAt: messages.createdAt,
      senderUserId: messages.senderUserId,
      firstName: users.firstName,
      lastName: users.lastName,
      role: users.role,
      avatarUrl: sql<string | null>`(select ${creators.avatarUrl} from ${creators} where ${creators.userId} = ${users.id})`,
    })
    .from(messages)
    .innerJoin(users, eq(users.id, messages.senderUserId))
    .where(eq(messages.collaborationId, collaborationId))
    .orderBy(asc(messages.createdAt))
    .limit(MAX_THREAD_MESSAGES);

  const dtos: MessageDto[] = list.map((m) => ({
    id: m.id,
    body: m.body,
    senderName: m.role === "brand" ? row.brandCompany : `${m.firstName} ${m.lastName}`.trim(),
    senderAvatarUrl: m.avatarUrl,
    mine: m.senderUserId === scope.userId,
    createdAt: m.createdAt.toISOString(),
  }));
  const lastMessage = list[list.length - 1];
  return {
    thread: toThreadDto(row, scope.role, { body: lastMessage?.body ?? null, at: lastMessage?.createdAt ?? null }),
    messages: dtos,
  };
}
