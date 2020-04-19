import { Component, forwardRef, ChangeDetectionStrategy } from "@angular/core";
import { KeyValue } from "@angular/common";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { RoomPickerModalComponent } from "./room-picker.modal.component";

@Component({
  selector: "room-picker",
  templateUrl: "room-picker.component.html",
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => RoomPickerComponent),
    multi: true
  }],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoomPickerComponent implements ControlValueAccessor {
  value: KeyValue<string, string>;
  private onChange = (newValue: KeyValue<string, string>) => { };
  onTouched = () => { };
  disabled: boolean;

  constructor(private modalService: NgbModal) { }

  writeValue(newValue: KeyValue<string, string>): void {
    this.value = newValue;
  } 
  registerOnChange(fn: (newValue: KeyValue<string, string>) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  open() {
    const modalRef = this.modalService.open(RoomPickerModalComponent, { size: "lg" });
    modalRef.result
      .then((newValue: KeyValue<string, string>) => {
        this.value = newValue;
        this.onChange(this.value);
      })
      .catch((reason) => { });
  }
}
