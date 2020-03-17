import { createAction, props } from "@ngrx/store";
import { Haunt } from "./haunt";

export const loadHaunts = createAction(
  "[Haunts] Load Haunts",
  props<{ haunts: Haunt[] }>()
);

export type HauntsActions = 
  | typeof loadHaunts;
