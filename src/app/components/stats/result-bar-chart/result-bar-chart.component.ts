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
  @Input() rewards!: number;
  @Input() unrealizedProfit!: number;
  @Input() realizedProfit!: number;

  public barChartData!: BarChartData;
  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true
  };
  public barChartLabels = ["Your Balance", "Total Rewards", "Realized Profit", "Unrealized Profit"];
  public barChartLegend = false;

  ngOnChanges(changes: SimpleChanges) {
    this.barChartData = [{
      data: [this.balance, this.rewards, this.realizedProfit, this.unrealizedProfit],
      label: 'Results',
      backgroundColor: '#1565c0',
    },];
  }
}
