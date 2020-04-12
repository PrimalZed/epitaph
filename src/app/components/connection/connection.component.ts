import { Component, ChangeDetectionStrategy } from "@angular/core";
import { mapTo } from "rxjs/operators";
import { RTCService } from "services/rtc.service";

@Component({
  selector: "connection",
  templateUrl: "./connection.component.html",
  styles: [
    `textarea { width: 25rem; height: 12rem; }`
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConnectionComponent {
  public connected$ = this.rtc.createConnections$.pipe(mapTo(true));
  constructor(
    public rtc: RTCService
  ) { }

  ngOnDestroy() {
    if (this.rtc) {
      this.rtc.destroy();
    }
  }
}
