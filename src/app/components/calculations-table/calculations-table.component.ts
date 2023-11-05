import {Component, OnDestroy} from '@angular/core';
import {CalculatorService} from "../../services/calculator.service";
import {IDailyData, UserActionEnum} from "../../app.definitions";
import {storeLoadString, storeSave} from "../../helpers/storage";
import {Subscription} from "rxjs";

enum PreferencesEnum {
  TABLE_GROUP_BY = "TABLE_GROUP_BY"
}

enum GroupByEnum {
  ALL = "ALL",
  DEPOSIT = "DEPOSIT",
  WITHDRAW = "WITHDRAW",
  MAX_BALANCE = "MAX_BALANCE",
  MAX_DAILY_YIELD = "MAX_DAILY_YIELD",
  YIELD_LIMITER_ACTIVE = "YIELD_LIMITER_ACTIVE",
  START_WITHDRAW_BALANCE = "START_WITHDRAW_BALANCE",
}

@Component({
  selector: 'app-calculations-table',
  templateUrl: './calculations-table.component.html',
  styleUrls: ['./calculations-table.component.scss']
})
export class CalculationsTableComponent implements OnDestroy {
  public defaultGroupBy: GroupByEnum = GroupByEnum.DEPOSIT;
  public groupBy!: GroupByEnum;
  public rows: IDailyData[] = [];

  private subscription: Subscription;

  constructor(private calculator: CalculatorService) {
    this.loadPreference();
    this.subscription = this.calculator.calculationEmitter.subscribe(() => {
      this.filterRows();
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  public get dailyData(): IDailyData[] {
    return this.calculator.getDailyData();
  }

  public trackByDate(index: number, item: IDailyData): string {
    return item.date;
  }

  public handleGroupByChange(event: GroupByEnum) {
    this.groupBy = event;
    this.filterRows();
    this.savePreference();
  }

  private savePreference() {
    storeSave(PreferencesEnum.TABLE_GROUP_BY, this.groupBy);
  }

  private loadPreference() {
    this.groupBy = storeLoadString(PreferencesEnum.TABLE_GROUP_BY, this.defaultGroupBy) as GroupByEnum;
  }

  private filterRows() {
    switch (this.groupBy) {
      case GroupByEnum.ALL:
        this.rows = this.dailyData;
        break;
      case GroupByEnum.DEPOSIT:
        this.rows = this.dailyData.filter(data => data.action === UserActionEnum.DEPOSIT);
        break;
      case GroupByEnum.WITHDRAW:
        this.rows = this.dailyData.filter(data => data.action === UserActionEnum.WITHDRAW);
        break;
      case GroupByEnum.MAX_BALANCE:
        this.rows = this.dailyData.filter(data => data.balance >= this.calculator.MAX_BALANCE - 50_000);
        break;
      case GroupByEnum.MAX_DAILY_YIELD:
        this.rows = this.dailyData.filter(data => data.availableToday >= this.calculator.MAX_DAILY_WITHDRAWAL);
        break;
      case GroupByEnum.YIELD_LIMITER_ACTIVE:
        this.rows = this.dailyData.filter(data => data.yieldPercent < this.calculator.BASE_YIELD);
        break;
      case GroupByEnum.START_WITHDRAW_BALANCE:
        this.rows = this.dailyData.filter(data => data.balance >= this.calculator.getStartWithdrawingBalance());
        break;
      default:
        throw new Error("Group By value is invalid");
    }
  }
}
