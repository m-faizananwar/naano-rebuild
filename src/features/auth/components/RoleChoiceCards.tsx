import Link from "next/link";

const ROLES = [
  {
    href: "/register/creator",
    title: "I'm a creator",
    body: "Get paid to create LinkedIn content for B2B brands you actually use.",
  },
  {
    href: "/register/brand",
    title: "I'm a brand",
    body: "Find creators, launch campaigns, and trace real pipeline back to each post.",
  },
];

export function RoleChoiceCards() {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">Create your account</h1>
      <p className="mt-2 text-sm text-muted-foreground">First, who are you here as?</p>
      <div className="mt-7 grid gap-4">
        {ROLES.map((role) => (
          <Link
            key={role.href}
            href={role.href}
            className="block rounded-2xl border bg-card p-5 transition-colors hover:border-brand focus-visible:border-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
          >
            <span className="block font-semibold">{role.title}</span>
            <span className="mt-1 block text-sm text-muted-foreground">{role.body}</span>
          </Link>
        ))}
      </div>
      <p className="mt-7 text-center text-xs text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-brand hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
