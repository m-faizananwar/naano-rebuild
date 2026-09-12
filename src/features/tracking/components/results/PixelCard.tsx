import { PixelDialog } from "./PixelDialog";
import type { PixelStatus } from "../../server/queries";

export function PixelCard({ pixel, origin }: { pixel: PixelStatus; origin: string }) {
  return (
    <section className="rounded-2xl border bg-background p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-semibold">Measure site conversions</h2>
          <p className="max-w-xl text-sm text-muted-foreground">
            Connect the pixel to add visits, sign-ups and revenue to your post results.
          </p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold">
          <span className={pixel.active ? "size-2 rounded-full bg-emerald-500" : "size-2 rounded-full bg-muted-foreground/40"} aria-hidden="true" />
          {pixel.active ? `Active · ${pixel.events} events` : "Not installed yet"}
        </span>
      </div>
      <div className="mt-4">
        <PixelDialog siteKey={pixel.siteKey} origin={origin} active={pixel.active} />
      </div>
    </section>
  );
}
