import { describe, expect, it } from "vitest";
import { resolveDatabaseUrl } from "./database-url";

describe("resolveDatabaseUrl", () => {
  it("prefers the plain name, then Vercel's prefixed and alternate names, in order", () => {
    expect(resolveDatabaseUrl({ DATABASE_URL: "a", naano_clone_DATABASE_URL: "b" })).toEqual({ name: "DATABASE_URL", url: "a" });
    expect(resolveDatabaseUrl({ naano_clone_DATABASE_URL: "b", POSTGRES_URL: "c" })).toEqual({ name: "naano_clone_DATABASE_URL", url: "b" });
    expect(resolveDatabaseUrl({ POSTGRES_URL: "c", naano_clone_POSTGRES_URL: "d" })).toEqual({ name: "POSTGRES_URL", url: "c" });
    expect(resolveDatabaseUrl({ naano_clone_POSTGRES_URL: "d" })).toEqual({ name: "naano_clone_POSTGRES_URL", url: "d" });
  });
  it("treats empty strings as unset and returns null when nothing is set", () => {
    expect(resolveDatabaseUrl({ DATABASE_URL: "" })).toBeNull();
    expect(resolveDatabaseUrl({})).toBeNull();
  });
});
