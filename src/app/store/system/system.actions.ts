import { createAction, props } from "@ngrx/store";
import {
  addCondition,
  decrementConditionCharge,
  addConditionEffect,
  removeCondition
} from "store/conditions/conditions.actions";
import { SaveState } from "./save-state";
import { ConditionState } from "store/conditions/condition-state";

export const newSave = createAction(
  "[System] New Save"
);

export const setName = createAction(
  "[System] Set Name",
  props<{ name: string }>()
);

export const deleteSaveSuccess = createAction(
  "[System] Delete Save Succes"
);

export const saveSuccess = createAction(
  "[System] Save Success",
  props<{ id: number }>()
);

export const loadSave = createAction(
  "[System] Load Save",
  props<{ saveState: SaveState }>()
);

export const loadShare = createAction(
  "[System] Load Share",
  props<{ conditionStates: ConditionState[] }>()
);

export type SystemActions = 
  | typeof addCondition
  | typeof decrementConditionCharge
  | typeof addConditionEffect
  | typeof removeCondition
  | typeof newSave
  | typeof setName
  | typeof deleteSaveSuccess
  | typeof saveSuccess
  | typeof loadSave
  | typeof loadSave;
