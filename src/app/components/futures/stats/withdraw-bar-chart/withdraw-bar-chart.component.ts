import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {IDailyData} from "../../futures.definitions";
import {ChartConfiguration, ChartData, ChartType} from "chart.js";
import {groupByMonth, groupByWeek, groupByYear} from "../../../../helpers/groupBy";
import {colors} from "../../../../helpers/colors";
import {storeLoadString, storeSave} from "../../../../helpers/storage";

enum GroupByPeriodEnum {
  WEEKLY = "WEEKLY",
  MONTHLY = "MONTHLY",
  YEARLY = "YEARLY",
}

enum PreferencesEnum {
  WITHDRAW_CHART_PERIOD = "WITHDRAW_CHART_PERIOD"
}

@Component({
  selector: 'app-withdraw-bar-chart',
  templateUrl: './withdraw-bar-chart.component.html',
  styleUrls: ['./withdraw-bar-chart.component.scss']
})
export class WithdrawBarChartComponent implements OnChanges {
  @Input() dailyData!: IDailyData[];

  public defaultPeriod: GroupByPeriodEnum = GroupByPeriodEnum.YEARLY;
  public groupByPeriod!: GroupByPeriodEnum;

  public barChartData!: ChartData<'bar'>;
  public barChartType: ChartType = 'bar';
  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        stacked: false,
      },
      y: {
        stacked: false,
        beginAtZero: true,
      }
    }
  };
  public barChartLegend = false;

  constructor() {
    this.loadPreference();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.setChartData();
  }

  public setChartData() {

    const labels: string[] = [];
    const totalWithdrawnData: number[] = [];

    if (this.groupByPeriod === GroupByPeriodEnum.YEARLY) {
      const yearly = groupByYear(this.dailyData);
      for (const [year, data] of Object.entries(yearly)) {
        labels.push(year);
        let yearlyWithdrawals = 0;
        data.forEach(dailyData => {
          yearlyWithdrawals += dailyData.withdrawnToday;
        });
        totalWithdrawnData.push(yearlyWithdrawals);
      }
    } else if (this.groupByPeriod === GroupByPeriodEnum.MONTHLY) {
      const monthly = groupByMonth(this.dailyData);
      for (const [month, data] of Object.entries(monthly)) {
        labels.push(month);
        let monthlyWithdrawals = 0;
        data.forEach(dailyData => {
          monthlyWithdrawals += dailyData.withdrawnToday;
        });
        totalWithdrawnData.push(monthlyWithdrawals);
      }
    } else if (this.groupByPeriod === GroupByPeriodEnum.WEEKLY) {
      const weekly = groupByWeek(this.dailyData);
      for (const [week, data] of Object.entries(weekly)) {
        labels.push(week);
        let weeklyWithdrawals = 0;
        data.forEach(dailyData => {
          weeklyWithdrawals += dailyData.withdrawnToday;
        });
        totalWithdrawnData.push(weeklyWithdrawals);
      }
    }

    this.barChartData = {
      labels: labels,
      datasets: [
        {
          label: 'Withdrawals',
          data: totalWithdrawnData,
          backgroundColor: colors.WITHDRAWALS_GREEN,
          hidden: false,
        },
      ]
    }
  }

  public handleGroupByChange(period: GroupByPeriodEnum) {
    this.groupByPeriod = period;
    this.setChartData();
    this.savePreference();
  }

  private savePreference() {
    storeSave(PreferencesEnum.WITHDRAW_CHART_PERIOD, this.groupByPeriod);
  }

  private loadPreference() {
    this.groupByPeriod = storeLoadString(PreferencesEnum.WITHDRAW_CHART_PERIOD, this.defaultPeriod) as GroupByPeriodEnum;
  }
}
