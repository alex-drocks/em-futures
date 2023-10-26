import {EventEmitter, Injectable} from '@angular/core';
import {storeDelete, storeLoadDate, storeLoadNumber, storeLoadString, storeSave} from "../helpers/storage";
import * as dayjs from "dayjs";
import {
  CycleEnum,
  DailyRewardsPercent,
  IDailyData,
  StorageKeys,
  UserActionEnum
} from "../app.definitions";
import {round} from "../helpers/utils";

@Injectable({
  providedIn: 'root'
})
export class CalculatorService {
  public calculationEmitter: EventEmitter<void> = new EventEmitter();

  public DATE_FORMAT = "YY-MM-DD";
  public MIN_DEPOSIT = 200;
  public MAX_BALANCE = 1_000_000;
  public MAX_WITHDRAWAL = 2_500_000;
  public MAX_DAILY_WITHDRAWAL = 50_000;
  public MAX_YEARS_FORECAST = 10;

  public defaults = {
    dateStart: new Date(),
    initialDeposit: 1_500,
    regularDeposit: 200,
    depositCycle: CycleEnum.THREE_WEEKS,
    withdrawCycle: CycleEnum.WEEK,
    startWithdrawingBalance: 5_000,
    stopDepositingBalance: 1_000_000,
    yearsToForecast: 3,
  }

  private _dateStart: Date;
  private _initialDeposit: number;
  private _regularDeposit: number;
  private _depositCycle: CycleEnum;
  private _withdrawCycle: CycleEnum;
  private _startWithdrawingBalance: number;
  private _stopDepositingBalance: number;
  private _yearsToForecast: number;

  private _dailyData: IDailyData[];

  constructor() {
    this._dateStart = storeLoadDate(StorageKeys.DATE_START, this.defaults.dateStart);
    this._initialDeposit = storeLoadNumber(StorageKeys.INITIAL_DEPOSIT, this.defaults.initialDeposit);
    this._regularDeposit = storeLoadNumber(StorageKeys.REGULAR_DEPOSIT, this.defaults.regularDeposit);
    this._depositCycle = storeLoadString(StorageKeys.DEPOSIT_CYCLE, this.defaults.depositCycle) as CycleEnum;
    this._withdrawCycle = storeLoadString(StorageKeys.WITHDRAW_CYCLE, this.defaults.withdrawCycle) as CycleEnum;
    this._startWithdrawingBalance = storeLoadNumber(StorageKeys.START_WITHDRAWING_BALANCE, this.defaults.startWithdrawingBalance);
    this._stopDepositingBalance = storeLoadNumber(StorageKeys.STOP_DEPOSITING_BALANCE, this.defaults.stopDepositingBalance);
    this._yearsToForecast = storeLoadNumber(StorageKeys.YEARS_TO_FORECAST, this.defaults.yearsToForecast);
    this._dailyData = [];
  }

