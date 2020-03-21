export interface CreateSimpleConditionCommand {
  specKey: string;
  subject: string;
  createdBy: string;
  keyKey?: string;
  activationPlasm: number;
  exceptionalSuccess: boolean;
  enhancementKeys?: string[];
  addedCustomEffects?: string[];
}

export interface CreateChargedConditionCommand extends CreateSimpleConditionCommand {
  charges: number;
  addedChargeEffectKeys?: string[];
  addedCustomChargeEffects?: string[];
}

export type CreateConditionCommand =
  | CreateSimpleConditionCommand
  | CreateChargedConditionCommand;
