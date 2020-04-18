import { Injectable, OnDestroy, NgZone } from "@angular/core";
import { Store, select } from "@ngrx/store";
import { Subject, Subscription, merge } from "rxjs";
import { filter, first, map, mergeMap, shareReplay, switchMap, tap } from "rxjs/operators";
import { RTCState } from "rtc/store/rtc-state";
import { RTCConnectionService } from "./rtc-connection.service";
import { RTCSignalingService, SessionSignalingMessage, IceSignalingMessage } from "./rtc-signaling.service";
import { RTCRoomsService } from "./rtc-rooms.service";
import { upsertChannel, removeChannel } from "rtc/store/channels/channels.actions";
import { selectAllChannels } from "rtc/store/channels/channels.selectors";
import { setRemoteDescription, addIceCandidate, upsertConnection, removeConnection } from "rtc/store/connections/connections.actions";

@Injectable()
export class RTCService implements OnDestroy {
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
      tap((signalMessage: SessionSignalingMessage) => this.store.dispatch(setRemoteDescription({ peer: signalMessage.from, description: signalMessage.content })))
    );

  private processIceCandidate$ = this.signalingService.message$
    .pipe(
      filter((signalMessage) => signalMessage.type === "icecandidate"),
      tap((signalMessage: IceSignalingMessage) => this.store.dispatch(addIceCandidate({ peer: signalMessage.from, candidate: signalMessage.content })))
    );

  private sendSubject: Subject<any> = new Subject();
  private sendMessage$ = this.sendSubject
    .pipe(
      mergeMap((message) => this.store
        .pipe(
          select(selectAllChannels),
          first(),
          map((channels) => channels.filter((channel) => channel.readyState === "open")),
          tap((channels) => channels.forEach((channel) => channel.send(message)))
        )
      )
    );

  private subscription: Subscription = merge(
      this.create$,
      this.join$,
      this.createConnections$,
      this.processOffer$,
      this.processAnswer$,
      this.processIceCandidate$,
      this.sendMessage$
    )
    .subscribe();

  constructor(
    private roomsService: RTCRoomsService,
    private signalingService: RTCSignalingService,
    private connectionService: RTCConnectionService,
    private store: Store<RTCState>,
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
    const _that = this;
    connection.onicecandidate = e => this.signalIceCandidate(e.candidate, peer);
    connection.onconnectionstatechange = function(e) {
      if (["closed", "disconnected", "failed"].includes(this.connectionState)) {
        _that.store.dispatch(removeConnection({ peer }))
      }
    };

    this.store.dispatch(upsertConnection({ peer, connection }));

    return connection;
  }

  private initChannel(channel: RTCDataChannel, peer: string) {
    channel.onopen = (e) => {
      console.log("data channel connect", peer);
    };
    channel.onclose = (e) => {
      console.log("data channel disconnect", peer);
      this.store.dispatch(removeChannel({ peer }));
    };
    channel.onmessage = (e) => {
      this.zone.run(() => {
        // TODO: Trigger NGRX action
        console.log("message", peer, e.data);
        this.messageSubject.next({ from: peer, content: e.data });
      });
    }

    this.store.dispatch(upsertChannel({ peer, channel }));
  }

  public send(message: string) {
    this.sendSubject.next(message);
  }

  public ngOnDestroy() {
    if (this.subscription && !this.subscription.closed) {
      this.subscription.unsubscribe();
    }
  }
}
