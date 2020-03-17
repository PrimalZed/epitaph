import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from "@angular/core";

@Component({
  selector: "action-button",
  templateUrl: "./action-button.component.html",
  styles: [
    ".action-button-container { position: fixed; bottom: 0; }"
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActionButtonComponent {
  disabled: boolean;
  @Input("disabled") set disabledInput(val) {
    this.disabled = val === "" || val;
  }

  @Output("action") actionEmitter = new EventEmitter();

  action() {
    this.actionEmitter.emit();
  }
}
