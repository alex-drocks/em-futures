import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {
  public form!: FormGroup;

  ngOnInit(): void {
    console.log("init form group");
    
    this.form = new FormGroup({
      initialDeposit: new FormControl(''),
      regularDeposit: new FormControl(''),
    });
  }

  handleSubmit() {
    console.log(this.form.value);

  }
}
