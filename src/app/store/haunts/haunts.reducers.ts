import { createReducer, on } from "@ngrx/store";
import { EntityState } from "@ngrx/entity";
import { Haunt } from "./haunt";
import { HauntsActions, loadHaunts } from "./haunts.actions";
import { hauntsAdapter } from "./haunts.adapter";

export const initialHauntsState: EntityState<Haunt> = hauntsAdapter.getInitialState({ });

export const hauntsReducer = createReducer<EntityState<Haunt>, HauntsActions>(
  initialHauntsState,
  on(loadHaunts, (state, { haunts }) => hauntsAdapter.setAll(haunts, state))
);
