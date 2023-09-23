import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import * as dayjs from 'dayjs';


@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent implements OnInit {
  public form!: FormGroup;

  ngOnInit(): void {
    console.log("init form group");
    const today = dayjs();
    const firstDayOfNextMonth = today.add(1, 'month').startOf('month').hour(today.hour());

    this.form = new FormGroup({
      initialDeposit: new FormControl(200),
      regularDeposit: new FormControl(200),
      dateStart: new FormControl(today.toISOString()),
      dateNextDeposit: new FormControl(firstDayOfNextMonth.toISOString()),
    });

    console.log(this.form.value);

  }

  handleSubmit() {
    console.log(this.form.value);

  }
}
