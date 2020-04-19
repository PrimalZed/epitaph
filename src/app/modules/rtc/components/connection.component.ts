import { Component, ChangeDetectionStrategy } from "@angular/core";
import { Store, select } from "@ngrx/store";
import { merge } from "rxjs";
import { mapTo, tap } from "rxjs/operators";
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
  public connected$ = merge(
      this.rtc.open$.pipe(mapTo(true)),
      this.rtc.leave$.pipe(mapTo(false)),
      this.rtc.close$.pipe(mapTo(false))
    )
    .pipe(
      tap(() => {
        this.submitting = false;
      })
    );

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
    this.rtc.join(roomId, password);
    this.submitting = true;
  }

  disconnect() {
    this.rtc.leave();
  }
}
