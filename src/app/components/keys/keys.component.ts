import { Component, ChangeDetectionStrategy } from "@angular/core";
import { Store, select } from "@ngrx/store";
import { AppState } from "store/app-state";
import { selectAllKeys } from "store/keys/keys.selectors";

@Component({
  selector: "keys",
  templateUrl: "./keys.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class KeysComponent {
  public keys$ = this.store.pipe(select(selectAllKeys));
  
  constructor(private store: Store<AppState>) { }
}
