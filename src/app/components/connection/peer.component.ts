import { Component, ChangeDetectionStrategy, NgZone, OnInit, OnDestroy, Input } from "@angular/core";
import { RTCConnectionService } from "services/rtc-connection.service";
import { RTCSignallingService } from "services/rtc-signalling.service";
import { RTCService } from "services/rtc.service";

@Component({
  selector: "peer",
  templateUrl: "./peer.component.html",
  styles: [
    `textarea { width: 25rem; height: 12rem; }`
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PeerComponent implements OnInit, OnDestroy {
  @Input() me: string;
  public rtc: RTCService;
  public outMessage: string;

  constructor(
    private connectionService: RTCConnectionService,
    private signallingService: RTCSignallingService,
    private zone: NgZone
  ) { }

  ngOnInit() {
    this.rtc = new RTCService(this.me, this.signallingService, this.connectionService, this.zone);
  }

  ngOnDestroy() {
    if (this.rtc) {
      this.rtc.destroy();
    }
  }
}
