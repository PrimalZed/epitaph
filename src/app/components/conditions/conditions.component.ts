import { Component } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Store, select } from "@ngrx/store";
import { BehaviorSubject, Observable } from "rxjs";
import { combineLatest, map, scan } from "rxjs/operators";
import { AppState } from "store/app-state";
import { Condition } from "store/conditions/condition";
import { selectAllConditions, selectTotalConditions } from "store/conditions/conditions.selectors";

@Component({
  selector: "conditions",
  templateUrl: "./conditions.component.html",
  styles: [
    "button { position: fixed; bottom: 2rem; right: 2rem; }"
  ]
})
export class ConditionsComponent {
  private expandSubject: BehaviorSubject<number> = new BehaviorSubject(null);
  private expandConditionIds$ = this.expandSubject
    .pipe(
      scan<number, number[]>((expanded, toggleId) => {
        const index = expanded.indexOf(toggleId);
        if (index != -1) {
          expanded.splice(index, 1);
          return expanded;
        }
        expanded.push(toggleId);
        return expanded;
      }, [])
    );

  public conditions$: Observable<(Condition & { expanded: boolean })[]> = this.store
    .pipe(
      select(selectAllConditions),
      combineLatest(this.expandConditionIds$),
      map(([conditions, expandConditionIds]) => conditions.map((condition) => ({ ...condition, expanded: expandConditionIds.includes(condition.id) })))
    );

  public conditionsCount$ = this.store.pipe(select(selectTotalConditions));
  
  constructor(
    private store: Store<AppState>,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  toggleExpand(conditionId: number) {
    this.expandSubject.next(conditionId);
  }

  addCondition() {
    this.router.navigate(["add"], { relativeTo: this.route });
  }
}
