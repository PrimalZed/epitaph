import { Component, ChangeDetectionStrategy } from "@angular/core";
import { KeyValue } from "@angular/common";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { RTCService } from "rtc/services/rtc.service";

@Component({
  selector: "room-picker-modal",
  templateUrl: "./room-picker.modal.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoomPickerModalComponent {
  public options$ = this.rtc.rooms$;
  
  constructor(
    private modal: NgbActiveModal,
    private rtc: RTCService
  ) { }

  select(key: KeyValue<string, string>) {
    this.modal.close(key);
  }
}
