import { createSelector } from "@ngrx/store";
import { ConditionState } from "./conditions/condition-state";
import { selectAllConditionStates } from "./conditions/conditions.selectors";
import { selectSaveMetadata } from "./system/system.selectors";

export const selectSaveState = createSelector(
  selectSaveMetadata,
  selectAllConditionStates,
  ({ id, name }, conditionStates: ConditionState[]) => ({
    id,
    name,
    conditions: conditionStates
  })
);
