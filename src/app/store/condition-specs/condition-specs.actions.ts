import { createAction, props } from "@ngrx/store";
import { ConditionSpec } from "./condition-spec";

export const loadConditionSpecs = createAction(
  "[Condition Specs] Load Conditions",
  props<{ conditions: ConditionSpec[] }>()
);

export type ConditionSpecsActions = 
  | typeof loadConditionSpecs;
