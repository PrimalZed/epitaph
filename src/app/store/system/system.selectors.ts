import { createFeatureSelector, createSelector } from "@ngrx/store";
import { AppState } from "store/app-state";
import { SystemState } from "./system-state";

export const selectSystemState = createFeatureSelector<AppState, SystemState>("system");

export const selectSaveMetadata = createSelector(
  selectSystemState,
  (state: SystemState) => ({ id: state.saveId, name: state.saveName })
);

export const selectSaveName = createSelector(
  selectSystemState,
  (state: SystemState) => state.saveName
);

export const selectDirty = createSelector(
  selectSystemState,
  (state: SystemState) => (state.dirty)
);
