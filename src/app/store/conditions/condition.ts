import { SimpleConditionSpec, ChargedConditionSpec } from "store/condition-specs/condition-spec";
import { Key } from "store/keys/key";
import { SimpleConditionState, ChargedConditionState } from "./condition-state";

export type Condition = ((SimpleConditionSpec & SimpleConditionState) | (ChargedConditionSpec & ChargedConditionState)) & { unlockedKey: Key };
