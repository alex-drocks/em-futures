import {Injectable} from '@angular/core';
import {storeDelete, storeLoadDate, storeLoadNumber, storeLoadString, storeSave} from "../helpers/storage";
import * as dayjs from "dayjs";
import {
  CycleEnum,
  DailyYieldPercent,
  IDailyData,
  StorageKeys,
  UserActionEnum
} from "./calculator.definitions";
import {round} from "../helpers/utils";

@Injectable({
  providedIn: 'root'
})
export class CalculatorService {
  public DATE_FORMAT = "YY-MM-DD";
  public MIN_DEPOSIT = 200;
  public MAX_BALANCE = 1000000;
  public MAX_WITHDRAWAL = 2500000;

  private _dateStart: Date;
  private _initialDeposit: number;
  private _regularDeposit: number;
  private _depositCycle: keyof typeof CycleEnum;
  private _claimCycle: keyof typeof CycleEnum;
  private _startClaimAmount: number;
  private _stopDepositAmount: number;

  private _dailyData: IDailyData[];

  constructor() {
    this._dateStart = storeLoadDate(StorageKeys.DATE_START);
    this._initialDeposit = storeLoadNumber(StorageKeys.INITIAL_DEPOSIT, this.MIN_DEPOSIT);
    this._regularDeposit = storeLoadNumber(StorageKeys.REGULAR_DEPOSIT_AMOUNT, this.MIN_DEPOSIT);
    this._depositCycle = storeLoadString(StorageKeys.DEPOSIT_CYCLE, "TWO_WEEKS") as keyof typeof CycleEnum;
    this._claimCycle = storeLoadString(StorageKeys.CLAIM_CYCLE, "WEEK") as keyof typeof CycleEnum;
    this._startClaimAmount = storeLoadNumber(StorageKeys.START_CLAIM_AMOUNT, 20000);
    this._stopDepositAmount = storeLoadNumber(StorageKeys.STOP_DEPOSIT_AMOUNT, 1000000);
    this._dailyData = [];
  }

  public getDateStart(): Date {
    return this._dateStart;
  }

  public getInitialDeposit(): number {
    return this._initialDeposit;
  }

  public getRegularDeposit(): number {
    return this._regularDeposit;
  }

  public getDepositCycle(): keyof typeof CycleEnum {
    return this._depositCycle;
  }

  public getClaimCycle(): keyof typeof CycleEnum {
    return this._claimCycle;
  }

  public getStartClaimAmount(): number {
    return this._startClaimAmount;
  }

  public getStopDepositAmount(): number {
    return this._stopDepositAmount;
  }

