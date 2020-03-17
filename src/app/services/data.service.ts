import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Store } from "@ngrx/store";
import { merge } from "rxjs";
import { tap } from "rxjs/operators";
import { AppState } from "store/app-state";
import { ConditionSpec } from "store/condition-specs/condition-spec";
import { loadConditionSpecs } from "store/condition-specs/condition-specs.actions";
import { Haunt } from "store/haunts/haunt";
import { loadHaunts } from "store/haunts/haunts.actions";
import { Key } from "store/keys/key";
import { loadKeys } from "store/keys/keys.actions";
import { environment } from "environments/environment";

@Injectable({
  providedIn: "root"
})
export class DataService {
  private loadHaunts$ = this.http.get<Haunt[]>(`${environment.basePath}/assets/data/haunts.json`)
    .pipe(
      tap((haunts) => this.store.dispatch(loadHaunts({ haunts })))
    );

  private loadConditions$ = this.http.get<ConditionSpec[]>(`${environment.basePath}/assets/data/conditions.json`)
    .pipe(
      tap((conditions) => this.store.dispatch(loadConditionSpecs({ conditions })))
    );
    
  private loadKeys$ = this.http.get<Key[]>(`${environment.basePath}/assets/data/keys.json`)
    .pipe(
      tap((keys) => this.store.dispatch(loadKeys({ keys })))
    );

  constructor(private http: HttpClient, private store: Store<AppState>) { }

  initialize(): Promise<unknown> {
    return merge(this.loadHaunts$, this.loadConditions$, this.loadKeys$)
      .toPromise();
  }
}
