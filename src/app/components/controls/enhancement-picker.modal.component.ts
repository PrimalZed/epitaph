import { Component, ChangeDetectionStrategy, Input } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { Store, select } from "@ngrx/store";
import { map } from "rxjs/operators";
import { AppState } from "store/app-state";
import { EnhancementHauntRank } from "store/haunts/haunt";
import { HauntEnhancement } from "store/haunts/haunt-enhancement";
import { selectHauntEntities } from "store/haunts/haunts.selectors";

@Component({
  selector: "enhancement-picker-modal",
  templateUrl: "./enhancement-picker.modal.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EnhancementPickerModalComponent {
  @Input() hauntKey: string;

  ranks$ = this.store
    .pipe(
      select(selectHauntEntities),
      map((haunts) => haunts[this.hauntKey]),
      map((haunt) => haunt.ranks.filter((rank) => rank.enhancements.find((enhancement) => enhancement.type === "persistent" || enhancement.type === "charge-effect")))
    );

  constructor(
    private modal: NgbActiveModal,
    private store: Store<AppState>
  ) { }

  select(enhancement: HauntEnhancement) {
    this.modal.close(enhancement);
  }
}
