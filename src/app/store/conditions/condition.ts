import { Table } from "models/table";
import { SimpleConditionSpec, ChargedConditionSpec } from "store/condition-specs/condition-spec";
import { Key } from "store/keys/key";
import { SimpleConditionState, ChargedConditionState } from "./condition-state";

export interface BaseConditionDerivation {
  unlockedKey: Key;
  enhancements: {
    description: string | string[];
    effects?: string[];
    table?: Table
  }[];
}

export type SimpleCondition = SimpleConditionSpec & SimpleConditionState;

export type ChargedCondition = ChargedConditionSpec & ChargedConditionState & {
  enhancementChargeEffects: string[];
};

export type Condition = (SimpleCondition | ChargedCondition) & BaseConditionDerivation
