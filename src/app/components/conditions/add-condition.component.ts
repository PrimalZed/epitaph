import { Component } from "@angular/core";
import { Store } from "@ngrx/store";
import { AppState } from "store/app-state";
import { ConditionSpec } from "store/condition-specs/condition-spec";
import { addCondition } from "store/conditions/conditions.actions";
import { CreateConditionCommand } from "store/conditions/create-condition-command";
import { Key } from "store/keys/key";
import { Router, ActivatedRoute } from "@angular/router";

interface FormModel {
  condition: ConditionSpec;
  subject: string;
  createdBy: string;
  key: Key;
  activationPlasm: number;
  charges: number;
}

@Component({
  selector: "add-condition",
  templateUrl: "./add-condition.component.html"
})
export class AddConditionComponent {
  public formModel: FormModel = {
    condition: null,
    subject: null,
    createdBy: null,
    key: null,
    activationPlasm: null,
    charges: null
  }

  public submitting: boolean;

  constructor(
    private store: Store<AppState>,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  submit(formModel: FormModel) {
    let command: CreateConditionCommand;
    switch(formModel.condition.type) {
      case "simple":
        command = {
          specKey: formModel.condition.key,
          subject: formModel.subject,
          createdBy: formModel.createdBy,
          keyKey: formModel.key && formModel.key.key,
          activationPlasm: formModel.activationPlasm
        };
        break;
      case "charged":
        command = {
          specKey: formModel.condition.key,
          subject: formModel.subject,
          createdBy: formModel.createdBy,
          keyKey: formModel.key && formModel.key.key,
          activationPlasm: formModel.activationPlasm,
          charges: formModel.charges
        };
    }
    
    this.store.dispatch(addCondition({ command }));

    this.router.navigate(["../"], { relativeTo: this.route });
  }
}
