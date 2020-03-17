import { EntityState } from "@ngrx/entity";
import { createFeatureSelector } from "@ngrx/store";
import { AppState } from "store/app-state";
import { Haunt } from "./haunt";
import { hauntsAdapter } from "./haunts.adapter";

export const selectHauntsState = createFeatureSelector<AppState, EntityState<Haunt>>("haunts");

export const {
  selectIds: selectHauntHaunts,
  selectEntities: selectHauntEntities,
  selectAll: selectAllHaunts,
  selectTotal: selectTotalHaunts
} = hauntsAdapter.getSelectors(selectHauntsState);
