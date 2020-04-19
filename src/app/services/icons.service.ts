import { Injectable } from "@angular/core";
import { FaIconLibrary } from "@fortawesome/angular-fontawesome";
import {
  faBars,
  faCheck,
  faDoorOpen,
  faPlus,
  faKey,
  faSave,
  faTag,
  faTimes,
  faTrashAlt
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
      faDoorOpen,
      faPlus,
      faKey,
      faSave,
      faTag,
      faTimes,
      faTrashAlt
    );
  }
}
