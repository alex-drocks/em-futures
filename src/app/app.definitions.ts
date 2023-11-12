export enum StorageKeys {
  INITIAL_DEPOSIT = "INITIAL_DEPOSIT",
  DATE_START = "DATE_START",
  REGULAR_DEPOSIT = "REGULAR_DEPOSIT",
  DEPOSIT_CYCLE = "DEPOSIT_CYCLE",
  WITHDRAW_CYCLE = "WITHDRAW_CYCLE",
  START_WITHDRAWING_BALANCE = "START_WITHDRAWING_BALANCE",
  YEARS_TO_FORECAST = "YEARS_TO_FORECAST",
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

export enum CycleEnum {
  DAY = "DAY",
  TWO_DAY = "TWO_DAY",
  THREE_DAYS = "THREE_DAYS",
  FOUR_DAYS = "FOUR_DAYS",
  FIVE_DAYS = "FIVE_DAYS",
  SIX_DAYS = "SIX_DAYS",
  WEEK = "WEEK",
  TWO_WEEKS = "TWO_WEEKS",
  THREE_WEEKS = "THREE_WEEKS",
  MONTH = "MONTH",
  TWO_MONTHS = "TWO_MONTHS",
  THREE_MONTHS = "THREE_MONTHS",
  SIX_MONTHS = "SIX_MONTHS",
}

export enum CycleEnumDayValues {
  DAY = 1,
  TWO_DAY = 2,
  THREE_DAYS = 3,
  FOUR_DAYS = 4,
  FIVE_DAYS = 5,
  SIX_DAYS = 6,
  WEEK = 7,
  TWO_WEEKS = 14,
  THREE_WEEKS = 21,
  MONTH = 30,
  TWO_MONTHS = 60,
  THREE_MONTHS = 90,
  SIX_MONTHS = 180,
}

export enum CycleTranslations {
  DAY = "1 day",
  TWO_DAY = "2 days",
  THREE_DAYS = "3 days",
  FOUR_DAYS = "4 days",
  FIVE_DAYS = "5 days",
  SIX_DAYS = "6 days",
  WEEK = "7 days (1 week)",
  TWO_WEEKS = "14 days (2 weeks)",
  THREE_WEEKS = "21 days (3 weeks)",
  MONTH = "30 days (1 month)",
  TWO_MONTHS = "60 days (2 months)",
  THREE_MONTHS = "90 days (3 months)",
  SIX_MONTHS = "180 days (6 months)",
}

export interface ISelectOption {
  id: string;
  name: string;
}

export interface IDailyData {
  day: number;
  date: string;
  balance: number;
  yieldPercent: DailyYieldPercent;
  yieldUnlockedToday: number;
  availableToday: number;
  totalWithdrawn: number;
  totalDeposited: number;
  totalCompounded: number;
  totalPayouts: number;
  totalAvailable: number;
  action: UserActionEnum;
  withdrawnToday: number;
  depositedToday: number;
  compoundedToday: number;
  balanceDifference: number;
  newBalance: number;
  realizedProfit: number;
  realizedProfitPercent: number;
  unrealizedProfit: number;
  unrealizedProfitPercent: number;
}
