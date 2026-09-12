"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ROWS_PER_PAGE_OPTIONS } from "../../constants";

export function RowsPerPage({ value }: { value: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <label htmlFor="rows-per-page">Rows per page</label>
      <select
        id="rows-per-page"
        value={value}
        onChange={(event) => {
          const next = new URLSearchParams(params.toString());
          next.set("per", event.target.value);
          next.delete("page");
          router.push(`${pathname}?${next.toString()}`);
        }}
        className="h-8 rounded-lg border border-input bg-background px-2 text-sm text-foreground"
      >
        {ROWS_PER_PAGE_OPTIONS.map((n) => (
          <option key={n} value={n}>
            {n}
          </option>
        ))}
      </select>
    </div>
  );
}
