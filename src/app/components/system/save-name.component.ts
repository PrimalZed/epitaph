import { Component } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { Store } from "@ngrx/store";
import { AppState } from "store/app-state";
import { setName } from "store/system/system.actions";

@Component({
  selector: "save-name",
  templateUrl: "./save-name.component.html"
})
export class SaveNameComponent {
  public name: string;

  constructor(
    private store: Store<AppState>,
    private modal: NgbActiveModal
  ) { }

  submit(name: string) {
    this.store.dispatch(setName({ name }));
    this.modal.close(name);
  }

  dismiss() {
    this.modal.dismiss();
  }
}
