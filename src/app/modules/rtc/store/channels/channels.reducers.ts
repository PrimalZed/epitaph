import { createReducer, on } from "@ngrx/store";
import { EntityState } from "@ngrx/entity";
import { RTCDataChannelKeyValue } from "./channel-key-value";
import { ChannelsActions, upsertChannel, removeChannel } from "./channels.actions";
import { channelsAdapter } from "./channels.adapter";

export const initialChannelsState: EntityState<RTCDataChannelKeyValue> = channelsAdapter.getInitialState({ });

export const channelsReducer = createReducer<EntityState<RTCDataChannelKeyValue>, ChannelsActions>(
  initialChannelsState,
  on(upsertChannel, (state, { peer, channel }) => {
    if ((state.ids as string[]).includes(peer)) {
      state.entities[peer].value.close();
    }

    return channelsAdapter.upsertOne({ key: peer, value: channel }, state)
  }),
  on(removeChannel, (state, { peer }) => channelsAdapter.removeOne(peer, state))
);
