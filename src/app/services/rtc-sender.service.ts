import { Injectable, OnDestroy, NgZone } from "@angular/core";
import { Observable, Subject, ReplaySubject } from "rxjs";
import { RTCConnectionService } from "./rtc-connection.service";

@Injectable({
  providedIn: "root"
})
export class RTCSenderService implements OnDestroy {
  private readonly localConnection: RTCPeerConnection = this.connectionService.getConnection(true);
  private readonly internetConnection: RTCPeerConnection = this.connectionService.getConnection(false);
  private readonly localChannel: RTCDataChannel = this.localConnection.createDataChannel("sendDataChannel");
  private readonly internetChannel: RTCDataChannel = this.internetConnection.createDataChannel("sendDataChannel");

  private readonly offerSubject: Subject<RTCSessionDescriptionInit> = new ReplaySubject(1);
  public readonly offer$: Observable<RTCSessionDescriptionInit> = this.offerSubject.asObservable();
  

  private readonly messageSubject: Subject<string> = new Subject();
  public readonly message$: Observable<string> = this.messageSubject.asObservable();

  constructor(private connectionService: RTCConnectionService, private zone: NgZone) {
    this.internetConnection.onicecandidate = e => 
      this.zone.run(() => {
        if (!e.candidate) {
          this.offerSubject.next((e.target as RTCPeerConnection).localDescription.toJSON());
        }
      });
    
    this.internetChannel.onopen = (ev) => {
      console.log("data channel sender connect");
    };
    this.internetChannel.onclose = (ev) => {
      console.log("data channel sender disconnect");
    };
  }

  public createOffer() {
    this.internetConnection.createOffer()
      .then((offer) => {
        this.internetConnection.setLocalDescription(offer);
      });
  }

  public setReceiver(sdp: string) {
    const answer: RTCSessionDescriptionInit = { type: "answer", sdp };
    this.internetConnection.setRemoteDescription(answer);
  }

  public send(message: string) {
    this.internetChannel.send(JSON.stringify({ message }));
  }

  ngOnDestroy() {
    this.internetChannel.close();
    this.localConnection.close();
    this.internetConnection.close();
  }
}
