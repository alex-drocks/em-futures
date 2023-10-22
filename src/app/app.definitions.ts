export enum StorageKeys {
  INITIAL_DEPOSIT = "INITIAL_DEPOSIT",
  DATE_START = "DATE_START",
  REGULAR_DEPOSIT = "REGULAR_DEPOSIT",
  DEPOSIT_CYCLE = "DEPOSIT_CYCLE",
  WITHDRAW_CYCLE = "WITHDRAW_CYCLE",
  START_WITHDRAWING_BALANCE = "START_WITHDRAWING_BALANCE",
  STOP_DEPOSITING_BALANCE = "STOP_DEPOSITING_BALANCE",
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
  DAY = "Day",
  TWO_DAY = "2 Days",
  THREE_DAYS = "3 Days",
  FIVE_DAYS = "5 Days",
  WEEK = "Week",
  TWO_WEEKS = "2 Weeks",
  THREE_WEEKS = "3 Weeks",
  MONTH = "Month",
  TWO_MONTHS = "2 Months",
  THREE_MONTHS = "3 Months",
  NEVER = "Never",
}

export interface ISelectOption {
  id: string;
  name: string;
}

export interface IDailyData {
  date: string;
  balance: number;
  rewardsPercent: DailyRewardsPercent;
  rewardsToday: number;
  rewardsAvailable: number;
  totalWithdrawals: number;
  totalDeposits: number;
  totalCompounds: number;
  actionMade: UserActionEnum;
  withdrawnToday: number;
  depositedToday: number;
  compoundedToday: number;
  balanceDifference: number;
  newBalance: number;
}
