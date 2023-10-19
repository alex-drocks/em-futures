import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {CalculatorService} from "../../services/calculator.service";
import {ISelectOption, depositCycleEnum, claimCycleEnum} from "./form.definitions";


@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent implements OnInit {
  public form!: FormGroup;
  public dateFormat = "YYYY-MM-DD";
  public depositCycleOptions!: ISelectOption[];
  public claimCycleOptions!: ISelectOption[];

  constructor(private calculator: CalculatorService) {
  }

  ngOnInit(): void {
    this.depositCycleOptions = this.mapEnumToSelectOptions(depositCycleEnum, "Every ");
    this.claimCycleOptions = this.mapEnumToSelectOptions(claimCycleEnum, "", " later");

    this.form = new FormGroup({
      dateStart: new FormControl(this.dateStart.toISOString()),
      initialDeposit: new FormControl(this.initialDeposit),
      regularDeposit: new FormControl(this.regularDeposit),
      depositCycle: new FormControl(this.depositCycleId),
      claimCycle: new FormControl(this.claimCycleId),
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

  get depositCycleId(): keyof typeof depositCycleEnum {
    return this.calculator.getDepositCycle();
  }

  get claimCycleId(): keyof typeof claimCycleEnum {
    return this.calculator.getClaimCycle();
  }

  get depositCycleName(): string {
    return depositCycleEnum[this.depositCycleId];
  }

  get claimCycleName(): string {
    return claimCycleEnum[this.claimCycleId];
  }

  public applyFormValues(): void {
    const {initialDeposit, regularDeposit, dateStart, depositCycle, claimCycle} = this.form.value;
    this.calculator.setDateStart(dateStart);
    this.calculator.setInitialDeposit(initialDeposit);
    this.calculator.setRegularDeposit(regularDeposit);
    this.calculator.setDepositCycle(depositCycle);
    this.calculator.setClaimCycle(claimCycle);
    this.calculator.calculateDailyData();
  }

  private mapEnumToSelectOptions(enumObj: Record<string, string>, prefix: string = "", suffix: string = ""): ISelectOption[] {
    return Object.keys(enumObj).map((key: string) => ({
      id: key,
      name: `${prefix}${enumObj[key]}${suffix}`
    }));
  }

}
