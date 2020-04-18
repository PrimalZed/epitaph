import { EntityAdapter, createEntityAdapter } from "@ngrx/entity";
import { RTCDataChannelKeyValue } from "./channel-key-value";

export const channelsAdapter: EntityAdapter<RTCDataChannelKeyValue> = createEntityAdapter<RTCDataChannelKeyValue>({
  selectId: (channel: RTCDataChannelKeyValue) => channel.key
});
