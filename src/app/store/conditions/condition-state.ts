export interface SimpleConditionState {
  id: number;
  specKey: string;
  subject: string;
  createdBy: string;
  keyKey?: string;
  activationPlasm: number;
  enhancementKeys: string[];
  customEffects?: string[];
}

export interface ChargedConditionState extends SimpleConditionState {
  charges: number;
  addedChargeEffectKeys: string[];
  customChargeEffects?: string[];
}

export type ConditionState =
  | SimpleConditionState
  | ChargedConditionState;
