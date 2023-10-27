export enum StorageKeys {
  INITIAL_DEPOSIT = "INITIAL_DEPOSIT",
  DATE_START = "DATE_START",
  REGULAR_DEPOSIT = "REGULAR_DEPOSIT",
  DEPOSIT_CYCLE = "DEPOSIT_CYCLE",
  WITHDRAW_CYCLE = "WITHDRAW_CYCLE",
  START_WITHDRAWING_BALANCE = "START_WITHDRAWING_BALANCE",
  STOP_DEPOSITING_BALANCE = "STOP_DEPOSITING_BALANCE",
  YEARS_TO_FORECAST = "YEARS_TO_FORECAST",
}

export enum DailyRewardsPercent {
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

export enum CycleEnum {
  DAY = "DAY",
  TWO_DAY = "TWO_DAY",
  THREE_DAYS = "THREE_DAYS",
  FIVE_DAYS = "FIVE_DAYS",
  WEEK = "WEEK",
  TWO_WEEKS = "TWO_WEEKS",
  THREE_WEEKS = "THREE_WEEKS",
  MONTH = "MONTH",
  TWO_MONTHS = "TWO_MONTHS",
  THREE_MONTHS = "THREE_MONTHS",
}

export enum CycleTranslations {
  DAY = "day",
  TWO_DAY = "2 days",
  THREE_DAYS = "3 days",
  FIVE_DAYS = "5 days",
  WEEK = "week",
  TWO_WEEKS = "2 weeks",
  THREE_WEEKS = "3 weeks",
  MONTH = "month",
  TWO_MONTHS = "2 months",
  THREE_MONTHS = "3 months",
}

export interface ISelectOption {
  id: string;
  name: string;
}

export interface IDailyData {
  date: string;
  balance: number;
  rewardsPercent: DailyRewardsPercent;
  rewardsUnlockedToday: number;
  rewardsAvailable: number;
  totalWithdrawn: number;
  totalDeposited: number;
  totalCompounded: number;
  totalRewardsAvailable: number;
  actionMade: UserActionEnum;
  withdrawnToday: number;
  depositedToday: number;
  compoundedToday: number;
  balanceDifference: number;
  newBalance: number;
}
