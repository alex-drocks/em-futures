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
    initialDeposit: 1_000,
    regularDeposit: 200,
    depositCycle: "TWO_WEEKS",
    withdrawCycle: "WEEK",
    startWithdrawingBalance: 50_000,
    stopDepositingBalance: 1_000_000,
    yearsToForecast: 1,
  }

  private _dateStart: Date;
  private _initialDeposit: number;
  private _regularDeposit: number;
  private _depositCycle: keyof typeof CycleEnum;
  private _withdrawCycle: keyof typeof CycleEnum;
  private _startWithdrawingBalance: number;
  private _stopDepositingBalance: number;
  private _yearsToForecast: number;

  private _dailyData: IDailyData[];

  constructor() {
    this._dateStart = storeLoadDate(StorageKeys.DATE_START, this.defaults.dateStart);
    this._initialDeposit = storeLoadNumber(StorageKeys.INITIAL_DEPOSIT, this.defaults.initialDeposit);
    this._regularDeposit = storeLoadNumber(StorageKeys.REGULAR_DEPOSIT, this.defaults.regularDeposit);
    this._depositCycle = storeLoadString(StorageKeys.DEPOSIT_CYCLE, this.defaults.depositCycle) as keyof typeof CycleEnum;
    this._withdrawCycle = storeLoadString(StorageKeys.WITHDRAW_CYCLE, this.defaults.withdrawCycle) as keyof typeof CycleEnum;
    this._startWithdrawingBalance = storeLoadNumber(StorageKeys.START_WITHDRAWING_BALANCE, this.defaults.startWithdrawingBalance);
    this._stopDepositingBalance = storeLoadNumber(StorageKeys.STOP_DEPOSITING_BALANCE, this.defaults.stopDepositingBalance);
    this._yearsToForecast = storeLoadNumber(StorageKeys.YEARS_TO_FORECAST, this.defaults.yearsToForecast);
    this._dailyData = [];
  }

  public resetDefaults(): void {
    this._dateStart = this.defaults.dateStart;
    this._initialDeposit = this.defaults.initialDeposit;
    this._regularDeposit = this.defaults.regularDeposit
    this._depositCycle = this.defaults.depositCycle as keyof typeof CycleEnum;
    this._withdrawCycle = this.defaults.withdrawCycle as keyof typeof CycleEnum;
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

  public getDepositCycle(): keyof typeof CycleEnum {
    return this._depositCycle;
  }

  public getWithdrawCycle(): keyof typeof CycleEnum {
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
    storeSave(StorageKeys.REGULAR_DEPOSIT, this._regularDeposit);
  }

  public setDepositCycle(value: keyof typeof CycleEnum): void {
    this._depositCycle = value ?? "TWO_WEEKS";
    storeSave(StorageKeys.DEPOSIT_CYCLE, this._depositCycle);
  }

  public setWithdrawCycle(value: keyof typeof CycleEnum): void {
    this._withdrawCycle = value ?? "WEEK";
    storeSave(StorageKeys.WITHDRAW_CYCLE, this._withdrawCycle);
  }

  public setStartWithdrawingBalance(value: number): void {
    this._startWithdrawingBalance = value ?? 20_000;
    if (this._startWithdrawingBalance < this.MIN_DEPOSIT) {
      this._startWithdrawingBalance = 200;
    }
    if (this._startWithdrawingBalance > this.MAX_BALANCE) {
      this._startWithdrawingBalance = this.MAX_BALANCE;
    }
    storeSave(StorageKeys.START_WITHDRAWING_BALANCE, this._startWithdrawingBalance);
  }

  public setStopDepositingBalance(value: number): void {
    this._stopDepositingBalance = value ?? 1_000_000;
    if (this._stopDepositingBalance > this.MAX_BALANCE) {
      this._stopDepositingBalance = this.MAX_BALANCE;
    }
    if (this._stopDepositingBalance < this.MIN_DEPOSIT) {
      this._stopDepositingBalance = this.MIN_DEPOSIT;
    }
    storeSave(StorageKeys.STOP_DEPOSITING_BALANCE, this._stopDepositingBalance);
  }

  public setYearsToForecast(value: number): void {
    this._yearsToForecast = value ?? 1;
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
        return null;
      default:
        return 0;
    }
  }

  public exceedsMaxWithdrawals(totalWithdrawals: number, rewards: number): boolean {
    if (totalWithdrawals > this.MAX_WITHDRAWAL) {
      return true;
    }
    const forecastedWithdrawals = totalWithdrawals + rewards;
    return forecastedWithdrawals > this.MAX_WITHDRAWAL;
  }

  public exceedsMaxBalance(balance: number, rewards: number): boolean {
    if (balance > this.MAX_BALANCE) {
      return true;
    }
    const forecastedBalance = balance + this.getRegularDeposit() + rewards;
    return forecastedBalance > this.MAX_BALANCE;
  }

  public isCycleDay(daysElapsed: number, cycle: keyof typeof CycleEnum): boolean {
    const daysForCycle = this.cycleEnumToDays(CycleEnum[cycle]);
    if (daysForCycle === null) {
      return false;
    }
    return daysElapsed % daysForCycle === 0;
  }

  public shouldWithdraw(balance: number, daysElapsed: number, totalWithdrawals: number, rewards: number): boolean {
    if (balance < this.getStartWithdrawingBalance() || this.exceedsMaxWithdrawals(totalWithdrawals, rewards)) {
      return false;
    }
    const withdrawCycle = this.getWithdrawCycle();
    return this.isCycleDay(daysElapsed, withdrawCycle);
  }

  public shouldDeposit(balance: number, daysElapsed: number, rewards: number): boolean {
    if (daysElapsed <= 0 || balance >= this.getStopDepositingBalance() || this.exceedsMaxBalance(balance, rewards)) {
      return false;
    }
    const depositCycle = this.getDepositCycle();
    return this.isCycleDay(daysElapsed, depositCycle);
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

  public getDailyUnlocked(balance: number, dailyRate: number): number {
    return balance * dailyRate;
  }

  public getTotalUnlocked(balance: number, totalUnlocked: number, dailyUnlocked: number): number {
    let newTotalUnlocked = totalUnlocked + dailyUnlocked;
    if (newTotalUnlocked > this.MAX_DAILY_WITHDRAWAL || newTotalUnlocked > balance) {
      newTotalUnlocked = this.MAX_DAILY_WITHDRAWAL;
    }
    return newTotalUnlocked;
  }

  public calculateDailyData(): void {
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

      const shouldWithdraw = this.shouldWithdraw(currentBalance, total.daysElapsed, total.withdrawals, rewardsAvailable);
      if (shouldWithdraw) {
        userAction = UserActionEnum.WITHDRAW;
        withdrawnToday = rewardsAvailable;
        total.rewardsAvailable = 0;
        total.balance -= withdrawnToday;
        total.withdrawals += withdrawnToday;
      }

      const shouldDeposit = this.shouldDeposit(currentBalance, total.daysElapsed, rewardsAvailable);
      if (!shouldWithdraw && shouldDeposit) {
        userAction = UserActionEnum.DEPOSIT;
        depositedToday = this.getRegularDeposit();
        compoundedToday = rewardsAvailable;
        total.rewardsAvailable = 0;
        total.balance += depositedToday + compoundedToday;
        total.deposits += depositedToday;
        total.rewards += compoundedToday;
      }

      this._dailyData.push({
        date: date.format(this.DATE_FORMAT),
        balance: this.roundNumber(currentBalance),
        rewardsPercent: dailyRewardsPercent,
        rewardsToday: this.roundNumber(rewardsToday),
        rewardsAvailable: this.roundNumber(rewardsAvailable),
        totalDeposited: this.roundNumber(total.deposits),
        totalCompounded: this.roundNumber(total.rewards),
        totalWithdrawn: this.roundNumber(total.withdrawals),
        actionMade: userAction,
        depositedToday: this.roundNumber(depositedToday),
        compoundedToday: this.roundNumber(compoundedToday),
        withdrawnToday: this.roundNumber(withdrawnToday),
        balanceDifference: this.roundNumber(depositedToday + compoundedToday - withdrawnToday),
        newBalance: this.roundNumber(total.balance),
      });

      this.calculationEmitter.emit();
    }
  }

}
