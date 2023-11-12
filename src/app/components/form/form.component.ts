import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {CalculatorService} from "../../services/calculator.service";
import {CycleEnum, CycleEnumDayValues, CycleTranslations, ISelectOption} from "../../app.definitions";
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
    this.calculator.loadInitialState();

    this.depositCycleOptions = this.mapCycleEnumToSelectOptions(CycleEnum, "");
    this.withdrawCycleOptions = this.mapCycleEnumToSelectOptions(CycleEnum, "");

    this.form = new FormGroup({
      dateStart: new FormControl(this.dateStart.toISOString()),
      initialDeposit: new FormControl(this.initialDeposit),
      regularDeposit: new FormControl(this.regularDeposit),
      depositCycle: new FormControl(this.depositCycleKey),
      withdrawCycle: new FormControl(this.withdrawCycleKey),
      startWithdrawingBalance: new FormControl(this.startWithdrawingBalance),
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

  get depositCycleKey(): CycleEnum {
    return this.calculator.getDepositCycle();
  }

  get withdrawCycleKey(): CycleEnum {
    return this.calculator.getWithdrawCycle();
  }

  get startWithdrawingBalance(): number {
    return this.calculator.getStartWithdrawingBalance();
  }

  get yearsToForecast(): number {
    return this.calculator.getYearsToForecast();
  }

  get depositCycleName(): CycleTranslations {
    return CycleTranslations[this.depositCycleKey];
  }

  get depositCycleDays(): CycleEnumDayValues {
    return CycleEnumDayValues[this.depositCycleKey];
  }

  get withdrawCycleName(): CycleTranslations {
    return CycleTranslations[this.withdrawCycleKey]
  }

  get withdrawCycleDays(): CycleEnumDayValues {
    return CycleEnumDayValues[this.withdrawCycleKey];
  }

  public applyFormValues(): void {
    this.calculator.setDateStart(this.form.value.dateStart);
    this.calculator.setInitialDeposit(this.form.value.initialDeposit);
    this.calculator.setRegularDeposit(this.form.value.regularDeposit);
    this.calculator.setDepositCycle(this.form.value.depositCycle);
    this.calculator.setWithdrawCycle(this.form.value.withdrawCycle);
    this.calculator.setStartWithdrawingBalance(this.form.value.startWithdrawingBalance);
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
        yearsToForecast: this.calculator.getYearsToForecast(),
      },
      {emitEvent: false}
    );
  }

  private mapCycleEnumToSelectOptions(cycleEnum: typeof CycleEnum, prefix: string = "", suffix: string = ""): ISelectOption[] {
    return Object.keys(cycleEnum).map((key: string) => ({
      id: key,
      name: `${prefix}${CycleTranslations[key as keyof typeof CycleTranslations]}${suffix}`,
    }));
  }

}
