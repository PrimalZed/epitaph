import { Injectable, OnDestroy } from "@angular/core";
import { Store, select } from "@ngrx/store";
import { Subscription, EMPTY } from "rxjs";
import { filter, first, map, mergeMap, pairwise, switchMap, tap } from "rxjs/operators";
import { RTCState } from "rtc/store/rtc-state";
import { AppState } from "store/app-state";
import { selectHost } from "rtc/store/host/host.selectors";
import { selectAllChannelKeyValues } from "rtc/store/channels/channels.selectors";
import { selectAllConditionStates } from "store/conditions/conditions.selectors";
import { loadShare } from "store/system/system.actions";

@Injectable()
export class RTCHostService implements OnDestroy {
  private hostPower$ = this.rtcStore
    .pipe(
      select(selectHost),
      switchMap((host) => host ? this.rtcStore.pipe(select(selectAllChannelKeyValues)) : EMPTY),
      pairwise(),
      map(([oldKeyValues, newKeyValues]) => newKeyValues.filter(({ key }) => !oldKeyValues.map(({ key: oldKey }) => oldKey).includes(key))),
      filter((keyValues) => keyValues.length && true),
      map((keyValues) => keyValues.map(({ value }) => value)),
      map((channels) => channels.filter((channel) => channel.readyState === "open")),
      mergeMap((channels) => this.store.pipe(
        select(selectAllConditionStates),
        first(),
        tap((conditionStates) => channels.forEach((channel) => channel.send(JSON.stringify(loadShare({ conditionStates })))))
      ))
    );

  private subscription: Subscription = this.hostPower$.subscribe();

  constructor(private rtcStore: Store<RTCState>, private store: Store<AppState>) { }

  ngOnDestroy() {
    if (this.subscription && !this.subscription.closed) {
      this.subscription.unsubscribe();
    }
  }
}