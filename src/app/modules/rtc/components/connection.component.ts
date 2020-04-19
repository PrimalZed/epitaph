import { Component, ChangeDetectionStrategy } from "@angular/core";
import { Store, select } from "@ngrx/store";
import { mapTo } from "rxjs/operators";
import { RTCService } from "rtc/services/rtc.service";
import { RTCState } from "rtc/store/rtc-state";
import { selectTotalChannels } from "rtc/store/channels/channels.selectors";
import { selectHost } from "rtc/store/host/host.selectors";

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

  public peerCount$ = this.store.pipe(select(selectTotalChannels));
  public host$ = this.store.pipe(select(selectHost));

  constructor(
    public rtc: RTCService,
    public store: Store<RTCState>
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
