import {Component} from '@angular/core';
import {CalculatorService} from "../../../services/calculator.service";
import {IDailyData} from "../../../app.definitions";

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss']
})
export class StatsComponent {

  constructor(private calculator: CalculatorService) {
  }

  public get dailyData(): IDailyData[] {
    return this.calculator.getDailyData();
  }

  public get lastCalculatedDay(): IDailyData {
    const dailyData = this.calculator.getDailyData();
    return dailyData[dailyData.length - 1];
  }

  public get date(): string {
    return this.lastCalculatedDay.date;
  }

  public get totalDays(): number {
    return this.lastCalculatedDay.day + 1;
  }

  public get deposits(): number {
    return this.lastCalculatedDay.totalDeposited;
  }

  public get compounds(): number {
    return this.lastCalculatedDay.totalCompounded;
  }

  public get withdrawals(): number {
    return this.lastCalculatedDay.totalWithdrawn;
  }

  public get balance(): number {
    return this.lastCalculatedDay.newBalance;
  }

  public get realizedProfit(): number {
    return this.lastCalculatedDay.realizedProfit;
  }

  public get unrealizedProfit(): number {
    return this.lastCalculatedDay.unrealizedProfit;
  }

  public get unrealizedProfitPercent(): number {
    return this.lastCalculatedDay.unrealizedProfitPercent;
  }

  public get realizedProfitPercent(): number {
    return this.lastCalculatedDay.realizedProfitPercent;
  }

  public get totalProfit(): number {
    return this.realizedProfit + this.unrealizedProfit;
  }

  public get totalProfitPercent(): number {
    return this.calculator.roundNumber(this.realizedProfitPercent + this.unrealizedProfitPercent);
  }

  public get totalPayouts(): number {
    return this.lastCalculatedDay.totalPayouts;
  }

  public get availableYield(): number {
    return this.lastCalculatedDay.totalAvailable;
  }

}
