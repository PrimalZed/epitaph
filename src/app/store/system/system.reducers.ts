import { createReducer, on } from "@ngrx/store";
import {
  addCondition,
  decrementConditionCharge,
  addConditionEffect,
  removeCondition
} from "store/conditions/conditions.actions";
import { SystemState } from "./system-state";
import { SystemActions, newSave, setName, saveSuccess, loadSave } from "./system.actions";

export const initialSystemState: SystemState = {
  saveId: null,
  saveName: null,
  dirty: false
};

export const systemReducer = createReducer<SystemState, SystemActions>(
  initialSystemState,
  on(addCondition, (state) => ({ ...state, dirty: true })),
  on(decrementConditionCharge, (state) => ({ ...state, dirty: true })),
  on(addConditionEffect, (state) => ({ ...state, dirty: true })),
  on(removeCondition, (state) => ({ ...state, dirty: true })),
  on(newSave, (state) => (initialSystemState)),
  on(setName, (state, { name }) => ({ ...state, saveName: name })),
  on(saveSuccess, (state, { id }) => ({ ...state, saveId: id, dirty: false })),
  on(loadSave, (state, { saveState }) => ({ ...state, saveId: saveState.id, saveName: saveState.name, dirty: false })),
);
