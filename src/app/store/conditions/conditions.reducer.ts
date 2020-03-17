import { createReducer, on } from "@ngrx/store";
import {
  loadConditionStates,
  addCondition,
  selectCondition,
  decrementConditionCharge,
  addConditionEffect,
  removeCondition,
  ConditionsActions
} from "./conditions.actions";
import { conditionsAdapter } from "./conditions.adapter";
import { ConditionsState } from "./conditions-state";
import { loadSave, newSave } from "store/system/system.actions";
import { ChargedConditionState } from "./condition-state";

export const initialConditionsState: ConditionsState = conditionsAdapter.getInitialState({
  selectedConditionId: null,
  counter: 0
});

export const conditionsReducer = createReducer<ConditionsState, ConditionsActions>(
  initialConditionsState,
  on(loadSave, (state, { saveState }) => ({ 
    ...conditionsAdapter.addAll(saveState.conditions ?? [], state),
    counter: (saveState.conditions ?? []).reduce((max, condition) => Math.max(max, condition.id + 1), 0)
  })),
  on(newSave, (state) => initialConditionsState),
  on(loadConditionStates, (state, { conditions }) => ({
    ...conditionsAdapter.addAll(conditions ?? [], state),
    counter: (conditions ?? []).reduce((max, condition) => Math.max(max, condition.id + 1), 0)
  })),
  on(addCondition, (state, { command }) => 
    conditionsAdapter.addOne({ id: state.counter, ...command, enhancementKeys: [] }, { ...state, counter: state.counter + 1 })),
  on(selectCondition, (state, { id }) => ({ ...state, selectedConditionId: id })),
  on(decrementConditionCharge, (state, { id }) => {
    const condition = state.entities[id] as ChargedConditionState;
    return conditionsAdapter.updateOne(
      { id, changes: { charges: condition.charges - 1 }},
      state
    );
  }),
  on(addConditionEffect, (state, { id, effectKey }) => {
    const enhancementKeys = [ ...state.entities[id].enhancementKeys, effectKey ]
      .reduce((distinct, value) => {
        if (distinct.includes(value)) {
          return distinct;
        }
        distinct.push(value);
        return distinct;
      }, []);
    return conditionsAdapter.updateOne({ id, changes: { enhancementKeys } }, state);
  }),
  on(removeCondition, (state, { id }) => conditionsAdapter.removeOne(id, state))
);
