import { NgModule, APP_INITIALIZER } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { StoreModule } from "@ngrx/store";

import { ConnectionComponent } from "rtc/components/connection.component";
import { RoomPickerComponent } from "rtc/components/room-picker.component";
import { RoomPickerModalComponent } from "./components/room-picker.modal.component";

import { RTCService } from "rtc/services/rtc.service";
import { RTCConnectionService } from "rtc/services/rtc-connection.service";
import { RTCHostService } from "./services/rtc-host.service";
import { RTCRoomsService } from "rtc/services/rtc-rooms.service";
import { RTCSignalingService } from "rtc/services/rtc-signaling.service";

import { channelsReducer } from "rtc/store/channels/channels.reducers";
import { connectionsReducer } from "rtc/store/connections/connections.reducers";
import { hostReducer } from "rtc/store/host/host.reducers";

const rtcRoutes: Routes = [
  { path: "p2p", component: ConnectionComponent }
];

@NgModule({
  declarations: [
    ConnectionComponent,
    RoomPickerComponent,
    RoomPickerModalComponent
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forChild(rtcRoutes),
    StoreModule.forFeature("rtc", {
      channels: channelsReducer,
      connections: connectionsReducer,
      host: hostReducer
    })
  ],
  providers: [
    RTCService,
    RTCConnectionService,
    RTCHostService,
    RTCRoomsService,
    RTCSignalingService
  ]
})
export class RTCModule { }