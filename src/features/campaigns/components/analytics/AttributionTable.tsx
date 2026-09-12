import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { AnalyticsDto } from "../../schemas";

export function AttributionTable({ rows }: { rows: AnalyticsDto["byCreator"] }) {
  return (
    <section className="rounded-2xl border bg-background p-5">
      <h2 className="text-lg font-semibold">Attribution by creator</h2>
      {rows.length === 0 ? (
        <p className="mt-3 text-sm text-muted-foreground">No attributed activity yet.</p>
      ) : (
        <Table className="mt-3">
          <TableHeader>
            <TableRow>
              <TableHead>Creator</TableHead>
              <TableHead className="text-right">Clicks</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.creatorId}>
                <TableCell>
                  <span className="flex items-center gap-2 font-medium">
                    <Avatar className="size-7">
                      <AvatarImage src={row.avatarUrl} alt="" />
                      <AvatarFallback>{row.creatorName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {row.creatorName}
                  </span>
                </TableCell>
                <TableCell className="text-right tabular-nums">{row.clicks.toLocaleString("en-GB")}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </section>
  );
}
