import { EntityState } from "@ngrx/entity";
import { RTCPeerConnectionKeyValue } from "./connections/connection-key-value";
import { RTCDataChannelKeyValue } from "./channels/channel-key-value";
import { createFeatureSelector } from "@ngrx/store";

export interface RTCState {
  connections: EntityState<RTCPeerConnectionKeyValue>;
  channels: EntityState<RTCDataChannelKeyValue>;
  host: boolean;
}

export const selectRTCState = createFeatureSelector<RTCState>("rtc");
