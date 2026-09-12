import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type Props = { columns: readonly string[]; rows: readonly (readonly string[])[]; caption: string };

// Wide tables scroll inside their own container; the page never scrolls sideways.
export function DataTable({ columns, rows, caption }: Props) {
  return (
    <div className="overflow-x-auto rounded-2xl border">
      <Table>
        <caption className="sr-only">{caption}</caption>
        <TableHeader>
          <TableRow className="bg-muted/40">
            {columns.map((column) => (
              <TableHead key={column} className="text-[0.65rem] font-semibold uppercase tracking-wider text-muted-foreground">
                {column}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row[0]}>
              {row.map((cell, index) => (
                <TableCell key={`${row[0]}-${index}`} className={index === 0 ? "font-medium" : "text-muted-foreground"}>
                  {cell}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
