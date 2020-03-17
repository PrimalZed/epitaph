import { createAction, props } from "@ngrx/store";
import { ConditionState } from "./condition-state";
import { CreateSimpleConditionCommand } from "./create-condition-command";
import { loadSave, newSave } from "store/system/system.actions";

export const loadConditionStates = createAction(
  "[Conditions] Load Conditions",
  props<{ conditions: ConditionState[] }>()
);

export const addCondition = createAction(
  "[Conditions] Add Condition",
  props<{ command: CreateSimpleConditionCommand }>()
);

export const selectCondition = createAction(
  "[Conditions] Select Condition",
  props<{ id: number }>()
);

export const decrementConditionCharge = createAction(
  "[Conditions] Decrement Condition Charge",
  props<{ id: number }>()
);

export const addConditionEffect = createAction(
  "[Conditions] Add Condition Effect",
  props<{ id: number, effectKey: string }>()
);

export const removeCondition = createAction(
  "[Conditions] Remove Condition",
  props<{ id: number }>()
);

export type ConditionsActions = 
  | typeof loadSave
  | typeof newSave
  | typeof loadConditionStates
  | typeof addCondition
  | typeof selectCondition
  | typeof decrementConditionCharge
  | typeof addConditionEffect
  | typeof removeCondition;
