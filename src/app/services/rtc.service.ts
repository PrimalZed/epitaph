import { Injectable, NgZone } from "@angular/core";
import { Subject, Subscription, merge } from "rxjs";
import { filter, mergeMap, shareReplay, switchMap } from "rxjs/operators";
import { RTCConnectionService } from "./rtc-connection.service";
import { RTCSignalingService, SessionSignalingMessage, IceSignalingMessage } from "./rtc-signaling.service";
import { RTCRoomsService } from "./rtc-rooms.service";

@Injectable({
  providedIn: "root"
})
export class RTCService {
  private connections: { [peer: string]: RTCPeerConnection } = {};
  private channels: { [peer: string]: RTCDataChannel } = {};

  public rooms$ = this.roomsService.list();

  private messageSubject: Subject<{ from: string, content: any }> = new Subject();
  public message$ = this.messageSubject.asObservable();

  private connectSignalingPromise: Promise<void>;

  private createSubject: Subject<{ name: string, password: string }> = new Subject();
  private create$ = this.createSubject
    .pipe(
      switchMap(({ name, password }) => this.connectSignaling().then(() => ({ name, password }))),
      switchMap(({ name, password }) => this.signalingService.create(name, password))
    );

  private joinSubject: Subject<{ roomId: string, password: string }> = new Subject();
  private join$ = this.joinSubject
    .pipe(
      switchMap(({ roomId, password }) => this.connectSignaling().then(() => ({ roomId, password }))),
      switchMap(({ roomId, password }) => this.signalingService.join(roomId, password))
    );

  public createConnections$ = this.signalingService.members$
    .pipe(
      switchMap((peers) => {
        const offerPromises = peers
          .map((peer) => {            
            const connection = this.createConnection(peer);

            const channel = connection.createDataChannel("dataChannel");
            
            this.initChannel(channel, peer);

            return connection.createOffer()
              .then((offer) => connection.setLocalDescription(offer).then(() => offer))
              .then((offer) => {
                this.signalingService.sendOffer(offer, peer);
              });
          });
        return Promise.all(offerPromises);
      }),
      shareReplay(1)
    );

  private processOffer$ = this.signalingService.message$
    .pipe(
      filter((signalMessage) => signalMessage.type === "offer"),
      mergeMap((signalMessage: SessionSignalingMessage) => this.fromOffer(signalMessage.content, signalMessage.from))
    );

  private processAnswer$ = this.signalingService.message$
    .pipe(
      filter((signalMessage) => signalMessage.type === "answer"),
      mergeMap((signalMessage: SessionSignalingMessage) => this.connections[signalMessage.from].setRemoteDescription(signalMessage.content))
    );

  private processIceCandidate$ = this.signalingService.message$
    .pipe(
      filter((signalMessage) => signalMessage.type === "icecandidate"),
      mergeMap((signalMessage: IceSignalingMessage) => this.connections[signalMessage.from].addIceCandidate(signalMessage.content))
    );

  private subscription: Subscription = merge(
      this.create$,
      this.join$,
      this.createConnections$,
      this.processOffer$,
      this.processAnswer$,
      this.processIceCandidate$
    )
    .subscribe();

  constructor(
    private roomsService: RTCRoomsService,
    private signalingService: RTCSignalingService,
    private connectionService: RTCConnectionService,
    private zone: NgZone
  ) { }

  connectSignaling(): Promise<void> {
    if (!this.connectSignalingPromise) {
      this.connectSignalingPromise = this.signalingService.connect();
    }
    return this.connectSignalingPromise
  }

  public create(name: string, password: string) {
    this.createSubject.next({ name, password });
  }

  public join(roomId: string, password: string) {
    this.joinSubject.next({ roomId, password });
  }
  
  private fromOffer(offer: RTCSessionDescriptionInit, from: string): Promise<void> {
    const connection = this.createConnection(from);
    
    connection.ondatachannel = (event) => this.initChannel(event.channel, from);

    connection.setRemoteDescription(offer);
    return connection.createAnswer()
      .then((answer) => connection.setLocalDescription(answer).then(() => answer))
      .then((answer) => {
        this.signalingService.sendAnswer(answer, from);
      });
  }

  private signalIceCandidate(candidate: RTCIceCandidate, peer: string) {
    if (candidate) {
      this.signalingService.sendIceCandidate(candidate.toJSON(), peer);
    }
  }

  private createConnection(peer: string) {
    const connection = this.connectionService.create();
    connection.onicecandidate = e => this.signalIceCandidate(e.candidate, peer);
    connection.onconnectionstatechange = e => this.cleanConnections();

    if (this.connections[peer]) {
      this.connections[peer].close();
    }
    this.connections[peer] = connection;

    return connection;
  }

  private initChannel(channel: RTCDataChannel, peer: string) {
    channel.onopen = (ev) => {
      console.log("data channel connect", peer);
    };
    channel.onclose = (ev) => {
      console.log("data channel disconnect", peer);
      this.cleanChannels();
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
    const openChannels = Object.values(this.channels)
      .filter((channel) => channel.readyState === "open");
    for (let channel of openChannels) {
      channel.send(message);
    }
  }

  private cleanConnections() {
    const closedConnections = Object.entries(this.connections)
      .filter(([peer, connection]) => ["closed", "disconnected", "failed"].includes(connection.connectionState));
    for (let [peer, connection] of closedConnections) {
      const channel = this.channels[peer];
      if (channel) {
        channel.close();
      }
      connection.close();
      delete this.connections[peer];
    }
    
    const orphanedChannels = Object.entries(this.channels)
      .filter(([peer, channel]) => !Object.keys(this.connections).includes(peer));
    for (let [peer, channel] of orphanedChannels) {
      channel.close();
    }
  }

  private cleanChannels() {
    const closedChannels = Object.entries(this.channels)
      .filter(([peer, channel]) => channel.readyState === "closed");
    for (let [peer, channel] of closedChannels) {
      delete this.channels[peer];
    }
  }

  public destroy() {
    if (this.subscription && !this.subscription.closed) {
      this.subscription.unsubscribe();
    }
  }
}
