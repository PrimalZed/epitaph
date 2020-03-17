import { Injectable, OnDestroy, NgZone } from "@angular/core";
import { Observable, Subject, ReplaySubject } from "rxjs";
import { RTCConnectionService } from "./rtc-connection.service";

@Injectable({
  providedIn: "root"
})
export class RTCReceiverService implements OnDestroy {
  private readonly localConnection: RTCPeerConnection = this.connectionService.getConnection(true);
  private readonly internetConnection: RTCPeerConnection = this.connectionService.getConnection(false);
  private channel: RTCDataChannel;
  private readonly answerSubject: Subject<RTCSessionDescriptionInit> = new ReplaySubject(1);
  public readonly answer$: Observable<RTCSessionDescriptionInit> = this.answerSubject.asObservable();
  private readonly messageSubject: Subject<string> = new Subject();
  public readonly message$: Observable<string> = this.messageSubject.asObservable();

  constructor(private connectionService: RTCConnectionService, private zone: NgZone) {
    this.localConnection.ondatachannel = (event) => {
      this.channel = event.channel;
      this.channel.onopen = (ev) => {
        console.log("data channel receiver connect");
      };
      this.channel.onclose = (ev) => {
        console.log("data channel receiver disconnect");
      };
      this.channel.onmessage = (e) => this.zone.run(() => this.onReceiveMessage(e));
    };
    this.internetConnection.ondatachannel = (event) => {
      this.channel = event.channel;
      this.channel.onopen = (ev) => {
        console.log("data channel receiver connect");
      };
      this.channel.onclose = (ev) => {
        console.log("data channel receiver disconnect");
      };
      this.channel.onmessage = (e) => this.zone.run(() => this.onReceiveMessage(e));
    };
    this.internetConnection.onicecandidate = e => 
    this.zone.run(() => {
      if (!e.candidate) {
        this.answerSubject.next((e.target as RTCPeerConnection).localDescription.toJSON());
      }
    });
  }

  private onReceiveMessage(event: MessageEvent) {
    this.messageSubject.next(event.data);
  }

  public createAnswer(url: string) {
    const hashIndex = url.lastIndexOf("#");

    if (hashIndex == -1) {
      return Promise.resolve();
    }

    const sdp = atob(url.substr(hashIndex + 1));

    if (!sdp) {
      return Promise.resolve();
    }
    
    const offer: RTCSessionDescriptionInit = { type: "offer", sdp };
    const local = offer.sdp.includes("c=IN IP4 0.0.0.0");
    const connection = local ? this.localConnection : this.internetConnection;
    connection.setRemoteDescription(offer);
    return connection.createAnswer()
      .then((answer) => {
        console.log("created answer", answer);
        connection.setLocalDescription(answer);
        return answer;
      });
  }

  public send(message: string) {
    if (!this.channel) {
      console.error("no channel open");
      return;
    }

    this.channel.send(JSON.stringify({ message }));
  }

  ngOnDestroy() {
    if (this.channel) {
      this.channel.close();
    }
    this.internetConnection.close();
  }
}
