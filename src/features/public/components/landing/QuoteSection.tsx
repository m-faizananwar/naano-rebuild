import { QUOTE } from "../../constants";
import { CreatorAvatar } from "../shared/CreatorAvatar";

export function QuoteSection() {
  return (
    <section className="bg-background px-4 py-24 sm:px-6">
      <figure className="mx-auto max-w-4xl text-center">
        <p className="font-serif text-2xl tracking-[0.2em] text-foreground">{`{ zmirov }`}</p>
        <p className="text-[0.6rem] uppercase tracking-[0.3em] text-muted-foreground">communication</p>
        <span aria-hidden="true" className="mx-auto mt-3 block h-0.5 w-10 bg-brand" />
        <blockquote className="mt-10 text-3xl font-medium leading-tight tracking-tight text-foreground/35 sm:text-5xl">
          “{QUOTE.text} <span className="text-brand">{QUOTE.highlight}</span>”
        </blockquote>
        <figcaption className="mt-12 flex flex-col items-center">
          <CreatorAvatar name={QUOTE.author} className="size-20" />
          <p className="mt-4 font-semibold">{QUOTE.author}</p>
          <p className="text-sm text-foreground/70">{QUOTE.role}</p>
          <p className="text-sm text-muted-foreground">{QUOTE.kind}</p>
        </figcaption>
      </figure>
    </section>
  );
}
