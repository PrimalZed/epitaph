import { Component, forwardRef, ChangeDetectionStrategy } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { ConditionSpec } from "store/condition-specs/condition-spec";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ConditionPickerModalComponent } from "./condition-picker.modal.component";

@Component({
  selector: "condition-picker",
  templateUrl: "./picker.component.html",
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => ConditionPickerComponent),
    multi: true
  }],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConditionPickerComponent implements ControlValueAccessor {
  value: ConditionSpec;
  icon = "tag";
  private onChange = (newValue: ConditionSpec) => { };
  onTouched = () => { };
  disabled: boolean;

  constructor(private modalService: NgbModal) { }

  writeValue(newValue: ConditionSpec): void {
    this.value = newValue;
  } 
  registerOnChange(fn: (newValue: ConditionSpec) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  open() {
    const modalRef = this.modalService.open(ConditionPickerModalComponent, { size: "lg" });
    modalRef.result
      .then((newValue: ConditionSpec) => {
        this.value = newValue;
        this.onChange(this.value);
      })
      .catch((reason) => { });
  }
}
