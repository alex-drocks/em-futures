import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import DatalabelsPlugin from 'chartjs-plugin-datalabels';
import {ChartConfiguration, ChartData, ChartType} from "chart.js";
import {colors} from "../../../helpers/colors";

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
      labels: ["Total Deposits", "Total Withdrawals", "Total Compounds"],
      datasets: [{
        data: [this.deposits, this.withdrawals, this.compounds],
        backgroundColor: [colors.DEPOSIT_RED, colors.WITHDRAWALS_GREEN, colors.COMPOUNDS_BLUE],
      }],
    }
  }
}
