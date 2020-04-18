import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { RTCService } from "rtc/services/rtc.service";
import { decrementConditionCharge, addConditionEffect } from "./conditions.actions";
import { exhaustMap, tap, map } from "rxjs/operators";
import { createAction } from "@ngrx/store";

const noop = createAction(
  "[Noop]"
);

@Injectable()
export class ConditionsEffects {
  emitActions$ = createEffect(() => this.actions$.pipe(
    ofType(decrementConditionCharge, addConditionEffect),
    map((action) => {
      this.rtcService.send(JSON.stringify(action));
      return noop();
    })
  ));

  constructor(private actions$: Actions, private rtcService: RTCService) { }
}
