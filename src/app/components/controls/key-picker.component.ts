import { Component, forwardRef, ChangeDetectionStrategy } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Key } from "store/keys/key";
import { KeyPickerModalComponent } from "./key-picker.modal.component";

@Component({
  selector: "key-picker",
  templateUrl: "./picker.component.html",
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => KeyPickerComponent),
    multi: true
  }],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class KeyPickerComponent implements ControlValueAccessor {
  value: Key;
  icon = "key";
  private onChange = (newValue: Key) => { };
  onTouched = () => { };
  disabled: boolean;

  constructor(private modalService: NgbModal) { }

  writeValue(newValue: Key): void {
    this.value = newValue;
  } 
  registerOnChange(fn: (newValue: Key) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  open() {
    const modalRef = this.modalService.open(KeyPickerModalComponent, { size: "lg" });
    modalRef.result
      .then((newValue: Key) => {
        this.value = newValue;
        this.onChange(this.value);
      })
      .catch((reason) => { });
  }
}
