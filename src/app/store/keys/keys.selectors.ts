import { EntityState } from "@ngrx/entity";
import { createFeatureSelector } from "@ngrx/store";
import { AppState } from "store/app-state";
import { Key } from "./key";
import { keysAdapter } from "./keys.adapter";

export const selectKeysState = createFeatureSelector<AppState, EntityState<Key>>("keys");

export const {
  selectIds: selectKeyKeys,
  selectEntities: selectKeyEntities,
  selectAll: selectAllKeys,
  selectTotal: selectTotalKeys
} = keysAdapter.getSelectors(selectKeysState);
