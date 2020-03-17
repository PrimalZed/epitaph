import { EntityState } from "@ngrx/entity";
import { createFeatureSelector } from "@ngrx/store";
import { AppState } from "store/app-state";
import { ConditionSpec } from "./condition-spec";
import { conditionSpecsAdapter } from "./condition-specs.adapter";

export const selectConditionSpecsState = createFeatureSelector<AppState, EntityState<ConditionSpec>>("conditionSpecs");

export const {
  selectIds: selectConditionSpecKeys,
  selectEntities: selectConditionSpecEntities,
  selectAll: selectAllConditionSpecs,
  selectTotal: selectTotalConditionSpecs
} = conditionSpecsAdapter.getSelectors(selectConditionSpecsState);