  public resetDefaults(): void {
    this._dateStart = this.defaults.dateStart;
    this._initialDeposit = this.defaults.initialDeposit;
    this._regularDeposit = this.defaults.regularDeposit
    this._depositCycle = this.defaults.depositCycle;
    this._withdrawCycle = this.defaults.withdrawCycle;
    this._startWithdrawingBalance = this.defaults.startWithdrawingBalance;
    this._stopDepositingBalance = this.defaults.stopDepositingBalance;
    this._yearsToForecast = this.defaults.yearsToForecast;
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

  public getDepositCycle(): CycleEnum {
    return this._depositCycle;
  }

  public getWithdrawCycle(): CycleEnum {
    return this._withdrawCycle;
  }

  public getStartWithdrawingBalance(): number {
    return this._startWithdrawingBalance;
  }

  public getStopDepositingBalance(): number {
    return this._stopDepositingBalance;
  }

  public getYearsToForecast(): number {
    return this._yearsToForecast;
  }

  public getDailyData(): IDailyData[] {
    return this._dailyData;
  }

  public setDateStart(value: Date | string): void {
    if (value) {
      this._dateStart = new Date(value);
      storeSave(StorageKeys.DATE_START, this._dateStart);
    } else {
      this._dateStart = this.defaults.dateStart;
      storeDelete(StorageKeys.DATE_START);
    }
  }

  public setInitialDeposit(value: number): void {
    this._initialDeposit = value ?? this.defaults.initialDeposit;
    if (this._initialDeposit < this.MIN_DEPOSIT) {
      this._initialDeposit = this.MIN_DEPOSIT;
    }
    if (this._initialDeposit > this.MAX_BALANCE) {
      this._initialDeposit = this.MAX_BALANCE;
    }
    storeSave(StorageKeys.INITIAL_DEPOSIT, this._initialDeposit);
  }

  public setRegularDeposit(value: number): void {
    this._regularDeposit = value ?? this.defaults.regularDeposit;
    if (this._regularDeposit < this.MIN_DEPOSIT) {
      this._regularDeposit = this.MIN_DEPOSIT;
    }
    if (this._regularDeposit > this.MAX_BALANCE) {
      this._regularDeposit = this.MAX_BALANCE;
    }
    storeSave(StorageKeys.REGULAR_DEPOSIT, this._regularDeposit);
  }

  public setDepositCycle(value: CycleEnum): void {
    this._depositCycle = value ?? this.defaults.depositCycle;
    storeSave(StorageKeys.DEPOSIT_CYCLE, this._depositCycle);
  }

  public setWithdrawCycle(value: CycleEnum): void {
    this._withdrawCycle = value ?? this.defaults.withdrawCycle;
    storeSave(StorageKeys.WITHDRAW_CYCLE, this._withdrawCycle);
  }

  public setStartWithdrawingBalance(value: number): void {
    this._startWithdrawingBalance = value ?? this.defaults.startWithdrawingBalance;
    if (this._startWithdrawingBalance < this.MIN_DEPOSIT) {
      this._startWithdrawingBalance = 200;
    }
    if (this._startWithdrawingBalance > this.MAX_BALANCE) {
      this._startWithdrawingBalance = this.MAX_BALANCE;
    }
    storeSave(StorageKeys.START_WITHDRAWING_BALANCE, this._startWithdrawingBalance);
  }

  public setStopDepositingBalance(value: number): void {
    this._stopDepositingBalance = value ?? this.defaults.stopDepositingBalance;
    if (this._stopDepositingBalance > this.MAX_BALANCE) {
      this._stopDepositingBalance = this.MAX_BALANCE;
    }
    if (this._stopDepositingBalance < this.MIN_DEPOSIT) {
      this._stopDepositingBalance = this.MIN_DEPOSIT;
    }
    storeSave(StorageKeys.STOP_DEPOSITING_BALANCE, this._stopDepositingBalance);
  }

  public setYearsToForecast(value: number): void {
    this._yearsToForecast = value ?? this.defaults.yearsToForecast;
    if (this._yearsToForecast > this.MAX_YEARS_FORECAST) {
      this._yearsToForecast = this.MAX_YEARS_FORECAST;
    }
    storeSave(StorageKeys.YEARS_TO_FORECAST, this._yearsToForecast);
  }

  public roundNumber(value: number, precision: number = 2): number {
    return round(value, precision);
  }

  public cycleEnumToDays(cycle: CycleEnum): number | null {
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
      case CycleEnum.NEVER:
      default:
        return null;
    }
  }

  public isWithdrawCycleDay(daysElapsed: number, prevDepositDay: number, prevWithdrawDay: number): boolean {
    if (!daysElapsed || (!prevDepositDay && !prevWithdrawDay)) {
      return false;
    }

    const withdrawCycle = this.getWithdrawCycle();
    const daysForCycle = this.cycleEnumToDays(withdrawCycle);
    if (daysForCycle === null) {
      return false;
    }

    const daysSinceLastAction = daysElapsed - (prevDepositDay || prevWithdrawDay);
    return daysSinceLastAction === daysForCycle;
  }

