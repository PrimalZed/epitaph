import { ConditionState } from "store/conditions/condition-state";

export interface SaveState {
  id: number;
  name: string;
  conditions: ConditionState[];
}
