import { MCP_ENDPOINT_PATH } from "../../constants";
import { mcpClientsFor } from "./mcpClientsFor";
import { McpSetupDialog } from "./McpSetupDialog";

import { BRAND } from "@/config/brand";
const READ_ACCESS = {
  brand: ["Your active workspace, wallet and campaigns", "Available creators, posts and campaign fit", "Applications, bookings and content status"],
  creator: ["Briefs and deadlines", "Draft history and post status", "Your conversations with brands"],
};
const ACTIONS = {
  brand: ["Draft and launch campaigns", "Invite creators and manage applications", "Review submitted content and campaign status"],
  creator: ["Submit a draft for review", "Attach an image to a draft", "Reply in a conversation"],
};

export function IntegrationsPanel({ role, origin }: { role: "brand" | "creator"; origin: string }) {
  const clients = mcpClientsFor(role);
  const endpoint = `${origin}${MCP_ENDPOINT_PATH}`;
  return (
    <div className="grid gap-4">
      <section className="rounded-2xl border bg-background p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{BRAND.name.toUpperCase()}://MCP · <span className="text-muted-foreground">Documented</span></p>
        <h2 className="mt-1 text-xl font-semibold">Remote MCP endpoint</h2>
        <p className="mt-2 font-mono text-sm">{endpoint}</p>
        <p className="mt-1 text-xs text-muted-foreground">Streamable HTTP · OAuth 2.1 · No API key · <span className="font-medium text-foreground">documented, not served in this build</span></p>
      </section>
      <section className="rounded-2xl border bg-background p-5">
        <h2 className="font-semibold">Choose your client</h2>
        <p className="text-sm text-muted-foreground">One endpoint, any compatible MCP client.</p>
        <ul className="mt-4 grid gap-3 sm:grid-cols-3">
          {clients.map((setup) => (
            <li key={setup.key} className="flex flex-col gap-3 rounded-xl border p-4">
              <p className="font-medium">{setup.client}</p>
              <p className="flex-1 text-xs text-muted-foreground">{setup.lead}</p>
              <McpSetupDialog setup={setup} url={endpoint} />
            </li>
          ))}
        </ul>
      </section>
      <section className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border bg-background p-5">
          <h2 className="font-semibold">What it can review</h2>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Read access</p>
          <ul className="mt-2 list-disc pl-5 text-sm text-muted-foreground">
            {READ_ACCESS[role].map((line) => <li key={line}>{line}</li>)}
          </ul>
        </div>
        <div className="rounded-2xl border bg-background p-5">
          <h2 className="font-semibold">Actions it can prepare</h2>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Confirmation required</p>
          <ul className="mt-2 list-disc pl-5 text-sm text-muted-foreground">
            {ACTIONS[role].map((line) => <li key={line}>{line}</li>)}
          </ul>
        </div>
      </section>
      <p className="text-xs text-muted-foreground">
        The assistant only sees the active {BRAND.name} workspace your account can access. {BRAND.name} rechecks identity, workspace permissions,
        rate limits and every write confirmation on the server.
      </p>
    </div>
  );
}
