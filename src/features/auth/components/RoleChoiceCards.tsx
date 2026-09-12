import { ArrowRight, Building2, PenLine } from "lucide-react";
import Link from "next/link";

const ROLES = [
  {
    href: "/register/creator",
    icon: PenLine,
    title: "I'm a creator",
    body: "Get paid to create LinkedIn content for B2B brands you actually use.",
  },
  {
    href: "/register/brand",
    icon: Building2,
    title: "I'm a brand",
    body: "Find creators, launch campaigns, and trace real pipeline back to each post.",
  },
];

export function RoleChoiceCards() {
  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight">Create your account</h1>
      <p className="mt-2 text-muted-foreground">First, who are you here as?</p>
      <div className="mt-8 grid gap-4">
        {ROLES.map((role) => (
          <Link
            key={role.href}
            href={role.href}
            className="group flex items-center gap-4 rounded-2xl border bg-card p-5 transition-colors hover:border-brand focus-visible:border-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
          >
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
              <role.icon className="size-5" aria-hidden="true" />
            </span>
            <span className="flex-1">
              <span className="block font-semibold">{role.title}</span>
              <span className="block text-sm text-muted-foreground">{role.body}</span>
            </span>
            <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </Link>
        ))}
      </div>
      <p className="mt-6 text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-brand hover:underline">
          Sign in here
        </Link>
      </p>
    </div>
  );
}
