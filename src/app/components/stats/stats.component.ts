import {Component} from '@angular/core';
import {CalculatorService} from "../../services/calculator.service";
import {IDailyData} from "../../app.definitions";

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

}
