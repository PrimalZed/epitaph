import { Component, ChangeDetectionStrategy } from "@angular/core";
import { mapTo } from "rxjs/operators";
import { RTCService } from "rtc/services/rtc.service";

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
  public submitting: boolean;
  public room;

  constructor(
    public rtc: RTCService
  ) { }

  create(name: string, password: string) {
    this.rtc.create(name, password);
    this.submitting = true;
  }

  join(roomId: string, password: string) {
    console.log(roomId, password);
    this.rtc.join(roomId, password);
    this.submitting = true;
  }

  disconnect() {
    window.alert("Sorry, this button doesn't actually do anything yet. Just refresh the browser to disconnect.");
  }
}
