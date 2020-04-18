import { Component, ChangeDetectionStrategy, OnDestroy, HostListener } from "@angular/core";
import { Router, NavigationEnd, ActivatedRoute } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Store, select } from "@ngrx/store";
import { Subject, Subscription, combineLatest, merge, of } from "rxjs";
import { filter, first, map, mapTo, startWith, switchMap, tap } from "rxjs/operators";
import { SaveNameComponent } from "components/system/save-name.component";
import { selectHost } from "rtc/store/host/host.selectors";
import { SaveService } from "services/save.service";
import { AppState } from "store/app-state";
import { selectDirty, selectSaveName } from "store/system/system.selectors";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnDestroy {
  title = "Epitaph";

  public showDrawer: boolean;

  public headerName$ = this.router.events
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
      map((data) => data.activeNavigation)
    );
  
  private dirty: boolean;
  public dirty$ = combineLatest(this.store.pipe(select(selectDirty)), this.store.pipe(select(selectHost)))
    .pipe(
      map(([dirty, host]) => dirty && host),
      tap((dirty) => {
        this.dirty = dirty;
      })
    );

  private saveSubject: Subject<void> = new Subject();
  private save$ = this.saveSubject
    .pipe(
      switchMap(() => this.store.pipe(select(selectSaveName), first())),
      switchMap((name) => {
        if (name)
        {
          return of(true);
        }

        const modalRef = this.modalService.open(SaveNameComponent);

        return modalRef.result
          .then((name) => true)
          .catch(() => false);
      }),
      filter((canContinue) => canContinue),
      tap(() => {
        this.saveService.save();
      })
    );

  private closeDrawer$ = this.router.events
  .pipe(
    filter(e => e instanceof NavigationEnd),
    tap(() => {
      this.showDrawer = false;
    })
  );

  private subscription: Subscription = merge(this.save$, this.closeDrawer$).subscribe();

  constructor(
    private saveService: SaveService,
    private store: Store<AppState>,
    private modalService: NgbModal,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  @HostListener("window:beforeunload")
  beforeUnload() {
    return !this.dirty;
  }

  save() {
    this.saveSubject.next();
  }

  ngOnDestroy() {
    if (this.subscription && !this.subscription.closed) {
      this.subscription.unsubscribe();
    }
  }
}
