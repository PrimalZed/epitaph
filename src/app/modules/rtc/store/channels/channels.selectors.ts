import { createSelector } from "@ngrx/store";
import { selectRTCState } from "rtc/store/rtc-state";
import { channelsAdapter } from "./channels.adapter";

export const selectChannelsState = createSelector(selectRTCState, (state) => state.channels);

export const {
  selectIds: selectChannelPeers,
  selectEntities: selectChannelKeyValueEntities,
  selectAll: selectAllChannelKeyValues,
  selectTotal: selectTotalChannels
} = channelsAdapter.getSelectors(selectChannelsState);

export const selectChannelEntities = createSelector(
  selectAllChannelKeyValues,
  (keyValues) => keyValues.reduce((entities, keyValue) => ({ ...entities, [keyValue.key]: keyValue.value }), {})
);

export const selectAllChannels = createSelector(
  selectAllChannelKeyValues,
  (keyValues) => keyValues.map((keyValue) => keyValue.value)
);