  public isDepositCycleDay(daysElapsed: number, prevDepositDay: number, prevWithdrawDay: number): boolean {
    if (!daysElapsed) {
      return false;
    }

    const depositCycle = this.getDepositCycle();
    const daysForCycle = this.cycleEnumToDays(depositCycle);
    if (daysForCycle === null) {
      return false;
    }

    const daysSinceLastAction = daysElapsed - (prevWithdrawDay || prevDepositDay);
    return daysSinceLastAction === daysForCycle;
  }

  public isMaxWithdrawalsReached(totalWithdrawals: number): boolean {
    return totalWithdrawals >= this.MAX_WITHDRAWAL
  }

  public isMaxBalanceReached(balance: number): boolean {
    return balance >= this.MAX_BALANCE;
  }

  public postWithdrawalExceedsMax(totalWithdrawals: number, rewardsAvailableToWithdraw: number): boolean {
    const postWithdrawalSum = totalWithdrawals + rewardsAvailableToWithdraw;
    return this.isMaxWithdrawalsReached(postWithdrawalSum)
  }

  public postDepositExceedsMaxBalance(balance: number, rewardsAvailableToCompound: number): boolean {
    const postDepositSum = balance + rewardsAvailableToCompound + this.getRegularDeposit();
    return this.isMaxBalanceReached(postDepositSum);
  }

  public isStopDepositBalanceReached(balance: number): boolean {
    return balance >= this.getStopDepositingBalance();
  }

  public isStartWithdrawingBalanceReached(balance: number): boolean {
    return balance >= this.getStartWithdrawingBalance();
  }

  public canDeposit(balance: number, rewardsAvailableToCompound: number): boolean {
    const isLowerBalanceThanUserLimit = !this.isStopDepositBalanceReached(balance);
    const isLowerBalanceThanSystemLimit = !this.isMaxBalanceReached(balance);
    const isLowerPostDepositThanSystemLimit = !this.postDepositExceedsMaxBalance(balance, rewardsAvailableToCompound);
    return isLowerBalanceThanUserLimit && isLowerBalanceThanSystemLimit && isLowerPostDepositThanSystemLimit;
  }

  public canWithdraw(balance: number, totalWithdrawals: number, rewardsAvailableToWithdraw: number) {
    const isHigherBalanceThanUserMinimum = this.isStartWithdrawingBalanceReached(balance);
    const isLowerWithdrawalsThanSystemLimit = !this.isMaxWithdrawalsReached(totalWithdrawals);
    const isLowerPostWithdrawalsThanSystemLimit = !this.postWithdrawalExceedsMax(totalWithdrawals, rewardsAvailableToWithdraw);
    return isHigherBalanceThanUserMinimum && isLowerWithdrawalsThanSystemLimit && isLowerPostWithdrawalsThanSystemLimit;
  }

  public getDailyRewardsPercent(totalCompoundedRewards: number, totalDeposited: number): DailyRewardsPercent {
    const compoundedSpread = totalCompoundedRewards - totalDeposited;
    if (compoundedSpread >= 50_000 && compoundedSpread <= 249_999) {
      return DailyRewardsPercent.PERCENT_0_450;
    } else if (compoundedSpread >= 250_000 && compoundedSpread <= 499_999) {
      return DailyRewardsPercent.PERCENT_0_425;
    } else if (compoundedSpread >= 500_000 && compoundedSpread <= 749_999) {
      return DailyRewardsPercent.PERCENT_0_375;
    } else if (compoundedSpread >= 750_000 && compoundedSpread <= 999_999) {
      return DailyRewardsPercent.PERCENT_0_325;
    } else if (compoundedSpread >= 1_000_000) {
      return DailyRewardsPercent.PERCENT_0_250;
    } else {
      return DailyRewardsPercent.PERCENT_0_500;
    }
  }

  public getDailyRewardsRate(dailyPercent: DailyRewardsPercent): number {
    return dailyPercent / 100;
  }

  public getTotalUnlocked(balance: number, totalUnlocked: number, dailyUnlocked: number): number {
    let newTotalUnlocked = totalUnlocked + dailyUnlocked;
    if (newTotalUnlocked > this.MAX_DAILY_WITHDRAWAL || newTotalUnlocked > balance) {
      newTotalUnlocked = this.MAX_DAILY_WITHDRAWAL;
    }
    return newTotalUnlocked;
  }

