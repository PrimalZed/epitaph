import { Injectable, OnDestroy, NgZone } from "@angular/core";
import { HubConnectionBuilder, HubConnection } from "@microsoft/signalr";
import { Subject } from "rxjs";
import { environment } from "environments/environment";

export interface IceSignalingMessage {
  type: "icecandidate";
  from: string;
  content: RTCIceCandidateInit;
}

export interface SessionSignalingMessage {
  type: "offer" | "answer";
  from: string;
  content: RTCSessionDescriptionInit;
}

export type SignalingMessage = IceSignalingMessage | SessionSignalingMessage;

@Injectable()
export class RTCSignalingService implements OnDestroy {
  private membersSubject: Subject<string[]> = new Subject();
  public members$ = this.membersSubject.asObservable();

  private messageSubject: Subject<SignalingMessage> = new Subject();
  public message$ = this.messageSubject.asObservable();

  private closeSubject: Subject<Error> = new Subject();
  public close$ = this.closeSubject.asObservable();

  private connection: HubConnection;

  constructor(private zone: NgZone) { }

  public connect(): Promise<void> {
    this.connection = new HubConnectionBuilder()
      .withUrl(`${environment.serverHost}/hub`)
      .build();

    this.connection.on("members", (members) => {
      this.zone.run(() => {
        this.membersSubject.next(members);
      });
    });

    this.connection.on("relay", (type, from, content) => {
      this.zone.run(() => {
        this.messageSubject.next({ type, from, content });
      });
    });

    this.connection.onclose((error) => {
      this.zone.run(() => {
        this.closeSubject.next(error);
      });
    });

    return this.connection.start();
  }

  public create(name: string, password: string): Promise<void> {
    return this.connection.invoke("create", name, password)
      .catch((error) => {
        console.error(error.message);
        return this.connection.stop()
          .then(() => {
            throw error.message.split("HubException: ").pop();
          });
      });
  }

  public join(roomId: string, password: string): Promise<void> {
    return this.connection.invoke("join", roomId, password)
      .catch((error) => {
        console.error(error.message);
        return this.connection.stop()
          .then(() => {
            throw error.message.split("HubException: ").pop();
          });
      });
  }

  public sendOffer(offer: RTCSessionDescriptionInit, to: string): Promise<void> {
    return this.connection.send("relay", to, "offer", offer);
  }

  public sendAnswer(answer: RTCSessionDescriptionInit, to: string): Promise<void> {
    return this.connection.send("relay", to, "answer", answer);
  }

  public sendIceCandidate(candidate: RTCIceCandidateInit, to: string): Promise<void> {
    return this.connection.send("relay", to, "icecandidate", candidate);
  }

  public leave(): Promise<void> {
    return this.connection.send("leave");
  }

  ngOnDestroy() {
    if (this.connection) {
      this.connection.stop();
    }
  }
}
