import { Table } from "models/table";
import { SimpleConditionSpec, ChargedConditionSpec } from "store/condition-specs/condition-spec";
import { Key } from "store/keys/key";
import { SimpleConditionState, ChargedConditionState } from "./condition-state";

export interface BaseConditionDerivation {
  unlockedKey: Key;
  enhancements: {
    name: string;
    dots: number;
    entries: {
      description: string | string[];
      effects?: string[];
      table?: Table;
    }[];
  }[];
}

export type SimpleCondition = SimpleConditionSpec & SimpleConditionState;

export type ChargedCondition = ChargedConditionSpec & ChargedConditionState & {
  chargeEnhancements: {
    name: string;
    dots: number;
    effects: string[]
  }[];
};

export type Condition = (SimpleCondition | ChargedCondition) & BaseConditionDerivation
