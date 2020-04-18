import { EntityAdapter, createEntityAdapter } from "@ngrx/entity";
import { RTCPeerConnectionKeyValue } from "./connection-key-value";

export const connectionsAdapter: EntityAdapter<RTCPeerConnectionKeyValue> = createEntityAdapter<RTCPeerConnectionKeyValue>({
  selectId: (connection: RTCPeerConnectionKeyValue) => connection.key
});
