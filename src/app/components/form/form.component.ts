import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {CalculatorService} from "../../services/calculator.service";
import {CycleEnum, ISelectOption} from "../../services/calculator.definitions";


@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent implements OnInit {
  public form!: FormGroup;
  public depositCycleOptions!: ISelectOption[];
  public claimCycleOptions!: ISelectOption[];

  constructor(private calculator: CalculatorService) {
  }

  ngOnInit(): void {
    this.depositCycleOptions = this.mapEnumToSelectOptions(CycleEnum, "Every ");
    this.claimCycleOptions = this.mapEnumToSelectOptions(CycleEnum, "", " after compound");

    this.form = new FormGroup({
      dateStart: new FormControl(this.dateStart.toISOString()),
      initialDeposit: new FormControl(this.initialDeposit),
      regularDeposit: new FormControl(this.regularDeposit),
      depositCycle: new FormControl(this.depositCycleId),
      claimCycle: new FormControl(this.claimCycleId),
      startClaimAmount: new FormControl(this.startClaimAmount),
      stopDepositAmount: new FormControl(this.stopDepositAmount),
    });

    this.calculator.calculateDailyData();
  }

  get minimumDeposit(): number {
    return this.calculator.MIN_DEPOSIT;
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

  get claimCycleId(): keyof typeof CycleEnum {
    return this.calculator.getClaimCycle();
  }

  get startClaimAmount(): number {
    return this.calculator.getStartClaimAmount();
  }

  get stopDepositAmount(): number {
    return this.calculator.getStopDepositAmount();
  }

  get depositCycleName(): string {
    return CycleEnum[this.depositCycleId];
  }

  get claimCycleName(): string {
    return CycleEnum[this.claimCycleId];
  }

  public applyFormValues(): void {
    this.calculator.setDateStart(this.form.value.dateStart);
    this.calculator.setInitialDeposit(this.form.value.initialDeposit);
    this.calculator.setRegularDeposit(this.form.value.regularDeposit);
    this.calculator.setDepositCycle(this.form.value.depositCycle);
    this.calculator.setClaimCycle(this.form.value.claimCycle);
    this.calculator.setStartClaimAmount(this.form.value.startClaimAmount);
    this.calculator.setStopDepositAmount(this.form.value.stopDepositAmount);

    this.calculator.calculateDailyData();

    this.forceRefreshFormDisplayedValues();
  }

  private forceRefreshFormDisplayedValues(): void {
    // Ensure displayed value are up-to-date even if validation has modified them automatically
    this.form.setValue(
      {
        dateStart: this.calculator.getDateStart().toISOString(),
        initialDeposit: this.calculator.getInitialDeposit(),
        regularDeposit: this.calculator.getRegularDeposit(),
        depositCycle: this.calculator.getDepositCycle(),
        claimCycle: this.calculator.getClaimCycle(),
        startClaimAmount: this.calculator.getStartClaimAmount(),
        stopDepositAmount: this.calculator.getStopDepositAmount(),
      },
      {emitEvent: false}
    );
  }

  private mapEnumToSelectOptions(enumObj: Record<string, string>, prefix: string = "", suffix: string = ""): ISelectOption[] {
    return Object.keys(enumObj).map((key: string) => ({
      id: key,
      name: `${prefix}${enumObj[key]}${suffix}`
    }));
  }

}
