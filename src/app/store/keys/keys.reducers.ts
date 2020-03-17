import { createReducer, on } from "@ngrx/store";
import { EntityState } from "@ngrx/entity";
import { Key } from "./key";
import { KeysActions, loadKeys } from "./keys.actions";
import { keysAdapter } from "./keys.adapter";

export const initialKeysState: EntityState<Key> = keysAdapter.getInitialState({ });

export const keysReducer = createReducer<EntityState<Key>, KeysActions>(
  initialKeysState,
  on(loadKeys, (state, { keys }) => keysAdapter.addAll(keys, state))
);
