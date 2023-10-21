import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {CalculatorService} from "../../services/calculator.service";
import {ISelectOption, DepositCycleEnum, ClaimCycleEnum} from "./form.definitions";


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
    this.depositCycleOptions = this.mapEnumToSelectOptions(DepositCycleEnum, "Every ");
    this.claimCycleOptions = this.mapEnumToSelectOptions(ClaimCycleEnum, "", " later");

    this.form = new FormGroup({
      dateStart: new FormControl(this.dateStart.toISOString()),
      initialDeposit: new FormControl(this.initialDeposit),
      regularDeposit: new FormControl(this.regularDeposit),
      depositCycle: new FormControl(this.depositCycleId),
      claimCycle: new FormControl(this.claimCycleId),
      startClaimAmount: new FormControl(this.startClaimAmount),
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

  get depositCycleId(): keyof typeof DepositCycleEnum {
    return this.calculator.getDepositCycle();
  }

  get claimCycleId(): keyof typeof ClaimCycleEnum {
    return this.calculator.getClaimCycle();
  }
  get startClaimAmount(): number {
    return this.calculator.getStartClaimAmount();
  }

  get depositCycleName(): string {
    return DepositCycleEnum[this.depositCycleId];
  }

  get claimCycleName(): string {
    return ClaimCycleEnum[this.claimCycleId];
  }

  public applyFormValues(): void {
    const {initialDeposit, regularDeposit, dateStart, depositCycle, claimCycle, startClaimAmount} = this.form.value;
    this.calculator.setDateStart(dateStart);
    this.calculator.setInitialDeposit(initialDeposit);
    this.calculator.setRegularDeposit(regularDeposit);
    this.calculator.setDepositCycle(depositCycle);
    this.calculator.setClaimCycle(claimCycle);
    this.calculator.setStartClaimAmount(startClaimAmount);

    this.calculator.calculateDailyData();
  }

  private mapEnumToSelectOptions(enumObj: Record<string, string>, prefix: string = "", suffix: string = ""): ISelectOption[] {
    return Object.keys(enumObj).map((key: string) => ({
      id: key,
      name: `${prefix}${enumObj[key]}${suffix}`
    }));
  }

}
