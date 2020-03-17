import { Action } from "models/action";
import { Table } from "models/table";

export interface BaseHauntEnhancement {
  key: string;
  cost: number | string | { min: number, max: number };
  table?: Table;
}

export interface InstantHauntEnhancement extends BaseHauntEnhancement {
  type: "instant";
  description: string | string[];
  listLabel?: string;
  listItems?: string[];
  limit: string;
}

export interface PersistentHauntEnhancement extends BaseHauntEnhancement {
  type: "persistent";
  description: string | string[];
  effects?: string[];
}

export interface ChargeEffectHauntEnhancement extends BaseHauntEnhancement {
  type: "charge-effect";
  description?: string | string[];
  effects: string[];
}

export interface UpgradeHauntEnhancement extends BaseHauntEnhancement {
  type: "upgrade",
  action: Partial<Action>;
}

export type HauntEnhancement =
  | InstantHauntEnhancement
  | PersistentHauntEnhancement
  | ChargeEffectHauntEnhancement
  | UpgradeHauntEnhancement;