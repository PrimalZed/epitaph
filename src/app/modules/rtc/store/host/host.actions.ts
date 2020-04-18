import { createAction } from "@ngrx/store";

export const setHost = createAction(
  "[Host] Set Host"
);

export const clearHost = createAction(
  "[Host] Clear Host"
);

export type HostActions = 
  | typeof setHost
  | typeof clearHost;
