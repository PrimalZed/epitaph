import { createAction, props } from "@ngrx/store";
import { Key } from "./key";

export const loadKeys = createAction(
  "[Keys] Load Keys",
  props<{ keys: Key[] }>()
);

export type KeysActions = 
  | typeof loadKeys;
