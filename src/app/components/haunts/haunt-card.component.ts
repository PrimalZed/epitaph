import { Component, Input, ChangeDetectionStrategy } from "@angular/core";
import { Action } from "models/action";
import { Haunt, EnhancementHauntRank, ActionHauntRank } from "store/haunts/haunt";
import { UpgradeHauntEnhancement } from "store/haunts/haunt-enhancement";
import { hauntsReducer } from "store/haunts/haunts.reducers";

@Component({
  selector: "haunt-card",
  templateUrl: "./haunt-card.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HauntCardComponent {
  public haunt: Haunt;
  public action: Action;
  @Input("haunt") set hauntInput(value: Haunt) {
    this.haunt = value;
    this.action = this.updateAction(this.haunt);
  }

  @Input() collapsible = true;

  expanded: boolean = false;

  toggleExpand() {
    this.expanded = !this.expanded;
  }

  private updateAction(haunt: Haunt): Action {
    if (!haunt) {
      return;
    }

    const upgradeEnhancement = this.findUpgradeEnhancement(haunt);

    if (!upgradeEnhancement) {
      return;
    }

    const baseRank = haunt.ranks
      .find((r) => r.type === "action") as ActionHauntRank;

    return { ...baseRank.action, ...upgradeEnhancement.action } as Action;
  }

  private findUpgradeEnhancement(haunt: Haunt): UpgradeHauntEnhancement {
    if (!haunt) {
      return;
    }

    for (const rank of haunt.ranks) {
      if (rank.type !== "enhancement") {
        continue;
      }

      for (const enhancement of rank.enhancements) {
        if (enhancement.type === "upgrade") {
          return enhancement;
        }
      }
    }
  }
}
