// What the shell needs to know about who is looking. Built by the layouts;
// a "preview" viewer is used when the database is not configured.
export type ShellViewer = {
  role: "brand" | "creator";
  firstName: string;
  lastName: string;
  workspace: string;
  avatarUrl: string | null;
  walletCents: number;
  csrfToken: string;
  preview: boolean;
  notifications: ShellNotification[];
};

export type ShellNotification = { id: string; title: string; body: string; href: string; at: string };

export function initialsOf(viewer: Pick<ShellViewer, "firstName" | "lastName">) {
  return `${viewer.firstName.charAt(0)}${viewer.lastName.charAt(0)}`.toUpperCase() || "N";
}
