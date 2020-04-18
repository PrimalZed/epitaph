import { createAction, props } from "@ngrx/store";
import { CreateSimpleConditionCommand } from "./create-condition-command";
import { loadSave, newSave } from "store/system/system.actions";

export const addCondition = createAction(
  "[Conditions] Add Condition",
  props<{ command: CreateSimpleConditionCommand, stopPropagation?: boolean }>()
);

export const decrementConditionCharge = createAction(
  "[Conditions] Decrement Condition Charge",
  props<{ id: number, stopPropagation?: boolean }>()
);

export const addConditionEffect = createAction(
  "[Conditions] Add Condition Effect",
  props<{ id: number, effectKey: string, stopPropagation?: boolean }>()
);

export const removeCondition = createAction(
  "[Conditions] Remove Condition",
  props<{ id: number, stopPropagation?: boolean }>()
);

export type ConditionsActions = 
  | typeof loadSave
  | typeof newSave
  | typeof addCondition
  | typeof decrementConditionCharge
  | typeof addConditionEffect
  | typeof removeCondition;
