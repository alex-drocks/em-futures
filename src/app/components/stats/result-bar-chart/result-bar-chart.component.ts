import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {ChartConfiguration, ChartData, ChartType} from "chart.js";
import {CalculatorService} from "../../../services/calculator.service";
import {colors} from "../../../helpers/colors";

@Component({
  selector: 'app-result-bar-chart',
  templateUrl: './result-bar-chart.component.html',
  styleUrls: ['./result-bar-chart.component.scss']
})
export class ResultBarChartComponent implements OnChanges {
  @Input() balance!: number;
  @Input() compounds!: number;
  @Input() deposits!: number;
  @Input() withdrawals!: number;
  @Input() realizedProfit!: number;

  public barChartData!: ChartData<'bar'>;
  public barChartType: ChartType = 'bar';
  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'x',
  };
  public barChartLegend = false;

  constructor() {
  }

  ngOnChanges(changes: SimpleChanges) {
    this.barChartData = {
      labels: [
        "Deposits (Cost)",
        "Compounds",
        "Withdrawals",
        "Balance (TVL)",
        // "Realized Profit",
      ],
      datasets: [
        {
          data: [
            this.deposits,
            this.compounds,
            this.withdrawals,
            this.balance,
            // this.realizedProfit,
          ],
          backgroundColor: [
            colors.DEPOSIT_RED,
            colors.COMPOUNDS_BLUE,
            colors.WITHDRAWALS_GREEN,
            colors.BALANCE_ORANGE,
            // colors.ROI_BLUE,
          ],
          label: "$",
          hidden: false,
        },
      ]
    }
  }
}
