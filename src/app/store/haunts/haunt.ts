import { Action } from "models/action";
import { HauntEnhancement } from "./haunt-enhancement";

export interface Haunt {
  key: string;
  name: string;
  conditions: string[];
  ranks: HauntRank[];
}

export interface ActionHauntRank {
  dots: number;
  name: string;
  type: "action";
  action: Action;
  enhancements: HauntEnhancement[];
}

export interface EnhancementHauntRank {
  dots: number;
  name: string;
  type: "enhancement";
  enhancements: HauntEnhancement[];
}

export type HauntRank = ActionHauntRank | EnhancementHauntRank;
