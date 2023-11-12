import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule,} from '@angular/material/core';
import {MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {BrowserModule} from '@angular/platform-browser';
import {AppComponent} from './app.component';
import {FormComponent} from './components/form/form.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {StatsComponent} from './components/stats/stats.component';
import {MatCardModule} from "@angular/material/card";
import {MatSelectModule} from "@angular/material/select";
import {CdkAccordionModule} from "@angular/cdk/accordion";
import {MatIconModule} from "@angular/material/icon";
import {CalculationsTableComponent} from './components/calculations-table/calculations-table.component';
import {NgChartsModule} from 'ng2-charts';
import {ResultBarChartComponent} from './components/stats/result-bar-chart/result-bar-chart.component';
import {DepositPieChartComponent} from './components/stats/deposit-pie-chart/deposit-pie-chart.component';
import {TimeLineChartComponent} from './components/stats/time-line-chart/time-line-chart.component';
import {NgOptimizedImage} from "@angular/common";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatGridListModule} from "@angular/material/grid-list";
import {ClaimBarChartComponent} from './components/stats/claim-bar-chart/claim-bar-chart.component';
import {ProfitBarChartComponent} from './components/stats/profit-bar-chart/profit-bar-chart.component';
import {WithdrawBarChartComponent} from './components/stats/withdraw-bar-chart/withdraw-bar-chart.component';
import {KeyStatsComponent} from './components/stats/key-stats/key-stats.component';


export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'YYYY-MM-DD',
  },
  display: {
    dateInput: 'YYYY-MM-DD',
    monthYearLabel: 'YYYY MMM',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY MMM',
  },
};

@NgModule({
  declarations: [
    AppComponent,
    FormComponent,
    StatsComponent,
    CalculationsTableComponent,
    ResultBarChartComponent,
    DepositPieChartComponent,
    TimeLineChartComponent,
    ClaimBarChartComponent,
    ProfitBarChartComponent,
    WithdrawBarChartComponent,
    KeyStatsComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatNativeDateModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatSelectModule,
    CdkAccordionModule,
    MatIconModule,
    NgChartsModule,
    NgOptimizedImage,
    MatTooltipModule,
    MatGridListModule,
  ],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    {
      provide:
      MAT_DATE_FORMATS,
      useValue: MY_DATE_FORMATS
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
