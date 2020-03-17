import { Component, ChangeDetectionStrategy, Input } from "@angular/core";
import { Store, select } from "@ngrx/store";
import { AppState } from "store/app-state";
import { selectHauntEntities } from "store/haunts/haunts.selectors";
import { map } from "rxjs/operators";

@Component({
  selector: "haunt-modal",
  templateUrl: "./haunt.modal.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HauntModalComponent {
  @Input() key: string;

  public haunt$ = this.store
    .pipe(
      select(selectHauntEntities),
      map((hauntEntities) => hauntEntities[this.key])
    );

  constructor(private store: Store<AppState>) { }
}
