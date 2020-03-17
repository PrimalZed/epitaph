import { EntityAdapter, createEntityAdapter } from "@ngrx/entity";
import { ConditionState } from "./condition-state";

export const conditionsAdapter: EntityAdapter<ConditionState> = createEntityAdapter<ConditionState>({
  selectId: (condition: ConditionState) => condition.id,
  sortComparer: false
});
