// Runs a command with the variables from .env.remote.local (gitignored) set
// first, so drizzle-kit and the seed target the remote database instead of
// the docker one from .env.local. Usage: node scripts/remote-env.mjs <cmd> [args…]
import { spawn } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const file = resolve(process.cwd(), ".env.remote.local");
if (!existsSync(file)) {
  console.error("scripts/remote-env: .env.remote.local not found. Create it with DATABASE_URL=<the remote postgres url> (it is gitignored).");
  process.exit(1);
}
const env = { ...process.env };
for (const line of readFileSync(file, "utf8").split("\n")) {
  const m = /^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/.exec(line);
  if (!m || line.trim().startsWith("#")) continue;
  env[m[1]] = m[2].replace(/^(['"])(.*)\1$/, "$2");
}
const [cmd, ...args] = process.argv.slice(2);
const child = spawn(cmd, args, { stdio: "inherit", env, shell: process.platform === "win32" });
child.on("exit", (code) => process.exit(code ?? 1));
