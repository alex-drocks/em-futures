import {Injectable} from '@angular/core';
import {round} from "../helpers/utils";
import {
  storeDelete,
  storeLoadDate,
  storeLoadNumber,
  storeLoadString,
  storeSave
} from "../helpers/storage";
import {RepeatingCyclesEnum} from "../components/form/form.definitions";
import * as dayjs from "dayjs";

export enum StorageKeys {
  INITIAL_DEPOSIT = "INITIAL_DEPOSIT",
  DATE_START = "DATE_START",
  REGULAR_DEPOSIT_AMOUNT = "REGULAR_DEPOSIT_AMOUNT",
  REPEATING_CYCLE = "REPEATING_CYCLE",
}

export interface IDailyData {
  date: string;
  balance: number;
  deposits: number;
  claimable: number;
  yieldPerDay: number;
}

@Injectable({
  providedIn: 'root'
})
export class CalculatorService {
  private _dateStart: Date;
  private _initialDeposit: number;
  private _regularDeposit: number;
  private _repeatingCycle: keyof typeof RepeatingCyclesEnum;

  private _dailyData: IDailyData[];

  public yieldPercent = 0.5;
  public yieldRate = 0.5 / 100;
  public minimumDeposit = 200;

  constructor() {
    this._dateStart = storeLoadDate(StorageKeys.DATE_START);
    this._initialDeposit = storeLoadNumber(StorageKeys.INITIAL_DEPOSIT, this.minimumDeposit);
    this._regularDeposit = storeLoadNumber(StorageKeys.REGULAR_DEPOSIT_AMOUNT, this.minimumDeposit);
    this._repeatingCycle = storeLoadString(StorageKeys.REPEATING_CYCLE, "WEEK") as keyof typeof RepeatingCyclesEnum;
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

  public getRepeatingCycle(): keyof typeof RepeatingCyclesEnum {
    return this._repeatingCycle;
  }

  public getDailyData(): IDailyData[] {
    return this._dailyData;
  }

  public setRegularDeposit(value: number): void {
    this._regularDeposit = value ?? this.minimumDeposit;
    storeSave(StorageKeys.REGULAR_DEPOSIT_AMOUNT, this._regularDeposit);
  }

  public setRepeatingCycle(value: keyof typeof RepeatingCyclesEnum): void {
    this._repeatingCycle = value ?? "DAY";
    storeSave(StorageKeys.REPEATING_CYCLE, this._repeatingCycle);
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

  // TODO: calculate data
  public calculateDailyData(): void {
    this._dailyData = [];
    const dateStart = dayjs(this.getDateStart());
    const maxDays = 5

    let balance = this.getInitialDeposit();
    let deposits = balance;
    let claimable = 0;

    for (let index = 0; index < maxDays; index++) {
      const yieldPerDay = this.getYieldPerDay(balance);
      claimable = yieldPerDay * index;


      this._dailyData.push({
        date: dateStart.add(index, "day").format("YYYY-MM-DD"),
        balance,
        claimable,
        yieldPerDay: this.roundNumber(yieldPerDay),
        deposits,
      })
    }

  }

}
