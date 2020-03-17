import { Component, ChangeDetectionStrategy } from "@angular/core";
import { Store, select } from "@ngrx/store";
import { AppState } from "store/app-state";
import { selectAllHaunts } from "store/haunts/haunts.selectors";

@Component({
  selector: "haunts",
  templateUrl: "./haunts.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HauntsComponent {
  public haunts$ = this.store.pipe(select(selectAllHaunts));

  constructor(private store: Store<AppState>) { }
}
