import { createSelector } from "@ngrx/store";
import { selectRTCState } from "rtc/store/rtc-state";
import { connectionsAdapter } from "./connections.adapter";

export const selectConnectionsState = createSelector(selectRTCState, (state) => state.connections);

export const {
  selectIds: selectConnectionPeers,
  selectEntities: selectConnectionKeyValueEntities,
  selectAll: selectAllConnectionKeyValues,
  selectTotal: selectTotalConnections
} = connectionsAdapter.getSelectors(selectConnectionsState);

export const selectConnectionEntities = createSelector(
  selectAllConnectionKeyValues,
  (keyValues) => keyValues.reduce((entities, keyValue) => ({ ...entities, [keyValue.key]: keyValue.value }), {})
);

export const selectAllConnections = createSelector(
  selectAllConnectionKeyValues,
  (keyValues) => keyValues.map((keyValue) => keyValue.value)
);
