import {Component, OnInit} from '@angular/core';
import {Chart, ChartConfiguration, ChartType, Point, PointElement} from "chart.js";
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
    normalized: true,
    parsing: false,
    animation: false,
    maintainAspectRatio: false,
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    },
    elements: {
      line: {
        cubicInterpolationMode: "default"
      },
    },
    scales: {
      x: {
      },
      y: {
        position: 'left',
        beginAtZero: false
      },
    },
    plugins: {
      legend: {display: true},
      decimation: {
        enabled: true,
        algorithm: 'min-max',
      },
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
  public colors = ["#1565C0", "#379af9", "#1bde8d", "#e8bc5c"];

  constructor(private readonly calculator: CalculatorService) {
    Chart.register(Annotation);
  }

  ngOnInit() {
    this.setChartData();
    this.subscription = this.calculator.calculationEmitter.subscribe(() => {
      this.setChartData();
    })

    console.log();
  }

  public get dailyData(): IDailyData[] {
    return this.calculator.getDailyData();
  }

  private setChartData(): void {
    this.lineChartData = {
      labels: this.dailyData.map(daily => daily.date),
      datasets: [
        {
          data: this.mapDataToPoints("newBalance") as any,
          label: 'Balance (TVL)',
          backgroundColor: this.colors[0],
          borderColor: this.colors[0],
          pointBackgroundColor: this.colors[0],
          pointBorderColor: this.colors[0],
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: this.colors[0],
          fill: false,
          pointRadius: 0,
          spanGaps: true,
        },
        {
          data: this.mapDataToPoints("totalDeposited") as any,
          label: 'Deposits (Invested)',
          backgroundColor: this.colors[1],
          borderColor: this.colors[1],
          pointBackgroundColor: this.colors[1],
          pointBorderColor: this.colors[1],
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: this.colors[1],
          fill: false,
          pointRadius: 0,
          spanGaps: true,
        },
        {
          data: this.mapDataToPoints("totalWithdrawn") as any,
          label: 'Withdrawals (Cashed out)',
          backgroundColor: this.colors[2],
          borderColor: this.colors[2],
          pointBackgroundColor: this.colors[2],
          pointBorderColor: this.colors[2],
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: this.colors[2],
          fill: false,
          pointRadius: 0,
          spanGaps: true,
        },
        {
          data: this.mapDataToPoints("totalCompounded") as any,
          label: 'Compounds (Earned Yield)',
          backgroundColor: this.colors[3],
          borderColor: this.colors[3],
          pointBackgroundColor: this.colors[3],
          pointBorderColor: this.colors[3],
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: this.colors[3],
          fill: false,
          pointRadius: 0,
          spanGaps: true,
        }
      ],
    };
  }

  private mapDataToPoints(prop: keyof IDailyData): { x: string, y: number }[] {
    return this.dailyData.map((item: IDailyData) => ({x: item.date, y: item[prop] as number}))
  }
}
