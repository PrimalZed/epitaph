import { Component, ChangeDetectionStrategy } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { map } from "rxjs/operators";
import { RTCSenderService } from "services/rtc-sender.service";
import { RTCReceiverService } from "services/rtc-receiver.service";
import { environment } from "environments/environment";

@Component({
  selector: "connection",
  templateUrl: "./connection.component.html",
  styles: [
    `textarea { width: 25rem; height: 12rem; }`,
    `pre { margin: 1rem; }`
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConnectionComponent {
  title = "epitaph";
  
  outOfferDisplay$: Observable<string> = this.sender.offer$
    .pipe(
      map((offer) => offer.sdp)
    );
  outOffer$: Observable<string> = this.outOfferDisplay$
    .pipe(
      map((sdp) => `${window.location.origin}${environment.basePath}#${btoa(sdp)}`)
    );
  inOfferUrl: string;
  inOfferUrlSubject: Subject<string> = new Subject();
  inOfferDisplay$: Observable<string> = this.inOfferUrlSubject
    .pipe(
      map((url) => {
        const hashIndex = url.lastIndexOf("#");

        if (hashIndex == -1) {
          return url;
        }

        return atob(url.substr(hashIndex + 1));
      })
    );

  outAnswerDisplay$: Observable<string> = this.receiver.answer$
    .pipe(
      map((answer) => answer.sdp)
    );
  outAnswer$: Observable<string> = this.outAnswerDisplay$
    .pipe(
      map((sdp) => btoa(sdp))
    );

  inAnswerB64: string;
  inAsnwerB64Subject: Subject<string> = new Subject();
  inAnswerDisplay$: Observable<string> = this.inAsnwerB64Subject
    .pipe(
      map((b64) => atob(b64))
    );

  outMessage: string;
  inMessage$: Observable<string> = this.receiver.message$;

  constructor(
    private sender: RTCSenderService,
    private receiver: RTCReceiverService
  ) { }

  copyTextarea(el: any) {
    el.select();
    document.execCommand("copy");
  }

  createOffer() {
    this.sender.createOffer();
  }

  showInOffer(url) {
    this.inOfferUrlSubject.next(url);
  }

  answer(inOfferUrl: string) {
    this.receiver.createAnswer(inOfferUrl);
  }

  showInAnswer(b64) {
    this.inAsnwerB64Subject.next(b64);
  }

  confirm(inAnswerB64: string) {
    this.sender.setReceiver(atob(inAnswerB64));
  }

  send(message: string) {
    this.sender.send(message);
  }
}
