import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { CreatorAttribution } from "../../server/queries";
import { ExportCsvButton } from "./ExportCsvButton";

export function AttributionTable({ rows, exportPath }: { rows: CreatorAttribution[]; exportPath: string }) {
  return (
    <section className="rounded-2xl border bg-background p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-semibold">Attribution by creator</h2>
          <p className="text-sm text-muted-foreground">Every click is a row in the click log; the CSV is the audit trail.</p>
        </div>
        <ExportCsvButton href={exportPath} label="Export all clicks (CSV)" />
      </div>
      {rows.length === 0 ? (
        <p className="mt-6 text-sm text-muted-foreground">No attributed activity yet.</p>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Creator</TableHead>
                <TableHead>Campaign</TableHead>
                <TableHead className="text-right">Clicks</TableHead>
                <TableHead className="text-right">Visits</TableHead>
                <TableHead className="text-right">Sign-ups</TableHead>
                <TableHead className="text-right">Purchases</TableHead>
                <TableHead className="text-right">Log</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={`${r.creatorId}-${r.campaign}`}>
                  <TableCell>
                    <span className="flex items-center gap-2">
                      <Avatar className="size-7">
                        <AvatarImage src={r.avatarUrl} alt="" />
                        <AvatarFallback>{r.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{r.name}</span>
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{r.campaign}</TableCell>
                  <TableCell className="text-right font-medium">{r.clicks.toLocaleString("en-US")}</TableCell>
                  <TableCell className="text-right">{r.visits}</TableCell>
                  <TableCell className="text-right">{r.signups}</TableCell>
                  <TableCell className="text-right">{r.purchases}</TableCell>
                  <TableCell className="text-right">
                    <ExportCsvButton href={`${exportPath}?creator=${r.creatorId}`} label="CSV" size="xs" variant="ghost" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </section>
  );
}
