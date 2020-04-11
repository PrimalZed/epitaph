import { NgZone } from "@angular/core";
import { Subject, Subscription, merge } from "rxjs";
import { filter, mergeMap, tap } from "rxjs/operators";
import { RTCConnectionService } from "./rtc-connection.service";
import { RTCSignallingService, SessionSocketMessage, IceSocketMessage } from "./rtc-signalling.service";

export class RTCService {
  private connections: { [peer: string]: RTCPeerConnection } = {};
  private channels: { [peer: string]: RTCDataChannel } = {};

  private messageSubject: Subject<{ from: string, content: any }> = new Subject();
  public message$ = this.messageSubject.asObservable();

  private subscription: Subscription;

  constructor(
    private me: string,
    private signallingService: RTCSignallingService,
    private connectionService: RTCConnectionService,
    private zone: NgZone
  ) {
    const socketMessage$ = this.signallingService.connect(me);
    const processOffer$ = socketMessage$
      .pipe(
        filter((socketMessage) => socketMessage.type === "offer"),
        mergeMap((socketMessage: SessionSocketMessage) => this.fromOffer(socketMessage.content, socketMessage.from))
      );

    const processAnswer$ = socketMessage$
      .pipe(
        filter((socketMessage) => socketMessage.type === "answer"),
        mergeMap((socketMessage: SessionSocketMessage) => this.connections[socketMessage.from].setRemoteDescription(socketMessage.content))
      );

    const processIceCandidate$ = socketMessage$
      .pipe(
        filter((socketMessage) => socketMessage.type === "icecandidate"),
        mergeMap((socketMessage: IceSocketMessage) => this.connections[socketMessage.from].addIceCandidate(socketMessage.content))
      );

    this.subscription = merge(processOffer$, processAnswer$, processIceCandidate$)
      .subscribe();
  }

  public join(): Promise<void[]> {
    return this.signallingService.join()
      .then((participants) => {
        const offerPromises = participants
          .filter((participant) => participant !== this.me)
          .map((peer) => {            
            const connection = this.connectionService.create();
            connection.onicecandidate = e => this.signalIceCandidate(e.candidate, peer);

            const channel = connection.createDataChannel("dataChannel");
            
            this.initChannel(channel, peer);

            if (this.connections[peer]) {
              this.connections[peer].close();
            }
            this.connections[peer] = connection;

            return connection.createOffer()
              .then((offer) => connection.setLocalDescription(offer).then(() => offer))
              .then((offer) => {
                this.signallingService.sendOffer(offer, peer);
              });
          });
        return Promise.all(offerPromises);
      });
  }
  
  private fromOffer(offer: RTCSessionDescriptionInit, from: string): Promise<void> {
    const connection = this.connectionService.create();
    connection.onicecandidate = e => this.signalIceCandidate(e.candidate, from);
    connection.ondatachannel = (event) => this.initChannel(event.channel, from);

    if (this.connections[from]) {
      this.connections[from].close();
    }
    this.connections[from] = connection;

    connection.setRemoteDescription(offer);
    return connection.createAnswer()
      .then((answer) => connection.setLocalDescription(answer).then(() => answer))
      .then((answer) => {
        this.signallingService.sendAnswer(answer, from);
      });
  }

  private signalIceCandidate(candidate: RTCIceCandidate, peer: string) {
    if (candidate) {
      this.signallingService.sendIceCandidate(candidate.toJSON(), peer);
    }
  }

  private initChannel(channel: RTCDataChannel, peer: string) {
    channel.onopen = (ev) => {
      console.log(this.me, "data channel sender connect");
    };
    channel.onclose = (ev) => {
      console.log(this.me, "data channel sender disconnect");
    };
    channel.onmessage = (ev) => {
      this.zone.run(() => {
        this.messageSubject.next({ from: peer, content: ev.data });
      });
    }

    if (this.channels[peer]) {
      this.channels[peer].close();
    }
    this.channels[peer] = channel;
  }

  public send(message: string) {
    for (let channel of Object.values(this.channels)) {
      channel.send(message);
    }
  }

  public destroy() {
    if (this.subscription && !this.subscription.closed) {
      this.subscription.unsubscribe();
    }
  }
}
