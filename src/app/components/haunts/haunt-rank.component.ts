import { Component, Input, ChangeDetectionStrategy } from "@angular/core";
import { HauntRank } from "store/haunts/haunt";
import { Action } from "models/action";

@Component({
  selector: "haunt-rank",
  templateUrl: "./haunt-rank.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HauntRankComponent {
  @Input() rank: HauntRank;

  @Input() action: Action;
}
