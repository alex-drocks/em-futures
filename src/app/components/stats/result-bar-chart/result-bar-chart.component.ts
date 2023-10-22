import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {ChartConfiguration, ChartData, ChartType} from "chart.js";
import {CalculatorService} from "../../../services/calculator.service";

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
  public barChartLegend = true;

  constructor(private readonly calculator: CalculatorService) {
  }

  ngOnChanges(changes: SimpleChanges) {
    this.barChartData = {
      labels: [
        "Deposits (Invested Capital)",
        "Compounds (Earned Yield)",
        "Withdrawals (Cashed Out)",
      ],
      datasets: [
        {
          data: [
            this.deposits,
            this.compounds,
            this.withdrawals,
          ],
          label: 'Total',
          backgroundColor: '#1565c0',
          hidden: false,
        },
        {
          data: [
            this.deposits / this.calculator.getYearsToForecast(),
            this.compounds / this.calculator.getYearsToForecast(),
            this.withdrawals / this.calculator.getYearsToForecast(),
          ],
          label: 'Yearly average',
          backgroundColor: '#198bd0',
          hidden: true,
        },
        {
          data: [
            this.deposits / this.calculator.getYearsToForecast() / 12,
            this.compounds / this.calculator.getYearsToForecast() / 12,
            this.withdrawals / this.calculator.getYearsToForecast() / 12,
          ],
          label: 'Monthly average',
          backgroundColor: '#0da0f4',
          hidden: true,
        },
        {
          data: [
            this.deposits / this.calculator.getYearsToForecast() / 12 / 4,
            this.compounds / this.calculator.getYearsToForecast() / 12 / 4,
            this.withdrawals / this.calculator.getYearsToForecast() / 12 / 4,
          ],
          label: 'Weekly average',
          backgroundColor: '#3db4ff',
          hidden: true,
        },
        {
          data: [
            this.deposits / this.calculator.getYearsToForecast() / 12 / 4 / 30,
            this.compounds / this.calculator.getYearsToForecast() / 12 / 4 / 30,
            this.withdrawals / this.calculator.getYearsToForecast() / 12 / 4 / 30,
          ],
          label: 'Daily average',
          backgroundColor: '#66c0ff',
          hidden: true,
        },

      ]
    }
  }
}
