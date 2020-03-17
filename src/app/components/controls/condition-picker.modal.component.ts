import { Component, ChangeDetectionStrategy } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { Store, select } from "@ngrx/store";
import { AppState } from "store/app-state";
import { ConditionSpec } from "store/condition-specs/condition-spec";
import { selectAllConditionSpecs } from "store/condition-specs/condition-specs.selectors";

@Component({
  selector: "condition-picker-modal",
  templateUrl: "./picker.modal.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConditionPickerModalComponent {
  public options$ = this.store.pipe(select(selectAllConditionSpecs));
  
  constructor(
    private modal: NgbActiveModal,
    private store: Store<AppState>
  ) { }

  select(condition: ConditionSpec) {
    this.modal.close(condition);
  }
}
