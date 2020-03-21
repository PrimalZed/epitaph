import { Component, ChangeDetectionStrategy, Input } from "@angular/core";
import { Key } from "store/keys/key";

@Component({
  selector: "key-card",
  templateUrl: "./key-card.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class KeyCardComponent {
  @Input() key: Key;

  @Input() collapsible: boolean = true;

  expanded: boolean = false;

  toggleExpand() {
    this.expanded = !this.expanded;
  }
}
