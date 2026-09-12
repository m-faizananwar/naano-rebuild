import { LogOut } from "lucide-react";
import { CSRF_FIELD } from "@/features/auth/constants";
import { logout } from "@/features/auth/server/actions";

// A real form POST to the logout action, carrying the session's CSRF token.
export function SignOutButton({ csrfToken, className }: { csrfToken: string; className?: string }) {
  return (
    <form action={logout}>
      <input type="hidden" name={CSRF_FIELD} value={csrfToken} />
      <button type="submit" className={className}>
        <LogOut className="size-4 shrink-0" aria-hidden="true" />
        Sign out
      </button>
    </form>
  );
}
