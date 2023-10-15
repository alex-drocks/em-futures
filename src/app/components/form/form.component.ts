import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import * as dayjs from 'dayjs';
import {CalculatorService} from "../../services/calculator.service";

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent implements OnInit {
  public form!: FormGroup;
  public dateFormat = "YYYY-MM-DD";

  constructor(private calculator: CalculatorService) {
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      dateStart: new FormControl(this.calculator.getDateStart().toISOString()),
      initialDeposit: new FormControl(this.calculator.getInitialDeposit()),
      regularDeposit: new FormControl(this.calculator.getRegularDeposit()),
    });
  }

  get minimumDeposit(): number {
    return this.calculator.minimumDeposit;
  }

  applyFormValues() {
    const {initialDeposit, regularDeposit, dateStart} = this.form.value;
    this.calculator.setDateStart(dateStart);
    this.calculator.setInitialDeposit(initialDeposit);
    this.calculator.setRegularDeposit(regularDeposit);
  }

}
