import { CASE_STUDY_PAGE } from "../../page-copy";
import { CreatorAvatar } from "../shared/CreatorAvatar";
import { LinkedInMark } from "../shared/LinkedInMark";

type Section = (typeof CASE_STUDY_PAGE.sections)[number];

function Aside({ section }: { section: Section }) {
  if ("compare" in section) {
    return (
      <dl className="mt-6 grid gap-px overflow-hidden rounded-2xl border bg-border sm:grid-cols-2">
        {section.compare.map((item, index) => (
          <div key={item.label} className="bg-card p-5">
            <dt className="text-xs text-muted-foreground">{item.label}</dt>
            <dd className={`mt-1 text-2xl font-bold tracking-tight ${index === 1 ? "text-destructive" : ""}`}>{item.value}</dd>
            <p className="text-xs text-muted-foreground">{item.sub}</p>
          </div>
        ))}
      </dl>
    );
  }
  if ("post" in section) {
    return (
      <div className="mt-6 rounded-2xl border bg-card p-5">
        <div className="flex items-center gap-3">
          <CreatorAvatar name="Creator" className="size-10" />
          <div>
            <p className="inline-flex items-center gap-1.5 text-sm font-semibold">
              {section.post.title}
              <LinkedInMark />
            </p>
            <p className="text-xs text-muted-foreground">{section.post.sub}</p>
          </div>
        </div>
        <p className="mt-3 text-sm text-foreground/80">{section.post.text}</p>
      </div>
    );
  }
  return null;
}

// The numbered 01–03 sections of the BlogSEO story.
export function CaseStudyNarrative() {
  return (
    <section className="px-4 py-24 sm:px-6">
      <div className="mx-auto max-w-6xl space-y-20">
        {CASE_STUDY_PAGE.sections.map((section) => (
          <div key={section.n} className="lg:grid lg:grid-cols-[1fr_2fr] lg:gap-12">
            <div>
              <p className="text-xs text-muted-foreground">{section.n}</p>
              <h2 className="mt-1 text-3xl font-bold tracking-tight">{section.title}</h2>
            </div>
            <div className="mt-6 lg:mt-0">
              <p className="text-xl font-medium leading-snug">{section.lead}</p>
              {section.body.map((paragraph) => (
                <p key={paragraph} className="mt-4 text-foreground/70">
                  {paragraph}
                </p>
              ))}
              <Aside section={section} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
