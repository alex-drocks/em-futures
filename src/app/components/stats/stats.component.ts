import {Component} from '@angular/core';
import {CalculatorService} from "../../services/calculator.service";

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

  public get dailyYieldAmount(): string {
    return `${this.calculator.roundNumber(this.calculator.getDailyYield(), 3)}`;
  }

  public get yieldPercent(): string {
    return this.calculator.yieldPercent.toString();
  }
}
