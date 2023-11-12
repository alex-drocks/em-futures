import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {IDailyData} from "../../futures.definitions";
import {ChartConfiguration, ChartData, ChartType} from "chart.js";
import {colors} from "../../../../helpers/colors";
import {groupByMonth} from "../../../../helpers/groupBy";

@Component({
  selector: 'app-profit-bar-chart',
  templateUrl: './profit-bar-chart.component.html',
  styleUrls: ['./profit-bar-chart.component.scss']
})
export class ProfitBarChartComponent implements OnChanges {
  @Input() dailyData!: IDailyData[];

  public barChartData!: ChartData<'bar'>;
  public barChartType: ChartType = 'bar';
  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: false,
        beginAtZero: true,
      }
    }
  };
  public barChartLegend = true;

  constructor() {
  }

  ngOnChanges(changes: SimpleChanges) {
    const groupedData = groupByMonth(this.dailyData);

    const labels: string[] = [];
    const totalDepositedData: number[] = [];
    const totalWithdrawnData: number[] = [];
    const realizedProfitData: number[] = [];

    for (const [month, data] of Object.entries(groupedData)) {
      labels.push(month);  // Add the month-year to labels

      // Calculate the total compounded and withdrawn for this month
      let totalWithdrawnForMonth = 0;
      let totalDepositedForMonth = 0;
      let totalRealizedProfitForMonth = 0;

      data.forEach(dailyData => {
        totalWithdrawnForMonth = dailyData.totalWithdrawn;
        totalDepositedForMonth = dailyData.totalDeposited;
        totalRealizedProfitForMonth = dailyData.realizedProfit;
      });

      totalDepositedData.push(totalDepositedForMonth);
      totalWithdrawnData.push(totalWithdrawnForMonth);
      realizedProfitData.push(totalRealizedProfitForMonth);
    }

    this.barChartData = {
      labels: labels,
      datasets: [
        {
          label: 'Total Deposited',
          data: totalDepositedData,
          backgroundColor: colors.DEPOSIT_RED,
          stack: 'Stack 0'
        },
        {
          label: 'Realized Profit',
          data: realizedProfitData,
          backgroundColor: colors.REALIZED_BLUE,
          stack: 'Stack 0'
        },
        {
          label: 'Total Withdrawn',
          data: totalWithdrawnData,
          backgroundColor: colors.WITHDRAWALS_GREEN,
          stack: 'Stack 0'
        }
      ]
    }
  }

}
