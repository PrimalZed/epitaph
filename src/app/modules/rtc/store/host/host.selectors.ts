import { createSelector } from "@ngrx/store";
import { selectRTCState } from "rtc/store/rtc-state";

export const selectHost = createSelector(selectRTCState, (state) => state.host);
