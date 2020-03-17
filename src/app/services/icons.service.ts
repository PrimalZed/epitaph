import { Injectable } from "@angular/core";
import { FaIconLibrary } from "@fortawesome/angular-fontawesome";
import {
  faBars,
  faCheck,
  faPlus,
  faKey,
  faSave,
  faTag,
  faTimes
} from "@fortawesome/free-solid-svg-icons";

@Injectable({
  providedIn: "root"
})
export class IconsService {
  constructor(private iconLibrary: FaIconLibrary) { }

  initialize() {
    this.iconLibrary.addIcons(
      faBars,
      faCheck,
      faPlus,
      faKey,
      faSave,
      faTag,
      faTimes
    );
  }
}
