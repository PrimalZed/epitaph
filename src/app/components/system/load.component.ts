import { Component, ChangeDetectionStrategy } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { SaveService } from "services/save.service";

@Component({
  selector: "load",
  templateUrl: "./load.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoadComponent {
  public saves$ = this.saveService.saves$;

  constructor(
    private saveService: SaveService,
    private modal: NgbActiveModal
  ) { }

  load(id: number) {
    this.saveService.load(id);
    this.modal.close();
  }

  delete(id: number) {
    this.saveService.delete(id);
  }
}
