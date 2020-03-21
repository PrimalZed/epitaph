import { Component, ChangeDetectionStrategy, Input } from "@angular/core";
import { Store, select } from "@ngrx/store";
import { AppState } from "store/app-state";
import { selectKeyEntities } from "store/keys/keys.selectors";
import { map } from "rxjs/operators";

@Component({
  selector: "key-modal",
  templateUrl: "./key.modal.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class KeyModalComponent {
  @Input() key: string;

  public key$ = this.store
    .pipe(
      select(selectKeyEntities),
      map((keyEntities) => keyEntities[this.key])
    );

  constructor(private store: Store<AppState>) { }
}
