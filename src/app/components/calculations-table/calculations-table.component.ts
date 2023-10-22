import {Component} from '@angular/core';
import {CalculatorService} from "../../services/calculator.service";
import {IDailyData} from "../../app.definitions";

@Component({
  selector: 'app-calculations-table',
  templateUrl: './calculations-table.component.html',
  styleUrls: ['./calculations-table.component.scss']
})
export class CalculationsTableComponent {

  constructor(private calculator: CalculatorService) {
  }

  public get dailyData(): IDailyData[] {
    return this.calculator.getDailyData();
  }
}
