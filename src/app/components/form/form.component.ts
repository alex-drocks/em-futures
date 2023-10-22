import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {CalculatorService} from "../../services/calculator.service";
import {CycleEnum, ISelectOption} from "../../app.definitions";
import {storeClearAll} from "../../helpers/storage";


@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent implements OnInit {
  public form!: FormGroup;
  public depositCycleOptions!: ISelectOption[];
  public withdrawCycleOptions!: ISelectOption[];

  constructor(private calculator: CalculatorService) {
  }

  ngOnInit(): void {
    this.depositCycleOptions = this.mapEnumToSelectOptions(CycleEnum, "Every ");
    this.withdrawCycleOptions = this.mapEnumToSelectOptions(CycleEnum, "Every ");

    this.form = new FormGroup({
      dateStart: new FormControl(this.dateStart.toISOString()),
      initialDeposit: new FormControl(this.initialDeposit),
      regularDeposit: new FormControl(this.regularDeposit),
      depositCycle: new FormControl(this.depositCycleId),
      withdrawCycle: new FormControl(this.withdrawCycleId),
      startWithdrawingBalance: new FormControl(this.startWithdrawingBalance),
      stopDepositingBalance: new FormControl(this.stopDepositingBalance),
      yearsToForecast: new FormControl(this.yearsToForecast),
    });

    this.calculator.calculateDailyData();
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

  get depositCycleId(): keyof typeof CycleEnum {
    return this.calculator.getDepositCycle();
  }

  get withdrawCycleId(): keyof typeof CycleEnum {
    return this.calculator.getWithdrawCycle();
  }

  get startWithdrawingBalance(): number {
    return this.calculator.getStartWithdrawingBalance();
  }

  get stopDepositingBalance(): number {
    return this.calculator.getStopDepositingBalance();
  }

  get yearsToForecast(): number {
    return this.calculator.getYearsToForecast();
  }

  get depositCycleName(): string {
    return CycleEnum[this.depositCycleId];
  }

  get withdrawCycleName(): string {
    return CycleEnum[this.withdrawCycleId];
  }

  public applyFormValues(): void {
    this.calculator.setDateStart(this.form.value.dateStart);
    this.calculator.setInitialDeposit(this.form.value.initialDeposit);
    this.calculator.setRegularDeposit(this.form.value.regularDeposit);
    this.calculator.setDepositCycle(this.form.value.depositCycle);
    this.calculator.setWithdrawCycle(this.form.value.withdrawCycle);
    this.calculator.setStartWithdrawingBalance(this.form.value.startWithdrawingBalance);
    this.calculator.setStopDepositingBalance(this.form.value.stopDepositingBalance);
    this.calculator.setYearsToForecast(this.form.value.yearsToForecast);

    this.calculator.calculateDailyData();

    this.forceRefreshFormDisplayedValues();
  }

  resetDefaults(): void {
    storeClearAll();
    this.calculator.resetDefaults();
    this.forceRefreshFormDisplayedValues();
    this.calculator.calculateDailyData();
  }

  private forceRefreshFormDisplayedValues(): void {
    // Ensure displayed value are up-to-date even if validation has modified them automatically
    this.form.setValue(
      {
        dateStart: this.calculator.getDateStart().toISOString(),
        initialDeposit: this.calculator.getInitialDeposit(),
        regularDeposit: this.calculator.getRegularDeposit(),
        depositCycle: this.calculator.getDepositCycle(),
        withdrawCycle: this.calculator.getWithdrawCycle(),
        startWithdrawingBalance: this.calculator.getStartWithdrawingBalance(),
        stopDepositingBalance: this.calculator.getStopDepositingBalance(),
        yearsToForecast: this.calculator.getYearsToForecast(),
      },
      {emitEvent: false}
    );
  }

  private mapEnumToSelectOptions(enumObj: Record<string, string>, prefix: string = "", suffix: string = ""): ISelectOption[] {
    return Object.keys(enumObj).map((key: string) => ({
      id: key,
      name: key === "NEVER" ? enumObj[key] : `${prefix}${enumObj[key]}${suffix}`,
    }));
  }

}
