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

}
