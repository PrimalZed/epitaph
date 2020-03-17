import { EntityState } from "@ngrx/entity";
import { ConditionState } from "./condition-state";

export interface ConditionsState extends EntityState<ConditionState> {
  selectedConditionId: number;
  counter: number;
}