  public calculateDailyData(): void {
    console.time("calculate");

    this._dailyData = [];

    const dateStart = this.getDateStart();
    const daysToCalculate = 365 * this.getYearsToForecast();
    const total = {
      daysElapsed: 0,
      balance: 0,
      rewardsAvailable: 0,
      withdrawals: 0,
      rewards: 0,
      deposits: this.getInitialDeposit(),
    }
    let prevDepositDay: number = 0;
    let prevWithdrawDay: number = 0;

    for (let index = 0; index < daysToCalculate; index++) {
      total.daysElapsed = index;

      const date = dayjs(dateStart).add(total.daysElapsed, "day");
      const dailyRewardsPercent: DailyRewardsPercent = this.getDailyRewardsPercent(total.rewards, total.deposits);
      const dailyRate = this.getDailyRewardsRate(dailyRewardsPercent);
      const currentBalance = total.balance;

      let userAction: UserActionEnum = UserActionEnum.HOLD;
      let rewardsToday = 0;
      let rewardsAvailable = 0;
      let depositedToday = 0;
      let compoundedToday = 0;
      let withdrawnToday = 0;

      if (total.daysElapsed === 0) {
        depositedToday = total.deposits;
        total.balance = depositedToday;
        userAction = UserActionEnum.INIT;
      } else {
        rewardsToday = currentBalance * dailyRate;
        total.rewardsAvailable = this.getTotalUnlocked(currentBalance, total.rewardsAvailable, rewardsToday);
        rewardsAvailable = total.rewardsAvailable;
      }

      const canWithdraw = this.canWithdraw(currentBalance, total.withdrawals, rewardsAvailable);
      const isWithdrawCycleDay = this.isWithdrawCycleDay(total.daysElapsed, prevDepositDay, prevWithdrawDay);
      const shouldWithdraw = canWithdraw && isWithdrawCycleDay;
      if (shouldWithdraw) {
        userAction = UserActionEnum.WITHDRAW;
        withdrawnToday = rewardsAvailable;
        total.rewardsAvailable = 0;
        total.balance -= withdrawnToday;
        total.withdrawals += withdrawnToday;
        prevWithdrawDay = total.daysElapsed;
      }

      const canDeposit = this.canDeposit(currentBalance, rewardsAvailable);
      const isDepositCycleDay = this.isDepositCycleDay(total.daysElapsed, prevDepositDay, prevWithdrawDay);
      const shouldDeposit = canDeposit && isDepositCycleDay;
      if (shouldDeposit && !shouldWithdraw) {
        userAction = UserActionEnum.DEPOSIT;
        depositedToday = this.getRegularDeposit();
        compoundedToday = rewardsAvailable;
        total.rewardsAvailable = 0;
        total.balance += depositedToday + compoundedToday;
        total.deposits += depositedToday;
        total.rewards += compoundedToday;
        prevDepositDay = total.daysElapsed
      }

      this._dailyData.push({
        date: date.format(this.DATE_FORMAT),
        balance: this.roundNumber(currentBalance),
        rewardsPercent: dailyRewardsPercent,
        rewardsUnlockedToday: this.roundNumber(rewardsToday),
        rewardsAvailable: this.roundNumber(rewardsAvailable),
        totalDeposited: this.roundNumber(total.deposits),
        totalCompounded: this.roundNumber(total.rewards),
        totalWithdrawn: this.roundNumber(total.withdrawals),
        totalRewardsAvailable: this.roundNumber(total.rewardsAvailable),
        actionMade: userAction,
        depositedToday: this.roundNumber(depositedToday),
        compoundedToday: this.roundNumber(compoundedToday),
        withdrawnToday: this.roundNumber(withdrawnToday),
        balanceDifference: this.roundNumber(depositedToday + compoundedToday - withdrawnToday),
        newBalance: this.roundNumber(total.balance),
      });
    }

    this.calculationEmitter.emit();
    console.timeEnd("calculate");
  }

}
