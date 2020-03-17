export interface SimpleConditionState {
  id: number;
  specKey: string;
  subject: string;
  createdBy: string;
  keyKey?: string;
  activationPlasm: number;
  enhancementKeys: string[];
  addedCustomEffects?: string[];
}

export interface ChargedConditionState extends SimpleConditionState {
  charges: number;
  addedChargeEffectKeys: string[];
  addedCustomChargeEffects?: string[];
}

export type ConditionState =
  | SimpleConditionState
  | ChargedConditionState;
