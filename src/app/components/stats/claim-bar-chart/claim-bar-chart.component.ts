import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {ChartConfiguration, ChartData, ChartType} from "chart.js";
import {colors} from "../../../helpers/colors";
import {IDailyData} from "../../../app.definitions";
import {groupByMonth} from "../../../helpers/groupBy";

@Component({
  selector: 'app-claim-bar-chart',
  templateUrl: './claim-bar-chart.component.html',
  styleUrls: ['./claim-bar-chart.component.scss']
})
export class ClaimBarChartComponent implements OnChanges {
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
    const totalWithdrawnData: number[] = [];
    const totalCompoundedData: number[] = [];
    const totalClaimedData: number[] = [];

    for (const [month, data] of Object.entries(groupedData)) {
      labels.push(month);  // Add the month-year to labels

      // Calculate the total compounded and withdrawn for this month
      let totalWithdrawnForMonth = 0;
      let totalCompoundedForMonth = 0;
      let totalClaimedForMonth = 0;

      data.forEach(dailyData => {
        totalWithdrawnForMonth = dailyData.totalWithdrawn;
        totalCompoundedForMonth = dailyData.totalCompounded;
        totalClaimedForMonth = dailyData.totalPayouts;
      });

      totalWithdrawnData.push(totalWithdrawnForMonth);
      totalCompoundedData.push(totalCompoundedForMonth);
      totalClaimedData.push(totalClaimedForMonth);
    }

    this.barChartData = {
      labels: labels,
      datasets: [
        {
          label: 'Total Withdrawn',
          data: totalWithdrawnData,
          backgroundColor: colors.WITHDRAWALS_GREEN,
          stack: 'Stack 0'
        },
        {
          label: 'Total Compounded',
          data: totalCompoundedData,
          backgroundColor: colors.COMPOUNDS_BLUE,
          stack: 'Stack 0'
        },
        {
          label: 'Total Claimed',
          data: totalClaimedData,
          backgroundColor: colors.PAYOUTS_PURPLE,
          stack: 'Stack 0'
        }
      ]
    }
  }

}
