// The floating assistant: naano's pill, and the brain behind typed messages.
export const PHRASES = ["What would you like to see?", "What would you like to do?", "What can I help you find?"] as const;
export const PHRASE_INTERVAL_MS = 4000;

export const PILL_WIDTH = 360;
export const PILL_HEIGHT = 48;
export const BUBBLE_SIZE = 48;
export const PANEL_RADIUS = 20;
export const PANEL_MAX_VH = 60;
export const EDGE_GAP = 16;

export const STORAGE_KEYS = { conversation: "amplio.assistant.conversation", collapsed: "amplio.assistant.collapsed", cookies: "amplio.cookies.ok" } as const;

export const MESSAGE_MAX_CHARS = 500;
export const ANSWER_MAX_WORDS = 80;
export const ANSWER_MAX_TOKENS = 220;
export const CONTEXT_LIST_MAX = 8;
export const HISTORY_MAX = 6;

// Liquid container knobs from the library's own example.
export const LIQUID = { blur: 6, contrast: 18, fill: "rgba(255,255,255,0.72)", shadow: "0 10px 30px -12px rgba(13,12,11,.28), 0 1px 2px rgba(13,12,11,.08)" } as const;
