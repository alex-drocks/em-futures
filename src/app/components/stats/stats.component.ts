import {Component} from '@angular/core';
import {CalculatorService, IDailyData} from "../../services/calculator.service";

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss']
})
export class StatsComponent {

  constructor(private calculator: CalculatorService) {
  }

  public get balance(): string {
    return `${this.calculator.getInitialDeposit()}`;
  }

  public get yieldPercent(): string {
    return this.calculator.yieldPercent.toString();
  }

  public get currentDailyYieldAmount(): string {
    return this.calculator.getCurrentDailyYieldAmount();
  }

  public get dailyData(): IDailyData[] {
    return this.calculator.getDailyData();
  }
}
