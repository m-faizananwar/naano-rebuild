import type { Brief } from "../../schemas";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border bg-background p-5">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</h3>
      <div className="mt-3 space-y-3 text-sm">{children}</div>
    </section>
  );
}

function Chips({ items, empty }: { items: string[]; empty: string }) {
  if (items.length === 0) return <p className="text-muted-foreground">{empty}</p>;
  return (
    <ul className="flex flex-wrap gap-1.5">
      {items.map((item) => (
        <li key={item} className="rounded-full border px-2.5 py-0.5 text-xs font-medium">
          {item}
        </li>
      ))}
    </ul>
  );
}

function Lines({ items, empty }: { items: string[]; empty: string }) {
  if (items.length === 0) return <p className="text-muted-foreground">{empty}</p>;
  return (
    <ul className="list-disc space-y-1 pl-5">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

// The Brief tab read view, sectioned like naano's (product map, "Brief tab").
export function BriefReadView({ brief }: { brief: Brief }) {
  return (
    <div className="grid gap-4">
      <Section title="Context & objective">
        <p className="whitespace-pre-line leading-relaxed">{brief.whatToTell || "Nothing written yet."}</p>
        {brief.links.length > 0 ? (
          <div>
            <p className="font-medium">Links and examples</p>
            <ul className="mt-1 space-y-1">
              {brief.links.map((link) => (
                <li key={link}>
                  <a href={link} target="_blank" rel="noreferrer" className="break-all text-brand hover:underline">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </Section>
      <Section title="Audience & tone">
        <div>
          <p className="font-medium">Target industries</p>
          <div className="mt-1">
            <Chips items={brief.targetIndustries} empty="No industry selected." />
          </div>
        </div>
        <div>
          <p className="font-medium">Target geographies</p>
          <div className="mt-1">
            <Chips items={brief.targetGeos} empty="No geography selected." />
          </div>
        </div>
        <p>
          <span className="font-medium">Tone: </span>
          {brief.tone || "Not set."}
        </p>
      </Section>
      <Section title="Editorial rules">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="font-medium">Do</p>
            <div className="mt-1">
              <Lines items={brief.do} empty="No rules yet." />
            </div>
          </div>
          <div>
            <p className="font-medium">Avoid</p>
            <div className="mt-1">
              <Lines items={brief.avoid} empty="No rules yet." />
            </div>
          </div>
        </div>
      </Section>
      <Section title="Angles & post examples">
        {brief.angles.length === 0 ? <p className="text-muted-foreground">No angles yet.</p> : null}
        {brief.angles.map((angle, i) => (
          <article key={`${i}-${angle.angle}`} className="rounded-xl border p-4">
            <p className="text-xs font-semibold text-muted-foreground tabular-nums">{String(i + 1).padStart(2, "0")}</p>
            <h4 className="mt-1 font-semibold">{angle.angle}</h4>
            {angle.hook ? <p className="mt-2 italic">“{angle.hook}”</p> : null}
            {angle.direction ? (
              <p className="mt-2 text-muted-foreground">
                <span className="font-medium text-foreground">Editorial direction · </span>
                {angle.direction}
              </p>
            ) : null}
            {angle.example ? (
              <div className="mt-3 rounded-lg bg-muted p-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Post example</p>
                <p className="mt-1 whitespace-pre-line">{angle.example}</p>
              </div>
            ) : null}
          </article>
        ))}
      </Section>
    </div>
  );
}
