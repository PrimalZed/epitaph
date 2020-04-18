import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { RTCService } from "rtc/services/rtc.service";
import {
  addCondition,
  decrementConditionCharge,
  addConditionEffect,
  removeCondition
} from "./conditions.actions";
import { map } from "rxjs/operators";
import { createAction } from "@ngrx/store";

const noop = createAction(
  "[Noop]"
);

@Injectable()
export class ConditionsEffects {
  emitActions$ = createEffect(() => this.actions$.pipe(
    ofType(addCondition, decrementConditionCharge, addConditionEffect, removeCondition),
    map((action) => {
      if (!(action as any).stopPropagation) {
        this.rtcService.send(JSON.stringify(action));
      }
      return noop();
    })
  ));

  constructor(private actions$: Actions, private rtcService: RTCService) { }
}
