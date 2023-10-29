import {Component, OnInit} from '@angular/core';
import {Chart, ChartConfiguration, ChartType, Point, PointElement} from "chart.js";
import Annotation from 'chartjs-plugin-annotation';
import {IDailyData} from "../../../app.definitions";
import {CalculatorService} from "../../../services/calculator.service";
import {Subscription} from "rxjs";
import {colors} from "../../../helpers/colors";

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
      x: {},
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
          data: this.mapDataToPoints("totalDeposited") as any,
          label: 'Deposits (Invested)',
          backgroundColor: colors.DEPOSIT_RED,
          borderColor: colors.DEPOSIT_RED,
          pointBackgroundColor: colors.DEPOSIT_RED,
          pointBorderColor: colors.DEPOSIT_RED,
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: colors.DEPOSIT_RED,
          fill: false,
          pointRadius: 0,
          spanGaps: true,
        },
        {
          data: this.mapDataToPoints("totalCompounded") as any,
          label: 'Compounded Earnings',
          backgroundColor: colors.COMPOUNDS_BLUE,
          borderColor: colors.COMPOUNDS_BLUE,
          pointBackgroundColor: colors.COMPOUNDS_BLUE,
          pointBorderColor: colors.COMPOUNDS_BLUE,
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: colors.COMPOUNDS_BLUE,
          fill: false,
          pointRadius: 0,
          spanGaps: true,
          hidden: true,
        },
        {
          data: this.mapDataToPoints("totalWithdrawn") as any,
          label: 'Withdrawals (Cashed out)',
          backgroundColor: colors.WITHDRAWALS_GREEN,
          borderColor: colors.WITHDRAWALS_GREEN,
          pointBackgroundColor: colors.WITHDRAWALS_GREEN,
          pointBorderColor: colors.WITHDRAWALS_GREEN,
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: colors.WITHDRAWALS_GREEN,
          fill: false,
          pointRadius: 0,
          spanGaps: true,
        },
        {
          data: this.mapDataToPoints("newBalance") as any,
          label: 'Balance (Locked Value)',
          backgroundColor: colors.BALANCE_ORANGE,
          borderColor: colors.BALANCE_ORANGE,
          pointBackgroundColor: colors.BALANCE_ORANGE,
          pointBorderColor: colors.BALANCE_ORANGE,
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: colors.BALANCE_ORANGE,
          fill: false,
          pointRadius: 0,
          spanGaps: true,
        },
        {
          data: this.mapDataToPoints(["totalWithdrawn", "totalDeposited"]) as any,
          label: 'ROI (Return On Investment)',
          backgroundColor: colors.ROI_BLUE,
          borderColor: colors.ROI_BLUE,
          pointBackgroundColor: colors.ROI_BLUE,
          pointBorderColor: colors.ROI_BLUE,
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: colors.ROI_BLUE,
          fill: false,
          pointRadius: 0,
          spanGaps: true,
          hidden: true,
        }
      ],
    };
  }

  private mapDataToPoints(prop: keyof IDailyData | Array<keyof IDailyData>): { x: string, y: number }[] {
    if (typeof prop === "string") {
      return this.dailyData.map((item: IDailyData) => ({
        x: item.date,
        y: item[prop] as number
      }));
    }
    if (typeof prop === "object" && Array.isArray(prop)) {
      // @ts-ignore
      const calculate = (item: IDailyData) => (item[prop[0]] - item[prop[1]]);
      return this.dailyData.map((item: IDailyData) => ({
        x: item.date,
        y: calculate(item) as number
      }));
    }
    return [];
  }
}
