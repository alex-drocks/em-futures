// https://bscscan.com/address/0x5B24f7645eec47EDd997bF8faDF3E340518af11B#code
import {EventEmitter, Injectable} from '@angular/core';
import {storeDelete, storeLoadDate, storeLoadNumber, storeLoadString, storeSave} from "../helpers/storage";
import * as dayjs from "dayjs";
import {
  CycleEnum,
  CycleEnumDayValues,
  DailyYieldPercent,
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

  public DATE_FORMAT = "YYYY-MM-DD";
  public BASE_YIELD = DailyYieldPercent.PERCENT_0_500;
  public MIN_DEPOSIT = 200;
  public MAX_BALANCE = 1_000_000;
  public MAX_PAYOUTS = 2_500_000;
  public MAX_DAILY_WITHDRAWAL = 50_000;
  public MAX_YEARS_FORECAST = 10;

  public defaults = {
    dateStart: new Date(),
    initialDeposit: 5_000,
    regularDeposit: 200,
    depositCycle: CycleEnum.THREE_WEEKS,
    withdrawCycle: CycleEnum.FIVE_DAYS,
    startWithdrawingBalance: 75_000,
    yearsToForecast: 4,
  }

  private _dateStart: Date = this.defaults.dateStart;
  private _initialDeposit: number = this.defaults.initialDeposit;
  private _regularDeposit: number = this.defaults.regularDeposit;
  private _depositCycle: CycleEnum = this.defaults.depositCycle;
  private _withdrawCycle: CycleEnum = this.defaults.withdrawCycle;
  private _startWithdrawingBalance: number = this.defaults.startWithdrawingBalance;
  private _yearsToForecast: number = this.defaults.yearsToForecast;
  private _dailyData: IDailyData[] = [];

  constructor() {
  }

  public loadInitialState(): void {
    this._dateStart = storeLoadDate(StorageKeys.DATE_START, this.defaults.dateStart);
    this._initialDeposit = storeLoadNumber(StorageKeys.INITIAL_DEPOSIT, this.defaults.initialDeposit);
    this._regularDeposit = storeLoadNumber(StorageKeys.REGULAR_DEPOSIT, this.defaults.regularDeposit);
    this._depositCycle = storeLoadString(StorageKeys.DEPOSIT_CYCLE, this.defaults.depositCycle) as CycleEnum;
    this._withdrawCycle = storeLoadString(StorageKeys.WITHDRAW_CYCLE, this.defaults.withdrawCycle) as CycleEnum;
    this._startWithdrawingBalance = storeLoadNumber(StorageKeys.START_WITHDRAWING_BALANCE, this.defaults.startWithdrawingBalance);
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

  public cycleEnumToDays(cycle: CycleEnum): number {
    return CycleEnumDayValues[cycle];
  }

  public isMaxPayouts(totalPayouts: number): boolean {
    return totalPayouts >= this.MAX_PAYOUTS;
  }

  public isMaxBalance(balance: number): boolean {
    return balance >= this.MAX_BALANCE;
  }

  public isStartWithdrawingBalance(balance: number): boolean {
    return balance >= this.getStartWithdrawingBalance();
  }

  public getDailyYieldPercent(totalCompounds: number, totalDeposits: number): DailyYieldPercent {
    const compoundSurplus = totalCompounds - totalDeposits;
    if (compoundSurplus < 50_000) {
      return DailyYieldPercent.PERCENT_0_500;
    } else if (compoundSurplus >= 50_000 && compoundSurplus < 250_000) {
      return DailyYieldPercent.PERCENT_0_450;
    } else if (compoundSurplus >= 250_000 && compoundSurplus < 500_000) {
      return DailyYieldPercent.PERCENT_0_425;
    } else if (compoundSurplus >= 500_000 && compoundSurplus < 750_000) {
      return DailyYieldPercent.PERCENT_0_375;
    } else if (compoundSurplus >= 750_000 && compoundSurplus < 1_000_000) {
      return DailyYieldPercent.PERCENT_0_325;
    } else if (compoundSurplus >= 1_000_000) {
      return DailyYieldPercent.PERCENT_0_250;
    }
    throw new Error("Unhandled value of compoundSurplus");
  }

  public getDailyYieldRate(dailyPercent: DailyYieldPercent): number {
    return dailyPercent / 100;
  }

  public getUnlockedToday(balance: number, dailyYieldRate: number): number {
    return balance * dailyYieldRate;
  }

  public getTotalAvailableToday(balance: number, available: number, dailyUnlocked: number): number {
    return Math.min(balance, available + dailyUnlocked, this.MAX_DAILY_WITHDRAWAL);
  }

  public calculateDailyData(): void {
    console.time("calculate");

    this._dailyData = [];

    const dateStart = this.getDateStart();
    const daysToCalculate = 365 * this.getYearsToForecast();
    const depositDays = this.cycleEnumToDays(this.getDepositCycle());
    const withdrawDays = this.cycleEnumToDays(this.getWithdrawCycle());
    const total = {
      daysElapsed: 0,
      balance: 0,
      available: 0,
      withdrawals: 0,
      compounds: 0,
      payouts: 0,
      deposits: 0,
    }

    let startWithdrawingFlag = false;
    let nextAction: UserActionEnum.DEPOSIT | UserActionEnum.WITHDRAW = UserActionEnum.DEPOSIT;
    let nextActionDay = depositDays;

    for (let index = 0; index < daysToCalculate; index++) {
      total.daysElapsed = index;
      const date = dayjs(dateStart).add(total.daysElapsed, "day");
      const currentBalance = total.balance;
      const dailyYieldPercent: DailyYieldPercent = this.getDailyYieldPercent(total.compounds, total.deposits);
      const dailyYieldRate = this.getDailyYieldRate(dailyYieldPercent);
      let actionToday: UserActionEnum = UserActionEnum.HOLD;
      let unlockedToday = 0;
      let availableToday = 0;
      let depositedToday = 0;
      let compoundedToday = 0;
      let withdrawnToday = 0;
      let realizedProfit = 0
      let realizedProfitPercent = 0;
      let unrealizedProfit = 0;
      let unrealizedProfitPercent = 0;

      const initFirstDay = () => {
        actionToday = UserActionEnum.INIT;
        depositedToday = this.getInitialDeposit();
        total.deposits = depositedToday;
        total.balance = total.deposits;
      }

      const calculateAvailable = () => {
        unlockedToday = this.getUnlockedToday(currentBalance, dailyYieldRate);
        availableToday = this.getTotalAvailableToday(currentBalance, total.available, unlockedToday);
        total.available = availableToday;
      }

      const depositCompoundAvailable = () => {
        actionToday = UserActionEnum.DEPOSIT;
        depositedToday = this.getRegularDeposit();
        const exceeding = (currentBalance + depositedToday + availableToday) - this.MAX_BALANCE;
        compoundedToday = Math.min(availableToday - exceeding, availableToday);
        total.balance += depositedToday + compoundedToday;
        total.deposits += depositedToday;
        total.compounds += compoundedToday;
        total.payouts += compoundedToday;
        total.available = 0;
      }

      const withdrawClaimAvailable = () => {
        actionToday = UserActionEnum.WITHDRAW;
        withdrawnToday = Math.min(currentBalance, availableToday);
        total.balance -= withdrawnToday;
        total.withdrawals += withdrawnToday;
        total.payouts = Math.min(this.MAX_PAYOUTS, total.payouts + withdrawnToday);
        total.available = 0;
      }

      const calculateProfit = () => {
        realizedProfit = total.withdrawals - total.deposits;
        realizedProfitPercent = (realizedProfit / total.deposits) * 100;
        unrealizedProfit = (total.balance + total.available) - total.deposits;
        unrealizedProfitPercent = (unrealizedProfit / total.deposits) * 100;
      }

      if (this.isMaxPayouts(total.payouts)) {
        break; // exit the loop when account is maxed
      }

      const isFirstDay = total.daysElapsed === 0;
      if (isFirstDay) {
        initFirstDay();

      } else {
        calculateAvailable();

        const isWithdrawOnlyMode = this.isMaxPayouts(total.payouts + currentBalance);
        if (isWithdrawOnlyMode) {
          const shouldWithdraw = availableToday >= currentBalance || availableToday >= this.MAX_DAILY_WITHDRAWAL;
          if (shouldWithdraw) {
            withdrawClaimAvailable();
          }

        } else {
          if (total.daysElapsed === nextActionDay) {

            if (!startWithdrawingFlag) {
              startWithdrawingFlag = this.isStartWithdrawingBalance(currentBalance);
            }

            const canDeposit = !this.isMaxBalance(currentBalance);
            const canWithdraw = currentBalance > 0 && startWithdrawingFlag;

            if (nextAction === UserActionEnum.DEPOSIT && canDeposit) {
              depositCompoundAvailable();
              nextAction = canWithdraw ? UserActionEnum.WITHDRAW : UserActionEnum.DEPOSIT;
            } else if (nextAction === UserActionEnum.WITHDRAW && canWithdraw) {
              withdrawClaimAvailable();
              nextAction = canDeposit ? UserActionEnum.DEPOSIT : UserActionEnum.WITHDRAW;
            }
            nextActionDay += nextAction === UserActionEnum.DEPOSIT ? depositDays : withdrawDays;

          }
        }
      }

      calculateProfit();

      this._dailyData.push({
        day: total.daysElapsed,
        date: date.format(this.DATE_FORMAT),
        balance: this.roundNumber(currentBalance),
        yieldPercent: dailyYieldPercent,
        yieldUnlockedToday: this.roundNumber(unlockedToday),
        availableToday: this.roundNumber(availableToday),
        totalDeposited: this.roundNumber(total.deposits),
        totalCompounded: this.roundNumber(total.compounds),
        totalWithdrawn: this.roundNumber(total.withdrawals),
        totalPayouts: this.roundNumber(total.payouts),
        totalAvailable: this.roundNumber(total.available),
        action: actionToday,
        depositedToday: this.roundNumber(depositedToday),
        compoundedToday: this.roundNumber(compoundedToday),
        withdrawnToday: this.roundNumber(withdrawnToday),
        balanceDifference: this.roundNumber(depositedToday + compoundedToday - withdrawnToday),
        newBalance: this.roundNumber(total.balance),
        realizedProfit: this.roundNumber(realizedProfit),
        realizedProfitPercent: this.roundNumber(realizedProfitPercent),
        unrealizedProfit: this.roundNumber(unrealizedProfit),
        unrealizedProfitPercent: this.roundNumber(unrealizedProfitPercent),
      });
    }

    this.calculationEmitter.emit();
    console.timeEnd("calculate");
  }

}
