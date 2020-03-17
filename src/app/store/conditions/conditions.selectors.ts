import { Dictionary } from "@ngrx/entity";
import { createSelector, createFeatureSelector } from "@ngrx/store";
import { AppState } from "store/app-state";
import { ConditionSpec, ChargedConditionSpec } from "store/condition-specs/condition-spec";
import { selectConditionSpecEntities } from "store/condition-specs/condition-specs.selectors";
import { Haunt, EnhancementHauntRank } from "store/haunts/haunt";
import { PersistentHauntEnhancement, ChargeEffectHauntEnhancement } from "store/haunts/haunt-enhancement";
import { selectHauntEntities } from "store/haunts/haunts.selectors";
import { Key } from "store/keys/key";
import { selectKeyEntities } from "store/keys/keys.selectors";
import { Condition } from "./condition";
import { conditionsAdapter } from "./conditions.adapter";
import { ConditionsState } from "./conditions-state";
import { ConditionState, ChargedConditionState } from "./condition-state";

export const selectConditionsState = createFeatureSelector<AppState, ConditionsState>("conditions");

export const {
  selectIds: selectConditionIds,
  selectEntities: selectConditionStateEntities,
  selectAll: selectAllConditionStates,
  selectTotal: selectTotalConditions
} = conditionsAdapter.getSelectors(selectConditionsState);

export const selectConditionEntities = createSelector(
  selectAllConditionStates,
  selectConditionSpecEntities,
  selectKeyEntities,
  selectHauntEntities,
  (states: ConditionState[], specEntities: Dictionary<ConditionSpec>, keyEntities: Dictionary<Key>, hauntEntities: Dictionary<Haunt>) =>
    states.reduce<Dictionary<Condition>>(
      (entities, state) => {
        const spec = specEntities[state.specKey];
        const key = state.keyKey && keyEntities[state.keyKey];
        const haunt = hauntEntities[spec.haunt];
        const addedEffects = haunt.ranks
          .filter((rank) => rank.type === "enhancement")
          .reduce<(string | string[])[]>((all, rank: EnhancementHauntRank) => {
            const persistentEnhancements = rank.enhancements
              .filter((enhancement) => enhancement.type === "persistent")
              .filter((enhancement) => state.enhancementKeys.includes(enhancement.key))
              .map((enhancement: PersistentHauntEnhancement) => enhancement.description);

            return [...all, ...persistentEnhancements];
          }, []);

        let condition: Condition = {
          ...(state as any),
          ...spec,
          unlockedKey: key,
          effects: [...spec.effects, ...addedEffects]
        };

        if (spec.type === "charged") {
          const addedChargeEffects = haunt.ranks
            .filter((rank) => rank.type === "enhancement")
            .reduce<string[]>((all, rank: EnhancementHauntRank) => {
              const persistentEnhancements = rank.enhancements
                .filter((enhancement) => enhancement.type === "charge-effect")
                .filter((enhancement) => state.enhancementKeys.includes(enhancement.key))
                .map((enhancement: ChargeEffectHauntEnhancement) => enhancement.effects)
                .reduce((allEffects, enhancementEffects) => allEffects.concat(enhancementEffects), []);

              return [...all, ...persistentEnhancements];
            }, []);

          (condition as (ChargedConditionSpec & ChargedConditionState)).chargeEffects = [...spec.chargeEffects, ...addedChargeEffects];
        }

        return {
          ...entities,
          [conditionsAdapter.selectId(state)]: condition
        };
      },
      {}
    )
);

export const selectAllConditions = createSelector(
  selectConditionIds,
  selectConditionEntities,
  (ids: number[], entities: Dictionary<Condition>) => ids.map((id) => entities[id])
);

export const selectSelectedConditionId = createSelector(
  selectConditionsState,
  (state: ConditionsState) => state.selectedConditionId
);

export const selectSelectedConditionState = createSelector(
  selectConditionStateEntities,
  selectSelectedConditionId,
  (entities, selectedId) => selectedId && entities[selectedId]
);
