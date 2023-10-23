import {Component, OnInit} from '@angular/core';
import {Chart, ChartConfiguration, ChartType} from "chart.js";
import Annotation from 'chartjs-plugin-annotation';
import {IDailyData} from "../../../app.definitions";
import {CalculatorService} from "../../../services/calculator.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-time-line-chart',
  templateUrl: './time-line-chart.component.html',
  styleUrls: ['./time-line-chart.component.scss']
})
export class TimeLineChartComponent implements OnInit {
  public subscription!: Subscription;

  public lineChartType: ChartType = 'line';
  public lineChartData!: ChartConfiguration['data'];
  public lineChartOptions: ChartConfiguration['options'] = {
    elements: {
      line: {},
    },
    scales: {
      y: {
        position: 'left',
      },
    },
    plugins: {
      legend: {display: true},
      annotation: {
        annotations: [
          // {
          //   type: 'line',
          //   scaleID: 'x',
          //   value: 'March',
          //   borderColor: 'orange',
          //   borderWidth: 2,
          //   label: {
          //     display: true,
          //     position: 'center',
          //     color: 'orange',
          //     content: 'LineAnno',
          //     font: {
          //       weight: 'bold',
          //     },
          //   },
          // },
        ],
      },
    },
  };

  constructor(private readonly calculator: CalculatorService) {
    Chart.register(Annotation);
  }

  ngOnInit() {
    this.setChartData();
    this.subscription = this.calculator.calculationEmitter.subscribe(() => {
      this.setChartData();
    })
  }

  public get dailyData(): IDailyData[] {
    return this.calculator.getDailyData();
  }

  private setChartData(): void {
    this.lineChartData = {
      labels: this.dailyData.map(daily => daily.date),
      datasets: [
        {
          data: this.dailyData.map(item => item.newBalance),
          label: 'Balance (TVL)',
          backgroundColor: '#1565C0FF',
          borderColor: '#1565C0FF',
          pointRadius: 3,
          pointBackgroundColor: '#1565C0FF',
          pointBorderColor: '#1483ed',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: '#1565C0FF',
          fill: false,
          spanGaps: true,
        }
      ],
    };
  }
}
