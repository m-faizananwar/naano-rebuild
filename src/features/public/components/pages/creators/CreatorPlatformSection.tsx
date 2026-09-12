import { Banknote, CreditCard, LayoutGrid, MessagesSquare, User } from "lucide-react";
import { NaanoWordmark } from "@/components/NaanoWordmark";
import { FOR_CREATORS } from "../../../page-copy";
import { SectionHeading } from "../../shared/SectionHeading";

const P = FOR_CREATORS.platform;
const SIDEBAR = [
  { icon: LayoutGrid, label: "Overview", active: true },
  { icon: MessagesSquare, label: "Deals" },
  { icon: Banknote, label: "Earnings" },
  { icon: CreditCard, label: "Payments" },
  { icon: User, label: "Profile" },
];

function DashboardMock() {
  return (
    <div className="overflow-hidden rounded-2xl bg-card shadow-xl ring-1 ring-border/60" aria-hidden="true">
      <div className="flex items-center gap-2 border-b px-4 py-2.5 text-[0.7rem] text-muted-foreground">
        <span className="flex gap-1">
          <span className="size-2 rounded-full bg-destructive/60" />
          <span className="size-2 rounded-full bg-amber-400" />
          <span className="size-2 rounded-full bg-success/60" />
        </span>
        naano.com/overview
      </div>
      <div className="grid sm:grid-cols-[10rem_1fr]">
        <div className="hidden border-r p-4 sm:block">
          <NaanoWordmark className="text-sm" />
          <ul className="mt-5 space-y-1">
            {SIDEBAR.map((item) => (
              <li key={item.label} className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-xs ${item.active ? "bg-brand-soft font-semibold text-brand" : "text-muted-foreground"}`}>
                <item.icon className="size-3.5" />
                {item.label}
              </li>
            ))}
          </ul>
        </div>
        <div className="p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <p className="font-semibold">{P.dashboard.greeting}</p>
            <span className="hidden rounded-full border px-2 py-0.5 text-[0.6rem] text-muted-foreground sm:inline">● {P.dashboard.status}</span>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {P.dashboard.tiles.map((tile) => (
              <div key={tile.label} className="rounded-xl border p-3">
                <p className="text-[0.55rem] font-semibold uppercase tracking-wider text-muted-foreground">{tile.label}</p>
                <p className="mt-1 text-lg font-bold">{tile.value}</p>
                <p className="text-[0.6rem] text-muted-foreground">{tile.sub}</p>
              </div>
            ))}
          </div>
          <p className="mt-5 text-xs font-semibold">Active collaborations</p>
          <table className="mt-2 w-full text-left text-[0.65rem]">
            <thead className="text-[0.55rem] uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="py-1.5 font-medium">Company</th>
                <th className="py-1.5 font-medium">Status</th>
                <th className="py-1.5 text-right font-medium">Earnings</th>
              </tr>
            </thead>
            <tbody>
              {P.dashboard.rows.map((row) => (
                <tr key={row.company} className="border-t">
                  <td className="py-2 font-medium">
                    {row.company} <span className="ml-1 rounded-full bg-brand-soft px-1.5 text-[0.5rem] text-brand">{row.tag}</span>
                  </td>
                  <td className={`py-2 ${row.status === "Active" ? "text-success" : "text-amber-600"}`}>● {row.status}</td>
                  <td className="py-2 text-right font-semibold text-success">{row.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export function CreatorPlatformSection() {
  return (
    <section id="how-it-works" className="scroll-mt-20 bg-muted/30 px-4 py-24 sm:px-6">
      <SectionHeading eyebrow={P.eyebrow} title={P.title} sub={P.sub} />
      <div className="mx-auto mt-12 max-w-5xl">
        <DashboardMock />
      </div>
      <ul className="mx-auto mt-8 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {P.features.map((feature) => (
          <li key={feature.title} className="rounded-2xl bg-card p-5 ring-1 ring-border/60">
            <h3 className="font-semibold">{feature.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{feature.body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
