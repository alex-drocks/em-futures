import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {CalculatorService} from "../../services/calculator.service";
import {ISelectOption, RepeatingCyclesEnum} from "./form.definitions";


@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent implements OnInit {
  public form!: FormGroup;
  public dateFormat = "YYYY-MM-DD";
  public repeatingCycleOptions!: ISelectOption[];

  constructor(private calculator: CalculatorService) {
  }

  ngOnInit(): void {
    this.repeatingCycleOptions = this.enumToKeyValueArray(RepeatingCyclesEnum);

    this.form = new FormGroup({
      dateStart: new FormControl(this.dateStart.toISOString()),
      initialDeposit: new FormControl(this.initialDeposit),
      regularDeposit: new FormControl(this.regularDeposit),
      repeatingCycle: new FormControl(this.repeatingCycleId),
    });

    this.calculator.calculateDailyData();
  }

  get minimumDeposit(): number {
    return this.calculator.minimumDeposit;
  }

  get dateStart(): Date {
    return this.calculator.getDateStart();
  }

  get initialDeposit(): number {
    return this.calculator.getInitialDeposit();
  }

  get regularDeposit(): number {
    return this.calculator.getRegularDeposit();
  }

  get repeatingCycleId(): keyof typeof RepeatingCyclesEnum {
    return this.calculator.getRepeatingCycle();
  }

  get repeatingCycleName(): string {
    return RepeatingCyclesEnum[this.repeatingCycleId];
  }

  public applyFormValues(): void {
    const {initialDeposit, regularDeposit, dateStart, repeatingCycle} = this.form.value;
    this.calculator.setDateStart(dateStart);
    this.calculator.setInitialDeposit(initialDeposit);
    this.calculator.setRegularDeposit(regularDeposit);
    this.calculator.setRepeatingCycle(repeatingCycle);
    this.calculator.calculateDailyData();
  }

  private enumToKeyValueArray(enumObj: Record<string, string>): ISelectOption[] {
    return Object.keys(enumObj).map((key: string) => ({
      id: key,
      name: enumObj[key]
    }));
  }

}
