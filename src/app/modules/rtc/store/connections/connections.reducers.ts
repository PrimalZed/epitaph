import { createReducer, on } from "@ngrx/store";
import { EntityState } from "@ngrx/entity";
import { RTCPeerConnectionKeyValue } from "./connection-key-value";
import { ConnectionsActions, upsertConnection, setRemoteDescription, addIceCandidate, removeConnection } from "./connections.actions";
import { connectionsAdapter } from "./connections.adapter";

export const initialConnectionsState: EntityState<RTCPeerConnectionKeyValue> = connectionsAdapter.getInitialState({ });

export const connectionsReducer = createReducer<EntityState<RTCPeerConnectionKeyValue>, ConnectionsActions>(
  initialConnectionsState,
  on(upsertConnection, (state, { peer, connection }) => {
    if ((state.ids as string[]).includes(peer)) {
      state.entities[peer].value.close();
    }

    return connectionsAdapter.upsertOne({ key: peer, value: connection }, state)
  }),
  on(setRemoteDescription, (state, { peer, description }) => connectionsAdapter
    .map(({ key, value }) => {
      if (key === peer) {
        value.setRemoteDescription(description);
      }
      return { key, value };
    }, state)
  ),
  on(addIceCandidate, (state, { peer, candidate }) => connectionsAdapter
    .map(({ key, value }) => {
      if (key === peer) {
        value.addIceCandidate(candidate);
      }
      return { key, value };
    }, state)
  ),
  on(removeConnection, (state, { peer }) => connectionsAdapter.removeOne(peer, state))
);
