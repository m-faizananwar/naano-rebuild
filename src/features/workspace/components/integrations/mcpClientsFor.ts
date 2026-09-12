import { MCP_SETUPS } from "../../constants";

export type McpClientSetup = {
  key: string;
  client: string;
  title: string;
  lead: string;
  steps: readonly string[];
  secondary: string;
  triggerLabel: string;
};

const byKey = (key: (typeof MCP_SETUPS)[number]["key"]) => {
  // The constants are a fixed tuple; every key used below exists in it.
  const found = MCP_SETUPS.find((s) => s.key === key);
  if (!found) throw new Error(`unknown MCP setup ${key}`);
  return found;
};

// Gemini CLI, Cursor and GitHub Copilot use naano's "Any MCP client" three
// steps with the client's name; Claude / ChatGPT keep their own text.
function generic(key: string, client: string): McpClientSetup {
  const other = byKey("other");
  return { key, client, title: `Set up Naano in ${client}`, lead: other.lead, steps: other.steps, secondary: `Open ${client}`, triggerLabel: `Connect ${client}` };
}

// Brand: naano's three cards with "View setup". Creator: the six-client grid
// from "Connect your AI assistant", each with a "Connect {client}" dialog.
export function mcpClientsFor(role: "brand" | "creator"): McpClientSetup[] {
  if (role === "brand") return MCP_SETUPS.map((s) => ({ ...s, triggerLabel: "View setup" }));
  const claude = byKey("claude");
  const chatgpt = byKey("chatgpt");
  const other = byKey("other");
  return [
    { ...claude, triggerLabel: "Connect Claude" },
    { ...chatgpt, triggerLabel: "Connect ChatGPT" },
    generic("gemini", "Gemini CLI"),
    generic("cursor", "Cursor"),
    generic("copilot", "GitHub Copilot"),
    { ...other, client: "Other MCP client", triggerLabel: "Connect another client" },
  ];
}
