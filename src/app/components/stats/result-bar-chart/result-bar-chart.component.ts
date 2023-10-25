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

  public barChartData!: ChartData<'bar'>;
  public barChartType: ChartType = 'bar';
  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    indexAxis: 'y',
  };
  public barChartLegend = false;
  public colors = [
    colors.DEPOSIT_RED,
    colors.WITHDRAWALS_GREEN,
    colors.BALANCE_ORANGE,
    colors.COMPOUNDS_BLUE,
  ];

  constructor(private readonly calculator: CalculatorService) {
  }

  ngOnChanges(changes: SimpleChanges) {
    this.barChartData = {
      labels: [
        "Deposits (Invested)",
        "Withdrawals (Banked)",
        "Balance (TVL)",
        "Compounds (Yield)",
      ],
      datasets: [
        {
          data: [
            this.deposits,
            this.withdrawals,
            this.balance,
            this.compounds,
          ],
          label: 'Results at the end of your investment plan',
          backgroundColor: this.colors,
          hidden: false,
        },
      ]
    }
  }
}
