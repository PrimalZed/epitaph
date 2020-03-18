import { Injectable, OnDestroy } from "@angular/core";
import { Store, select } from "@ngrx/store";
import { 
  DBSchema,
  IDBPDatabase,
  IDBPTransaction,
  IDBPObjectStore,
  openDB
} from "idb";
import { Subject, merge } from "rxjs";
import { first, switchMap, tap } from "rxjs/operators";

import { AppState } from "store/app-state";
import { selectSaveState } from "store/meta.selectors";
import { SaveState } from "store/system/save-state";
import { loadSave, newSave, saveSuccess } from "store/system/system.actions";

interface SavesDbSchema extends DBSchema {
  abstracts: {
    key: number;
    value: {
      id?: number;
      name: string;
      date: Date;
    }
  },
  states: {
    key: number;
    value: SaveState;
  };
}

type StoreName = 
  | "abstracts"
  | "states";

@Injectable({
  providedIn: "root"
})
export class SaveService implements OnDestroy {
  private dbPromise = openDB<SavesDbSchema>("epitaph-saves", 1, { upgrade: this.upgrade });

  private saveSubject: Subject<void> = new Subject();
  private save$ = this.saveSubject
    .pipe(
      switchMap(() => this.store.pipe(select(selectSaveState), first())),
      switchMap((state) => this.dbPromise
        .then((db) => db.put("abstracts", state.id ? { id: state.id, name: state.name, date: new Date() } : { name: state.name, date: new Date() })
          .then((id) => db.put("states", { ...state, id }))
        )
      ),
      tap((id) => {
        this.store.dispatch(saveSuccess({ id }));
      })
    );

  private loadSubject: Subject<number> = new Subject();
  private load$ = this.loadSubject
    .pipe(
      switchMap((id) => this.dbPromise
        .then((db) => id
          ? db.get("states", id)
          : db.getAll("abstracts")
            .then((abstracts) => {
              const latestAbstract = abstracts.sort((a, b) => a.date.valueOf() - b.date.valueOf()).pop();
              return latestAbstract
                ? db.get("states", latestAbstract.id)
                : Promise.resolve({ id: null, name: null, conditions: null });
            })
        )
      ),
      tap((saveState) => {
        this.store.dispatch(loadSave({ saveState }));
      })
    );

  private subscription = merge(this.save$, this.load$).subscribe();

  constructor(
    private store: Store<AppState>,
    // private modalService: NgbModal
  ) { }

  private upgrade(db: IDBPDatabase<SavesDbSchema>, oldVersion: number, newVersion: number, transaction: IDBPTransaction<SavesDbSchema, StoreName[]>) {
    let abstractsStore: IDBPObjectStore<SavesDbSchema, StoreName[], "abstracts">;
    let statesStore: IDBPObjectStore<SavesDbSchema, StoreName[], "states">;

    if (oldVersion < 1) {
      abstractsStore = db.createObjectStore("abstracts", { keyPath: "id", autoIncrement: true });
      statesStore = db.createObjectStore("states", { keyPath: "id" });
    }
    else {
      abstractsStore = transaction.objectStore("abstracts");
      statesStore = transaction.objectStore("states");
    }
  }

  new() {
    this.store.dispatch(newSave());
  }

  save() {
    this.saveSubject.next();
  }

  list() {
    return this.dbPromise
      .then((db) => db.getAll("abstracts"))
      .then((abstracts) => abstracts.sort((a, b) => b.date.valueOf() - a.date.valueOf()));
  }

  load(id?: number) {
    this.loadSubject.next(id);
  }

  ngOnDestroy() {
    if (this.subscription && !this.subscription.closed) {
      this.subscription.unsubscribe();
    }
  }
}
