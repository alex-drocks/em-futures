import {Injectable} from '@angular/core';
import {round} from "../helpers/utils";
import {
  storeDelete,
  storeLoadDate,
  storeLoadNumber,
  storeLoadString,
  storeSave
} from "../helpers/storage";
import {claimCycleEnum, depositCycleEnum} from "../components/form/form.definitions";
import * as dayjs from "dayjs";
import {Dayjs} from "dayjs";

export enum StorageKeys {
  INITIAL_DEPOSIT = "INITIAL_DEPOSIT",
  DATE_START = "DATE_START",
  REGULAR_DEPOSIT_AMOUNT = "REGULAR_DEPOSIT_AMOUNT",
  DEPOSIT_CYCLE = "DEPOSIT_CYCLE",
  CLAIM_CYCLE = "CLAIM_CYCLE",
  START_CLAIM_AMOUNT = "START_CLAIM_AMOUNT",
}

export interface IDailyData {
  date: string;
  balance: number;
  dailyYield: number;
  totalDeposited: number;
  totalClaimed: number;
  totalCompounded: number;
  availableToday: number;
  depositedToday: number;
  compoundedToday: number;
  claimedToday: number;
  balanceDifference: number;
}

@Injectable({
  providedIn: 'root'
})
export class CalculatorService {
  private _dateStart: Date;
  private _initialDeposit: number;
  private _regularDeposit: number;
  private _depositCycle: keyof typeof depositCycleEnum;
  private _claimCycle: keyof typeof claimCycleEnum;
  private _startClaimAmount: number;

  private _dailyData: IDailyData[];

  public yieldPercent = 0.5;
  public yieldRate = 0.5 / 100;
  public minimumDeposit = 200;

  constructor() {
    this._dateStart = storeLoadDate(StorageKeys.DATE_START);
    this._initialDeposit = storeLoadNumber(StorageKeys.INITIAL_DEPOSIT, this.minimumDeposit);
    this._regularDeposit = storeLoadNumber(StorageKeys.REGULAR_DEPOSIT_AMOUNT, this.minimumDeposit);
    this._depositCycle = storeLoadString(StorageKeys.DEPOSIT_CYCLE, "TWO_WEEKS") as keyof typeof depositCycleEnum;
    this._claimCycle = storeLoadString(StorageKeys.CLAIM_CYCLE, "WEEK") as keyof typeof claimCycleEnum;
    this._startClaimAmount = storeLoadNumber(StorageKeys.START_CLAIM_AMOUNT, 20000);
    this._dailyData = [];
  }

  public getDateStart(): Date {
    return this._dateStart;
  }

  public setDateStart(value: Date | string): void {
    if (value) {
      this._dateStart = new Date(value);
      storeSave(StorageKeys.DATE_START, this._dateStart);
    } else {
      this._dateStart = new Date();
      storeDelete(StorageKeys.DATE_START);
    }
  }

  public getInitialDeposit(): number {
    return this._initialDeposit;
  }

  public setInitialDeposit(value: number): void {
    this._initialDeposit = value ?? this.minimumDeposit;
    storeSave(StorageKeys.INITIAL_DEPOSIT, this._initialDeposit);
  }

  public getRegularDeposit(): number {
    return this._regularDeposit;
  }

  public getDepositCycle(): keyof typeof depositCycleEnum {
    return this._depositCycle;
  }

  public getClaimCycle(): keyof typeof claimCycleEnum {
    return this._claimCycle;
  }

  public getStartClaimAmount(): number {
    return this._startClaimAmount;
  }

  public getDailyData(): IDailyData[] {
    return this._dailyData;
  }

  public setRegularDeposit(value: number): void {
    this._regularDeposit = value ?? this.minimumDeposit;
    storeSave(StorageKeys.REGULAR_DEPOSIT_AMOUNT, this._regularDeposit);
  }

  public setDepositCycle(value: keyof typeof depositCycleEnum): void {
    this._depositCycle = value ?? "TWO_WEEKS";
    storeSave(StorageKeys.DEPOSIT_CYCLE, this._depositCycle);
  }

  public setClaimCycle(value: keyof typeof claimCycleEnum): void {
    this._claimCycle = value ?? "WEEK";
    storeSave(StorageKeys.CLAIM_CYCLE, this._claimCycle);
  }

  public setStartClaimAmount(value: number): void {
    this._startClaimAmount = value ?? 20000;
    storeSave(StorageKeys.START_CLAIM_AMOUNT, this._startClaimAmount);
  }

  public roundNumber(value: number, precision: number = 2): number {
    return round(value, precision);
  }

  public getYieldPerDay(balance: number): number {
    return balance * this.yieldRate;
  }

  public getCurrentDailyYieldAmount(): string {
    return this.roundNumber(this.getYieldPerDay(this.getInitialDeposit())).toString();
  }

  public evaluateShouldDeposit(date: dayjs.Dayjs, index: number): boolean {
    if (index <= 0) {
      return false;
    }
    const cycle = this.getDepositCycle();
    switch (cycle) {
      case "DAY":
        return true;
      default:
        return false;
    }
  }

  // TODO: calculate data
  public calculateDailyData(): void {
    this._dailyData = [];

    const dateStart = this.getDateStart();
    const regularDepositAmount = this.getRegularDeposit();
    const daysToCalculate = 5

    const total = {
      daysElapsed: 0,
      balance: this.getInitialDeposit(),
      deposited: this.getInitialDeposit(),
      compounded: 0,
      claimed: 0,
      available: 0,
    }

    for (let index = 0; index < daysToCalculate; index++) {
      total.daysElapsed = index; // starts at 0 because interest has not accrued yet

      const date = dayjs(dateStart).add(total.daysElapsed, "day");
      const dailyYield = this.getYieldPerDay(total.balance);
      const availableToday = total.daysElapsed > 0 ? dailyYield : 0;
      let depositedToday = 0
      let compoundedToday = 0;
      let claimedToday = 0;

      const shouldDeposit = this.evaluateShouldDeposit(date, total.daysElapsed);
      if (shouldDeposit) {
        depositedToday = regularDepositAmount;
        compoundedToday = availableToday;
        total.balance += depositedToday + compoundedToday;
        total.deposited += depositedToday;
        total.compounded += compoundedToday;
      }

      const shouldClaimToday = false; // TODO
      if (shouldClaimToday) {
        claimedToday = availableToday;
        total.balance -= claimedToday;
        total.claimed += claimedToday;
      }

      this._dailyData.push({
        date: date.format("YY-MM-DD"),
        balance: this.roundNumber(total.balance),
        dailyYield: this.roundNumber(dailyYield),
        totalDeposited: this.roundNumber(total.deposited),
        totalCompounded: this.roundNumber(total.compounded),
        totalClaimed: this.roundNumber(total.claimed),
        availableToday: this.roundNumber(availableToday),
        depositedToday: this.roundNumber(depositedToday),
        compoundedToday: this.roundNumber(compoundedToday),
        claimedToday: this.roundNumber(claimedToday),
        balanceDifference: this.roundNumber(depositedToday + compoundedToday - claimedToday),
      });

    }

  }

}
