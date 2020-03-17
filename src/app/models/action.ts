import { Table } from "./table";

export interface BaseAction {
  table?: Table;
  time: "instant" | "reflexive" | "extended";
  pool: string[];
  requirement?: string;
  subject?: string;
  cost?: number | string | { min: number, max: number };
  chargesPerPlasm?: number;
  success: string;
  exceptional: string;
  failure: string;
  dramatic: string;
}

export interface SimpleAction extends BaseAction {
  type: "simple";
}

export interface ContestedAction extends BaseAction {
  type: "contested";
  contested: string[];
}

export interface ResistedAction extends BaseAction {
  type: "resisted";
  resisted: string;
}

export type Action = SimpleAction | ContestedAction | ResistedAction;
