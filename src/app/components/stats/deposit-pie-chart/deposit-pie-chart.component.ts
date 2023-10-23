import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import DatalabelsPlugin from 'chartjs-plugin-datalabels';
import {ChartConfiguration, ChartData, ChartType} from "chart.js";

@Component({
  selector: 'app-deposit-pie-chart',
  templateUrl: './deposit-pie-chart.component.html',
  styleUrls: ['./deposit-pie-chart.component.scss']
})
export class DepositPieChartComponent implements OnChanges {
  @Input() deposits!: number;
  @Input() compounds!: number;
  @Input() withdrawals!: number;

  public pieChartData!: ChartData<'pie', number[], string | string[]>;
  public pieChartType: ChartType = 'pie';
  public pieChartPlugins = [DatalabelsPlugin];
  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      datalabels: {
        formatter: (value: any, ctx: any) => {
          if (ctx.chart.data.labels) {
            return ctx.chart.data.labels[ctx.dataIndex];
          }
        },
      },
    },
  };

  ngOnChanges(changes: SimpleChanges) {
    this.pieChartData = {
      labels: ["Total Deposits", "Total Compounds", "Total Withdrawals"],
      datasets: [{
        data: [this.deposits, this.compounds, this.withdrawals],
        backgroundColor: ["#379af9", "#e8bc5c", "#2ebe79"],
      }],
    }
  }
}
