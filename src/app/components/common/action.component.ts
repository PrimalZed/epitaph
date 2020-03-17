import { Component, ChangeDetectionStrategy, Input } from "@angular/core";
import { Action } from "models/action";

@Component({
  selector: "action",
  templateUrl: "./action.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActionComponent {
  @Input() action: Action;
}
