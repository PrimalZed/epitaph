import { Component, ChangeDetectionStrategy, Input } from "@angular/core";
import { Action } from "models/action";
import { ActionHauntRank } from "store/haunts/haunt";

var nextId = 0;

@Component({
  selector: "haunt-action",
  templateUrl: "./haunt-action.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HauntActionComponent {
  @Input() rank: ActionHauntRank;

  @Input() upgradeAction: Action;

  public showUpgrade: boolean;
  public toggleId = `haunt-action-upgrade-toggle-${nextId++}`;
}
