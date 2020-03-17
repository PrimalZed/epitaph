import { EntityState } from "@ngrx/entity";
import { ConditionSpec } from "./condition-specs/condition-spec";
import { ConditionsState } from "./conditions/conditions-state";
import { Haunt } from "./haunts/haunt";
import { Key } from "./keys/key";
import { SystemState } from "./system/system-state";

export interface AppState {
  conditionSpecs: EntityState<ConditionSpec>;
  conditions: ConditionsState;
  haunts: EntityState<Haunt>;
  keys: EntityState<Key>;
  system: SystemState;
}
