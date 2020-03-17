export interface BaseConditionSpec {
  key: string;
  name: string;
  type: "simple" | "charged";
  scope: "condition" | "tilt";
  haunt: string;
  primary: boolean;
  description: string;
  effects: string[];
  resolutions: string[];
}

export interface SimpleConditionSpec extends BaseConditionSpec {
  type: "simple";
}

export interface ChargedConditionSpec extends BaseConditionSpec {
  type: "charged";
  chargeDescription: string;
  chargeEffects: string[];
}

export type ConditionSpec =
  | SimpleConditionSpec
  | ChargedConditionSpec;
