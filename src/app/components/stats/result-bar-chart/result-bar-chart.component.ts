import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {ChartConfiguration} from "chart.js";
import {Subscription} from "rxjs";
import {CalculatorService} from "../../../services/calculator.service";
import {BarChartData, IDailyData} from "../../../app.definitions";

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

  public barChartData!: BarChartData;
  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true
  };
  public barChartLabels = [
    "Deposits (Invested Capital)",
    "Compounds (Earned Yield)",
    "Withdrawals (Cashed Out)",
    "Balance (TVL)"
  ];
  public barChartLegend = false;

  ngOnChanges(changes: SimpleChanges) {
    this.barChartData = [{
      data: [
        this.deposits,
        this.compounds,
        this.withdrawals,
        this.balance
      ],
      label: 'Results',
      backgroundColor: '#1565c0',
    },];
  }
}
