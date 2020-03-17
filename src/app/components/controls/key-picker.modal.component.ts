import { Component, ChangeDetectionStrategy } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { Store, select } from "@ngrx/store";
import { AppState } from "store/app-state";
import { Key } from "store/keys/key";
import { selectAllKeys } from "store/keys/keys.selectors";

@Component({
  selector: "key-picker-modal",
  templateUrl: "./picker.modal.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class KeyPickerModalComponent {
  public options$ = this.store.pipe(select(selectAllKeys));
  
  constructor(
    private modal: NgbActiveModal,
    private store: Store<AppState>
  ) { }

  select(key: Key) {
    this.modal.close(key);
  }
}
