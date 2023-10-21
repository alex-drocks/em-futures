import {Injectable} from '@angular/core';
import {round} from "../helpers/utils";
import {storeDelete, storeLoadDate, storeLoadNumber, storeLoadString, storeSave} from "../helpers/storage";
import {ClaimCycleEnum, DepositCycleEnum} from "../components/form/form.definitions";
import * as dayjs from "dayjs";

export enum StorageKeys {
  INITIAL_DEPOSIT = "INITIAL_DEPOSIT",
  DATE_START = "DATE_START",
  REGULAR_DEPOSIT_AMOUNT = "REGULAR_DEPOSIT_AMOUNT",
  DEPOSIT_CYCLE = "DEPOSIT_CYCLE",
  CLAIM_CYCLE = "CLAIM_CYCLE",
  START_CLAIM_AMOUNT = "START_CLAIM_AMOUNT",
}

export enum DailyYieldPercent {
  PERCENT_0_500 = 0.5,
  PERCENT_0_450 = 0.45,
  PERCENT_0_425 = 0.425,
  PERCENT_0_375 = 0.375,
  PERCENT_0_325 = 0.325,
  PERCENT_0_250 = 0.25,
}

export enum UserActionEnum {
  INIT = "First Deposit",
  HOLD = "Hold",
  DEPOSIT = "Deposit",
  WITHDRAW = "Withdraw",
}

export interface IDailyData {
  date: string;
  balance: number;
  dailyPercent: DailyYieldPercent;
  dailyUnlocked: number;
  totalUnlocked: number;
  totalDeposited: number;
  totalClaimed: number;
  totalCompounded: number;
  actionMade: UserActionEnum;
  depositedToday: number;
  compoundedToday: number;
  claimedToday: number;
  balanceDifference: string;
  newBalance: number;
}

@Injectable({
  providedIn: 'root'
})
export class CalculatorService {
  private _dateStart: Date;
  private _initialDeposit: number;
  private _regularDeposit: number;
  private _depositCycle: keyof typeof DepositCycleEnum;
  private _claimCycle: keyof typeof ClaimCycleEnum;
  private _startClaimAmount: number;

  private _dailyData: IDailyData[];

  public minimumDeposit = 200;

  constructor() {
    this._dateStart = storeLoadDate(StorageKeys.DATE_START);
    this._initialDeposit = storeLoadNumber(StorageKeys.INITIAL_DEPOSIT, this.minimumDeposit);
    this._regularDeposit = storeLoadNumber(StorageKeys.REGULAR_DEPOSIT_AMOUNT, this.minimumDeposit);
    this._depositCycle = storeLoadString(StorageKeys.DEPOSIT_CYCLE, "TWO_WEEKS") as keyof typeof DepositCycleEnum;
    this._claimCycle = storeLoadString(StorageKeys.CLAIM_CYCLE, "WEEK") as keyof typeof ClaimCycleEnum;
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

  public getDepositCycle(): keyof typeof DepositCycleEnum {
    return this._depositCycle;
  }

  public getClaimCycle(): keyof typeof ClaimCycleEnum {
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

  public setDepositCycle(value: keyof typeof DepositCycleEnum): void {
    this._depositCycle = value ?? "TWO_WEEKS";
    storeSave(StorageKeys.DEPOSIT_CYCLE, this._depositCycle);
  }

  public setClaimCycle(value: keyof typeof ClaimCycleEnum): void {
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

  public depositCycleToDays(cycle: DepositCycleEnum): number {
    switch (cycle) {
      case DepositCycleEnum.DAY:
        return 1;
      case DepositCycleEnum.TWO_DAY:
        return 2;
      case DepositCycleEnum.THREE_DAYS:
        return 3;
      case DepositCycleEnum.FIVE_DAYS:
        return 5;
      case DepositCycleEnum.WEEK:
        return 7;
      case DepositCycleEnum.TWO_WEEKS:
        return 14;
      case DepositCycleEnum.THREE_WEEKS:
        return 21;
      case DepositCycleEnum.MONTH:
        return 30; // Considered a month as 30 days
      case DepositCycleEnum.TWO_MONTHS:
        return 60;
      case DepositCycleEnum.QUARTER:
        return 90; // Considered a quarter as 90 days
      default:
        return 0;
    }
  }

  public claimCycleToDays(cycle: ClaimCycleEnum): number {
    switch (cycle) {
      case ClaimCycleEnum.DAY:
        return 1;
      case ClaimCycleEnum.TWO_DAY:
        return 2;
      case ClaimCycleEnum.THREE_DAYS:
        return 3;
      case ClaimCycleEnum.FIVE_DAYS:
        return 5;
      case ClaimCycleEnum.WEEK:
        return 7;
      case ClaimCycleEnum.TWO_WEEKS:
        return 14;
      case ClaimCycleEnum.THREE_WEEKS:
        return 21;
      case ClaimCycleEnum.MONTH:
        return 30; // Considering a month as 30 days for simplicity
      case ClaimCycleEnum.TWO_MONTHS:
        return 60;
      case ClaimCycleEnum.QUARTER:
        return 90; // Considering a quarter as 90 days for simplicity
      default:
        return 0;
    }
  }

  public evaluateShouldDeposit(currentBalance: number, daysElapsedSinceStart: number): boolean {
    if (daysElapsedSinceStart <= 0) {
      return false;
    }

    const cycle = this.getDepositCycle();
    const daysForCycle = this.depositCycleToDays(DepositCycleEnum[cycle]);

    // Check if the remainder when dividing by the number of days for the cycle is 0
    return daysElapsedSinceStart % daysForCycle === 0;
  }


  public evaluateShouldClaim(currentBalance: number, daysElapsedSinceStart: number): boolean {
    const minBalanceToStartClaiming = this.getStartClaimAmount();
    if (currentBalance >= minBalanceToStartClaiming) {
      const cycle = this.getClaimCycle();
      const daysForCycle = this.claimCycleToDays(ClaimCycleEnum[cycle]);
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
      balance: this.getInitialDeposit(),
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

      const shouldDepositToday = this.evaluateShouldDeposit(currentBalance, total.daysElapsed);
      if (!shouldClaimToday && shouldDepositToday) {
        userAction = UserActionEnum.DEPOSIT;
        depositedToday = regularDepositAmount;
        compoundedToday = totalUnlocked;
        total.available = 0;
        total.balance += depositedToday + compoundedToday;
        total.deposited += depositedToday;
        total.compounded += compoundedToday;
      }

      const balanceDiff = this.roundNumber(depositedToday + compoundedToday - claimedToday)

      this._dailyData.push({
        date: date.format("YY-MM-DD"),
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
        balanceDifference: balanceDiff >= 0 ? `+$${balanceDiff}` : `-$${Math.abs(balanceDiff)}`,
        newBalance: this.roundNumber(total.balance),
      });

    }

  }

}