  public getDailyData(): IDailyData[] {
    return this._dailyData;
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

  public setInitialDeposit(value: number): void {
    this._initialDeposit = value ?? this.MIN_DEPOSIT;
    if (this._initialDeposit < this.MIN_DEPOSIT) {
      this._initialDeposit = this.MIN_DEPOSIT;
    }
    if (this._initialDeposit > this.MAX_BALANCE) {
      this._initialDeposit = this.MAX_BALANCE;
    }
    storeSave(StorageKeys.INITIAL_DEPOSIT, this._initialDeposit);
  }

  public setRegularDeposit(value: number): void {
    this._regularDeposit = value ?? this.MIN_DEPOSIT;
    if (this._regularDeposit < this.MIN_DEPOSIT) {
      this._regularDeposit = this.MIN_DEPOSIT;
    }
    if (this._regularDeposit > this.MAX_BALANCE) {
      this._regularDeposit = this.MAX_BALANCE;
    }
    storeSave(StorageKeys.REGULAR_DEPOSIT_AMOUNT, this._regularDeposit);
  }

  public setDepositCycle(value: keyof typeof CycleEnum): void {
    this._depositCycle = value ?? "TWO_WEEKS";
    storeSave(StorageKeys.DEPOSIT_CYCLE, this._depositCycle);
  }

  public setClaimCycle(value: keyof typeof CycleEnum): void {
    this._claimCycle = value ?? "WEEK";
    storeSave(StorageKeys.CLAIM_CYCLE, this._claimCycle);
  }

  public setStartClaimAmount(value: number): void {
    this._startClaimAmount = value ?? 20000;
    if (this._startClaimAmount < this.MIN_DEPOSIT) {
      this._startClaimAmount = 200;
    }
    if (this._startClaimAmount > this.MAX_BALANCE) {
      this._startClaimAmount = this.MAX_BALANCE;
    }
    storeSave(StorageKeys.START_CLAIM_AMOUNT, this._startClaimAmount);
  }

  public setStopDepositAmount(value: number): void {
    this._stopDepositAmount = value ?? 1000000;
    if (this._stopDepositAmount > this.MAX_BALANCE) {
      this._stopDepositAmount = this.MAX_BALANCE;
    }
    if (this._stopDepositAmount < this.MIN_DEPOSIT) {
      this._stopDepositAmount = this.MIN_DEPOSIT;
    }
    storeSave(StorageKeys.STOP_DEPOSIT_AMOUNT, this._stopDepositAmount);
  }

  public roundNumber(value: number, precision: number = 2): number {
    return round(value, precision);
  }

  public cycleEnumToDays(cycle: CycleEnum): number {
    switch (cycle) {
      case CycleEnum.DAY:
        return 1;
      case CycleEnum.TWO_DAY:
        return 2;
      case CycleEnum.THREE_DAYS:
        return 3;
      case CycleEnum.FIVE_DAYS:
        return 5;
      case CycleEnum.WEEK:
        return 7;
      case CycleEnum.TWO_WEEKS:
        return 14;
      case CycleEnum.THREE_WEEKS:
        return 21;
      case CycleEnum.MONTH:
        return 30;
      case CycleEnum.TWO_MONTHS:
        return 60;
      case CycleEnum.THREE_MONTHS:
        return 90;
      default:
        return 0;
    }
  }

  public evaluateShouldDeposit(balance: number, daysElapsedSinceStart: number, depositedToday: number, compoundedToday: number): boolean {
    if (daysElapsedSinceStart <= 0 || balance >= this.MAX_BALANCE || balance >= this.getStopDepositAmount()) {
      return false;
    }

    if (balance + depositedToday + compoundedToday >= this.MAX_BALANCE) {
      return false;
    }

    const cycle = this.getDepositCycle();
    const daysForCycle = this.cycleEnumToDays(CycleEnum[cycle]);

    // Check if the remainder when dividing by the number of days for the cycle is 0
    return daysElapsedSinceStart % daysForCycle === 0;
  }


  public evaluateShouldClaim(balance: number, daysElapsedSinceStart: number): boolean {
    const minBalanceToStartClaiming = this.getStartClaimAmount();
    if (balance >= minBalanceToStartClaiming) {
      const cycle = this.getClaimCycle();
      const daysForCycle = this.cycleEnumToDays(CycleEnum[cycle]);
      // Check if the remainder when dividing by the number of days for the cycle is 0
      return daysElapsedSinceStart % daysForCycle === 0;
    }
    return false;
  }

  public getDailyYieldPercent(totalCompoundedRewards: number, totalDeposited: number): DailyYieldPercent {
    const compoundedSpread = totalCompoundedRewards - totalDeposited;
    if (compoundedSpread >= 50000 && compoundedSpread <= 249999) {
      return DailyYieldPercent.PERCENT_0_450;
    } else if (compoundedSpread >= 250000 && compoundedSpread <= 499999) {
      return DailyYieldPercent.PERCENT_0_425;
    } else if (compoundedSpread >= 500000 && compoundedSpread <= 749999) {
      return DailyYieldPercent.PERCENT_0_375;
    } else if (compoundedSpread >= 750000 && compoundedSpread <= 999999) {
      return DailyYieldPercent.PERCENT_0_325;
    } else if (compoundedSpread >= 1000000) {
      return DailyYieldPercent.PERCENT_0_250;
    } else {
      return DailyYieldPercent.PERCENT_0_500;
    }
  }

  public calculateDailyData(): void {
    this._dailyData = [];

    const dateStart = this.getDateStart();
    const regularDepositAmount = this.getRegularDeposit();
    const daysToCalculate = 100

    const total = {
      daysElapsed: 0,
      balance: 0,
      available: 0,
      claimed: 0,
      deposited: this.getInitialDeposit(),
      compounded: 0,
    }

    for (let index = 0; index < daysToCalculate; index++) {
      total.daysElapsed = index; // starts at 0 because interest has not accrued yet

      const date = dayjs(dateStart).add(total.daysElapsed, "day");
      const dailyPercent: DailyYieldPercent = this.getDailyYieldPercent(total.compounded, total.deposited);
      const dailyRate = dailyPercent / 100;
      const currentBalance = total.balance;

      let userAction: UserActionEnum = UserActionEnum.HOLD;
      let dailyUnlocked = 0;
      let depositedToday = 0;
      let compoundedToday = 0;
      let claimedToday = 0;
      let totalUnlocked = 0;

      if (total.daysElapsed === 0) {
        depositedToday = total.deposited;
        total.balance = depositedToday;
        userAction = UserActionEnum.INIT;
      } else {
        dailyUnlocked = currentBalance * dailyRate;
        total.available += dailyUnlocked;
        totalUnlocked = total.available;
      }

      const shouldClaimToday = this.evaluateShouldClaim(currentBalance, total.daysElapsed);
      if (shouldClaimToday) {
        userAction = UserActionEnum.WITHDRAW;
        claimedToday = totalUnlocked;
        total.available = 0;
        total.balance -= claimedToday;
        total.claimed += claimedToday;
      }

      const shouldDepositToday = this.evaluateShouldDeposit(currentBalance, total.daysElapsed, regularDepositAmount, totalUnlocked);
      if (!shouldClaimToday && shouldDepositToday) {
        userAction = UserActionEnum.DEPOSIT;
        depositedToday = regularDepositAmount;
        compoundedToday = totalUnlocked;
        total.available = 0;
        total.balance += depositedToday + compoundedToday;
        total.deposited += depositedToday;
        total.compounded += compoundedToday;
      }

      this._dailyData.push({
        date: date.format(this.DATE_FORMAT),
        balance: this.roundNumber(currentBalance),
        dailyPercent: dailyPercent,
        dailyUnlocked: this.roundNumber(dailyUnlocked),
        totalDeposited: this.roundNumber(total.deposited),
        totalCompounded: this.roundNumber(total.compounded),
        totalClaimed: this.roundNumber(total.claimed),
        totalUnlocked: this.roundNumber(totalUnlocked),
        actionMade: userAction,
        depositedToday: this.roundNumber(depositedToday),
        compoundedToday: this.roundNumber(compoundedToday),
        claimedToday: this.roundNumber(claimedToday),
        balanceDifference: this.roundNumber(depositedToday + compoundedToday - claimedToday),
        newBalance: this.roundNumber(total.balance),
      });
    }
  }

}
