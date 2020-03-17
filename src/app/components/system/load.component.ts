import { Component, ChangeDetectionStrategy } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { from } from "rxjs";
import { SaveService } from "services/save.service";

@Component({
  selector: "load",
  templateUrl: "./load.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoadComponent {
  public saves$ = from(this.saveService.list());

  constructor(
    private saveService: SaveService,
    private modal: NgbActiveModal
  ) { }

  load(id: number) {
    this.saveService.load(id);
    this.modal.close();
  }
}
