import { createReducer, on } from "@ngrx/store";
import { HostActions, setHost, clearHost } from "./host.actions";

export const hostReducer = createReducer<boolean, HostActions>(
  true,
  on(setHost, (state) => true),
  on(clearHost, (state) => false)
);
