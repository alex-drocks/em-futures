import {Component} from '@angular/core';
import {CalculatorService} from "../../services/calculator.service";
import {BarChartData, IDailyData} from "../../app.definitions";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss']
})
export class StatsComponent {

  constructor(private calculator: CalculatorService) {
  }

  public get lastCalculatedDay(): IDailyData {
    const dailyData = this.calculator.getDailyData();
    return dailyData[dailyData.length - 1];
  }

  public get deposits(): number {
    return this.lastCalculatedDay.totalDeposited;
  }

  public get rewards(): number {
    return this.lastCalculatedDay.totalCompounded;
  }

  public get withdrawals(): number {
    return this.lastCalculatedDay.totalWithdrawn;
  }

  public get balance(): number {
    return this.lastCalculatedDay.newBalance;
  }

  public get realizedProfit(): number {
    return this.calculator.roundNumber(this.withdrawals - this.deposits);
  }

  public get unrealizedProfit(): number {
    return this.calculator.roundNumber(this.balance - this.deposits);
  }

}
