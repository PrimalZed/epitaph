import { EntityState } from "@ngrx/entity";
import { createReducer, on } from "@ngrx/store";
import {
  loadConditionSpecs,
  ConditionSpecsActions
} from "./condition-specs.actions";
import { conditionSpecsAdapter } from "./condition-specs.adapter";
import { ConditionSpec } from "./condition-spec";

export const initialConditionSpecsState: EntityState<ConditionSpec> = conditionSpecsAdapter.getInitialState({ });

export const conditionSpecsReducer = createReducer<EntityState<ConditionSpec>, ConditionSpecsActions>(
  initialConditionSpecsState,
  on(loadConditionSpecs, (state, { conditions }) => conditionSpecsAdapter.setAll(conditions, state))
);
