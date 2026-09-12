import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { FAQ } from "../../constants";
import { FaqList } from "../shared/FaqList";

export function FaqSection() {
  return (
    <section id="faq" className="scroll-mt-20 bg-background px-4 py-24 sm:px-6">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1fr_1.6fr]">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <h2 className="text-4xl font-bold tracking-[-0.03em] sm:text-5xl">{FAQ.title}</h2>
          <p className="mt-4 text-lg text-muted-foreground">{FAQ.sub}</p>
          <p className="mt-6 text-sm text-muted-foreground">
            Still have questions?{" "}
            <Link href={FAQ.contact.href} className="inline-flex items-center gap-1 font-semibold text-foreground hover:underline">
              {FAQ.contact.label}
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </Link>
          </p>
        </div>
        <FaqList items={FAQ.items} />
      </div>
    </section>
  );
}
