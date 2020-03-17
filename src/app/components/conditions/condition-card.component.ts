import { Component, Input, ChangeDetectionStrategy, Output, EventEmitter } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Store } from "@ngrx/store";
import { EnhancementPickerModalComponent } from "components/controls/enhancement-picker.modal.component";
import { HauntModalComponent } from "components/haunts/haunt.modal.component";
import { AppState } from "store/app-state";
import { Condition } from "store/conditions/condition";
import { removeCondition, decrementConditionCharge, addConditionEffect } from "store/conditions/conditions.actions";
import { HauntEnhancement } from "store/haunts/haunt-enhancement";

@Component({
  selector: "condition-card",
  templateUrl: "./condition-card.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConditionCardComponent {
  @Input() condition: Condition & { expanded: boolean };
  @Output("toggle") toggleEmitter: EventEmitter<void> = new EventEmitter();

  constructor(
    private modalService: NgbModal,
    private store: Store<AppState>
  ) { }

  toggleExpand() {
    this.toggleEmitter.emit();
  }

  viewHaunt(hauntKey: string) {
    const modalRef = this.modalService.open(HauntModalComponent, { size: "lg" });

    modalRef.componentInstance.key = hauntKey;
  }

  consumeCharge(conditionId: number) {
    this.store.dispatch(decrementConditionCharge({ id: conditionId }));
  }

  addEnhancement(conditionId: number, hauntKey: string) {
    const modalRef = this.modalService.open(EnhancementPickerModalComponent);

    modalRef.componentInstance.hauntKey = hauntKey;

    modalRef.result
      .then((enhancement: HauntEnhancement) => {
        this.store.dispatch(addConditionEffect({ id: conditionId, effectKey: enhancement.key }));
      })
      .catch(() => { });
  }

  remove(id: number) {
    this.store.dispatch(removeCondition({ id }));
  }
}
