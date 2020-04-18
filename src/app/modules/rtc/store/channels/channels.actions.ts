import { createAction, props } from "@ngrx/store";

export const upsertChannel = createAction(
  "[Channels] Upsert Channel",
  props<{ peer: string, channel: RTCDataChannel }>()
);

export const removeChannel = createAction(
  "[Channels] Remove Channel",
  props<{ peer: string }>()
);

export type ChannelsActions = 
  | typeof upsertChannel
  | typeof removeChannel;
