// The LLM layer's fixed parameters. Provider order lives in src/lib/ai-provider.ts.
export const ANTHROPIC_MODEL = "claude-sonnet-5";
export const GEMINI_MODEL = "gemini-2.5-flash";
export const DEFAULT_TIMEOUT_MS = 20_000;
export const DEFAULT_MAX_TOKENS = 1200;
export const DEFAULT_MAX_RETRIES = 1;
export const ERROR_MESSAGE_MAX = 120;
export const HTTP_UNAUTHORIZED = 401;
export const HTTP_PAYMENT_REQUIRED = 402;
export const HTTP_FORBIDDEN = 403;
// One retry on the next provider after an account-level failure.
export const MAX_PROVIDER_ATTEMPTS = 2;
export const HTTP_BAD_REQUEST = 400;
