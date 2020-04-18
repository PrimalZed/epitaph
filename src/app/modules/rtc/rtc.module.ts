import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";
import { StoreModule } from "@ngrx/store";
import { ConnectionComponent } from "rtc/components/connection.component";
import { RTCService } from "rtc/services/rtc.service";
import { RTCConnectionService } from "rtc/services/rtc-connection.service";
import { RTCRoomsService } from "rtc/services/rtc-rooms.service";
import { RTCSignalingService } from "rtc/services/rtc-signaling.service";
import { channelsReducer } from "rtc/store/channels/channels.reducers";
import { connectionsReducer } from "rtc/store/connections/connections.reducers";

const rtcRoutes: Routes = [
  { path: "", component: ConnectionComponent }
];

@NgModule({
  declarations: [
    ConnectionComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forChild(rtcRoutes),
    StoreModule.forFeature("rtc", {
      channels: channelsReducer,
      connections: connectionsReducer
    })
  ],
  providers: [
    RTCService,
    RTCConnectionService,
    RTCRoomsService,
    RTCSignalingService
  ]
})
export class RTCModule { }