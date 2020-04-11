import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";

export interface IceSocketMessage {
  type: "icecandidate";
  from: string;
  content: RTCIceCandidateInit;
}

export interface SessionSocketMessage {
  type: "offer" | "answer";
  from: string;
  content: RTCSessionDescriptionInit;
}

export type SocketMessage = IceSocketMessage | SessionSocketMessage;

@Injectable({
  providedIn: "root"
})
export class RTCSignallingService {
  private participants: string[] = [];
  private socketA: Subject<SocketMessage> = new Subject();
  private socketB: Subject<SocketMessage> = new Subject();

  private getSocket(participant: string): Subject<SocketMessage> {
    return participant === "a" ? this.socketA : this.socketB;
  }

  public connect(participant: string): Observable<SocketMessage> {
    this.participants.push(participant);
    return this.getSocket(participant).asObservable();
  }

  public join(): Promise<string[]> {
    return Promise.resolve(this.participants);
  }

  public sendOffer(offer: RTCSessionDescriptionInit, to: string) {
    // TODO: Send to signalling server
    this.getSocket(to).next({ type: "offer", from: this.otherParticipant(to), content: offer });
  }

  public sendAnswer(answer: RTCSessionDescriptionInit, to: string) {
    // TODO: Send to signalling server
    this.getSocket(to).next({ type: "answer", from: this.otherParticipant(to), content: answer });
  }

  public sendIceCandidate(candidate: RTCIceCandidateInit, to: string) {
    // TODO: Send to signalling server
    this.getSocket(to).next({ type: "icecandidate", from: this.otherParticipant(to), content: candidate });
  }

  private otherParticipant(participant: string): string {
    return participant !== "a" ? "a" : "b";
  }
}
