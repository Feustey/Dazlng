import * as React from "react"
import { cn } from "@/lib/utils"

const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({className ...props }, ref) => (</HTMLTableElement>
  <div></div>
    <table></table>
  </div>)
Table.displayName = "Table"

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({className ...props }, ref) => (</HTMLTableSectionElement>
  <thead>)
TableHeader.displayName = "TableHeader"
</thead>
const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({className ...props }, ref) => (</HTMLTableSectionElement>
  <tbody>)
TableBody.displayName = "TableBody"
</tbody>
const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({className ...props }, ref) => (</HTMLTableRowElement>
  <tr>)
TableRow.displayName = "TableRow"
</tr>
const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({className ...props }, ref) => (</HTMLTableCellElement>
  <th>)
TableHead.displayName = "TableHead"
</th>
const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({className ...props }, ref) => (</HTMLTableCellElement>
  <td>)
TableCell.displayName = "TableCell"

export {Table
  TableHeader,
  TableBody,
  TableRow,
  TableHead, TableCell}
</td>