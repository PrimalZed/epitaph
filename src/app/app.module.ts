
import { NgModule, APP_INITIALIZER } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterModule, Routes } from "@angular/router";
import { ServiceWorkerModule } from "@angular/service-worker";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { NgbModalModule } from "@ng-bootstrap/ng-bootstrap";
import { StoreModule, Action } from "@ngrx/store";

import { ActionButtonComponent } from "components/common/action-button.component";
import { ActionComponent } from "components/common/action.component";
import { TableComponent } from "components/common/table.component";
import { AddConditionComponent } from "components/conditions/add-condition.component";
import { ConditionCardComponent } from "components/conditions/condition-card.component";
import { ConditionsComponent } from "components/conditions/conditions.component";
import { ConnectionComponent } from "components/connection/connection.component";
import { ConditionPickerComponent } from "components/controls/condition-picker.component";
import { ConditionPickerModalComponent } from "components/controls/condition-picker.modal.component";
import { EnhancementPickerModalComponent } from "components/controls/enhancement-picker.modal.component";
import { KeyPickerComponent } from "components/controls/key-picker.component";
import { KeyPickerModalComponent } from "components/controls/key-picker.modal.component";
import { HauntActionComponent } from "components/haunts/haunt-action.component";
import { HauntCardComponent } from "components/haunts/haunt-card.component";
import { HauntModalComponent } from "components/haunts/haunt.modal.component";
import { HauntRankComponent } from "components/haunts/haunt-rank.component";
import { HauntsComponent } from "components/haunts/haunts.components";
import { KeyCardComponent } from "components/keys/key-card.component";
import { KeyModalComponent } from "components/keys/key.modal.component";
import { KeysComponent } from "components/keys/keys.component";
import { DrawerComponent } from "components/layout/drawer.component";
import { AboutComponent } from "components/system/about.component";
import { LoadComponent } from "components/system/load.component";
import { SaveNameComponent } from "components/system/save-name.component";

import { environment } from "environments/environment";

import { ArrayPipe } from "pipes/array.pipe";
import { DotsPipe } from "pipes/dots.pipe";
import { JoinPipe } from "pipes/join.pipe";
import { MarkdownPipe } from "pipes/markdown.pipe";
import { PlasmPipe } from "pipes/plasm.pipe";

import { DataService } from "services/data.service";
import { IconsService } from "services/icons.service";
import { SaveService } from "services/save.service";

import { AppState } from "store/app-state";
import { conditionSpecsReducer } from "store/condition-specs/condition-specs.reducer";
import { conditionsReducer } from "store/conditions/conditions.reducer";
import { hauntsReducer } from "store/haunts/haunts.reducers";
import { keysReducer } from "store/keys/keys.reducers";
import { systemReducer } from "store/system/system.reducers";

import { AppComponent } from "./app.component";
import { MaterialModule } from "./material.module";

const appRoutes: Routes = [
  { path: "", redirectTo: "/conditions", pathMatch: "full" },
  {
    path: "conditions",
    children: [
      { path: "", component: ConditionsComponent, pathMatch: "full" },
      { path: "add", component: AddConditionComponent }
    ],
    data: { activeNavigation: "conditions" }
  },
  { path: "haunts", component: HauntsComponent, data: { activeNavigation: "haunts" } },
  { path: "keys", component: KeysComponent, data: { activeNavigation: "keys" } },
  { path: "about", component: AboutComponent },
  { path: "connection", component: ConnectionComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    AboutComponent,
    ActionButtonComponent,
    ActionComponent,
    AddConditionComponent,
    ConditionCardComponent,
    ConditionsComponent,
    ConnectionComponent,
    ConditionPickerComponent,
    ConditionPickerModalComponent,
    DrawerComponent,
    EnhancementPickerModalComponent,
    HauntActionComponent,
    HauntCardComponent,
    HauntModalComponent,
    HauntRankComponent,
    HauntsComponent,
    LoadComponent,
    KeyCardComponent,
    KeyPickerComponent,
    KeyPickerModalComponent,
    KeyModalComponent,
    KeysComponent,
    SaveNameComponent,
    TableComponent,

    ArrayPipe,
    DotsPipe,
    JoinPipe,
    MarkdownPipe,
    PlasmPipe
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FontAwesomeModule,
    FormsModule,
    HttpClientModule,
    MaterialModule,
    NgbModalModule,
    RouterModule.forRoot(appRoutes, { useHash: true }),
    ServiceWorkerModule.register("ngsw-worker.js", { enabled: environment.production }),
    StoreModule.forRoot<AppState, Action>({
      conditionSpecs: conditionSpecsReducer,
      conditions: conditionsReducer,
      haunts: hauntsReducer,
      keys: keysReducer,
      system: systemReducer
    }),
  ],
  providers: [
    { provide: APP_INITIALIZER, useFactory: (dataService: DataService) => () => dataService.initialize(), deps: [DataService], multi: true },
    { provide: APP_INITIALIZER, useFactory: (iconsService: IconsService) => () => iconsService.initialize(), deps: [IconsService], multi: true },
    { provide: APP_INITIALIZER, useFactory: (saveService: SaveService) => () => saveService.load(), deps: [SaveService], multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
