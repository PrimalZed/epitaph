import { Component, ChangeDetectionStrategy, Input } from "@angular/core";
import { Table } from "models/table";

@Component({
  selector: "epitaph-table",
  templateUrl: "./table.component.html",
  styles: [
    "table { font-family: futura; font-size: 1.125rem; }",
    "tr:nth-child(even) { background-color: #e1e2ee; }",
    "th,td { padding-right: 1.5rem; }"
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableComponent {
  @Input() table: Table;
}
