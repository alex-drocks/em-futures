import {Injectable} from '@angular/core';
import {round} from "../helpers/utils";
import {
  localStorageDelete,
  localStorageLoadDate,
  localStorageLoadNumber,
  localStorageSave
} from "../helpers/storage";

enum StorageKeys {
  INITIAL_DEPOSIT = "INITIAL_DEPOSIT",
  DATE_START = "DATE_START",
  REGULAR_DEPOSIT_AMOUNT = "REGULAR_DEPOSIT_AMOUNT",
}

@Injectable({
  providedIn: 'root'
})
export class CalculatorService {
  private _dateStart: Date;
  private _initialDeposit: number;
  private _regularDeposit: number;

  public yieldPercent = 0.5;
  public minimumDeposit = 200;

  constructor() {
    this._dateStart = localStorageLoadDate(StorageKeys.DATE_START);
    this._initialDeposit = localStorageLoadNumber(StorageKeys.INITIAL_DEPOSIT) || this.minimumDeposit;
    this._regularDeposit = localStorageLoadNumber(StorageKeys.REGULAR_DEPOSIT_AMOUNT) || this.minimumDeposit;
  }

  public getDateStart(): Date {
    return this._dateStart;
  }

  public setDateStart(value: Date | string): void {
    if (value) {
      this._dateStart = new Date(value);
      localStorageSave(StorageKeys.DATE_START, this._dateStart);
    } else {
      this._dateStart = new Date();
      localStorageDelete(StorageKeys.DATE_START);
    }
  }

  public getInitialDeposit(): number {
    return this._initialDeposit;
  }

  public setInitialDeposit(value: number): void {
    this._initialDeposit = value ?? this.minimumDeposit;
    localStorageSave(StorageKeys.INITIAL_DEPOSIT, this._initialDeposit);
  }

  public getRegularDeposit(): number {
    return this._regularDeposit;
  }

  public setRegularDeposit(value: number): void {
    this._regularDeposit = value ?? this.minimumDeposit;
    localStorageSave(StorageKeys.REGULAR_DEPOSIT_AMOUNT, this._regularDeposit);
  }

  public getDailyYield(): number {
    return this.roundNumber(this._initialDeposit * (this.yieldPercent / 100));
  }

  public roundNumber(value: number, precision: number = 2): number {
    return round(value, precision);
  }


}
