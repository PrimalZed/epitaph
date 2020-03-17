import { EntityAdapter, createEntityAdapter } from "@ngrx/entity";
import { ConditionSpec } from "./condition-spec";

export const conditionSpecsAdapter: EntityAdapter<ConditionSpec> = createEntityAdapter<ConditionSpec>({
  selectId: (condition: ConditionSpec) => condition.key,
  sortComparer: false
});
