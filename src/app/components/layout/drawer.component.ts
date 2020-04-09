import { Component, OnDestroy, Output, EventEmitter, Renderer2 } from "@angular/core";
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { filter, map, mapTo, switchMap, startWith } from "rxjs/operators";
import { LoadComponent } from "components/system/load.component";
import { SaveService } from "services/save.service";

@Component({
  selector: "drawer",
  templateUrl: "./drawer.component.html",
  styleUrls: ["./drawer.component.scss"]
})
export class DrawerComponent implements OnDestroy {
  @Output("close") closeEmitter: EventEmitter<void> = new EventEmitter();

  public conditionsActive$ = this.checkActiveNavigation("conditions");
  public hauntsActive$ = this.checkActiveNavigation("haunts");
  public keysActive$ = this.checkActiveNavigation("keys");

  constructor(
    private renderer: Renderer2,
    private saveService: SaveService,
    private modalService: NgbModal,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.renderer.addClass(document.body, "modal-open");
  }

  private checkActiveNavigation(navigationKey: string) {
    return this.router.events
      .pipe(
        filter(e => e instanceof NavigationEnd),
        startWith(null),
        mapTo(this.activatedRoute),
        map((route) => {
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route;
        }),
        switchMap((route) => route.data),
        map((data) => data.activeNavigation === navigationKey)
      );
  }

  new() {
    this.saveService.new();
    this.close();
  }

  goToLoad() {
    // this.router.navigate(["/system/load"]);
    const modalRef = this.modalService.open(LoadComponent, { size: "lg" })

    modalRef.result
      .then(() => {
        this.close();
      })
      .catch(() => { });
  }

  close() {
    this.closeEmitter.emit();
  }

  ngOnDestroy() {
    this.renderer.removeClass(document.body, "modal-open");
  }
}
