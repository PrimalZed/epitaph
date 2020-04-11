import { Component, ChangeDetectionStrategy } from "@angular/core";

@Component({
  selector: "connection",
  templateUrl: "./connection.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConnectionComponent {
  public participants = ["a","b"];
}
