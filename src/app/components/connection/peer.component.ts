import { Component, ChangeDetectionStrategy, OnDestroy } from "@angular/core";
import { RTCService } from "services/rtc.service";

@Component({
  selector: "peer",
  templateUrl: "./peer.component.html",
  styles: [
    `textarea { width: 25rem; height: 12rem; }`
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PeerComponent implements OnDestroy {
  public roomName: string;
  public roomId: string;
  public password: string;
  public outMessage: string;

  constructor(
    public rtc: RTCService
  ) { }

  ngOnDestroy() {
    if (this.rtc) {
      this.rtc.destroy();
    }
  }
}
