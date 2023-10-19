export enum depositCycleEnum {
  DAY = "Day",
  TWO_DAY = "2 Days",
  THREE_DAYS = "3 Days",
  FIVE_DAYS = "5 Days",
  WEEK = "Week",
  TWO_WEEKS = "2 Weeks",
  THREE_WEEKS = "3 Weeks",
  MONTH = "Month",
  TWO_MONTHS = "2 Months",
  QUARTER = "Quarter",
}
export enum claimCycleEnum {
  DAY = "1 Day",
  TWO_DAY = "2 Days",
  THREE_DAYS = "3 Days",
  FIVE_DAYS = "5 Days",
  WEEK = "1 Week",
  TWO_WEEKS = "2 Weeks",
  THREE_WEEKS = "3 Weeks",
  MONTH = "1 Month",
  TWO_MONTHS = "2 Months",
  QUARTER = "1 Quarter",
}

export interface ISelectOption {
  id: string;
  name: string;
}
