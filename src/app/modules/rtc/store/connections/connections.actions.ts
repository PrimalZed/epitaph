import { createAction, props } from "@ngrx/store";

export const upsertConnection = createAction(
  "[Connections] Upsert Connection",
  props<{ peer: string, connection: RTCPeerConnection }>()
);

export const setRemoteDescription = createAction(
  "[Connections] Set Remote Description",
  props<{ peer: string, description: RTCSessionDescriptionInit }>()
);

export const addIceCandidate = createAction(
  "[Connections] Add Ice Candidate",
  props<{ peer: string, candidate: RTCIceCandidateInit }>()
);

export const removeConnection = createAction(
  "[Connections] Remove Connection",
  props<{ peer: string }>()
);

export type ConnectionsActions = 
  | typeof upsertConnection
  | typeof setRemoteDescription
  | typeof addIceCandidate
  | typeof removeConnection;
