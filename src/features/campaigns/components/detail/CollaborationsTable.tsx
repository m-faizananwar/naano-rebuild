import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDay } from "@/lib/dates";
import { formatCents } from "@/lib/money";
import { COLLAB_NEXT_ACTION } from "../../constants";
import type { CollaborationRowDto } from "../../schemas";
import { StatusBadge } from "./StatusBadge";

// Read-only here: actions and the review modal live on /brand/collaborations.
export function CollaborationsTable({ rows }: { rows: CollaborationRowDto[] }) {
  return (
    <div className="overflow-x-auto rounded-2xl border bg-background">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Creator</TableHead>
            <TableHead>Campaign</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Next action</TableHead>
            <TableHead>Due date</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead>Updated</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell>
                <Link href={`/brand/collaborations/${row.id}`} className="flex items-center gap-2 font-medium hover:underline">
                  <Avatar className="size-7">
                    <AvatarImage src={row.creatorAvatarUrl} alt="" />
                    <AvatarFallback>{row.creatorName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="whitespace-nowrap">{row.creatorName}</span>
                </Link>
              </TableCell>
              <TableCell className="max-w-48 truncate text-muted-foreground">{row.campaignName}</TableCell>
              <TableCell>
                <StatusBadge status={row.status} />
              </TableCell>
              <TableCell className="whitespace-nowrap text-muted-foreground">{COLLAB_NEXT_ACTION[row.status]}</TableCell>
              <TableCell className="whitespace-nowrap">{formatDay(row.dueDate)}</TableCell>
              <TableCell className="text-right tabular-nums">{formatCents(row.feeCents, "EUR")}</TableCell>
              <TableCell className="whitespace-nowrap text-muted-foreground">{formatDay(row.updatedAt)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
