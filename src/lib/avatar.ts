// Deterministic placeholder avatar for a handle (the same generator the seed
// and the register action use), so a card previewed before sign-up shows the
// face the account will get.
export function avatarFor(handle: string): string {
  return `https://api.dicebear.com/9.x/notionists/svg?seed=${encodeURIComponent(handle)}`;
}
