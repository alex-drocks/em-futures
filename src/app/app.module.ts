import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {ReactiveFormsModule} from '@angular/forms';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule,} from '@angular/material/core';
import {MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {routes} from "./app.routes";
import {FuturesComponent} from "./components/futures/futures.component";
import {AppComponent} from "./app.component";
import {FormComponent} from "./components/futures/form/form.component";
import {StatsComponent} from "./components/futures/stats/stats.component";
import {CalculationsTableComponent} from "./components/futures/calculations-table/calculations-table.component";
import {ResultBarChartComponent} from "./components/futures/stats/result-bar-chart/result-bar-chart.component";
import {DepositPieChartComponent} from "./components/futures/stats/deposit-pie-chart/deposit-pie-chart.component";
import {TimeLineChartComponent} from "./components/futures/stats/time-line-chart/time-line-chart.component";
import {ClaimBarChartComponent} from "./components/futures/stats/claim-bar-chart/claim-bar-chart.component";
import {ProfitBarChartComponent} from "./components/futures/stats/profit-bar-chart/profit-bar-chart.component";
import {WithdrawBarChartComponent} from "./components/futures/stats/withdraw-bar-chart/withdraw-bar-chart.component";
import {KeyStatsComponent} from "./components/futures/stats/key-stats/key-stats.component";
import {BrowserModule} from "@angular/platform-browser";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MatCardModule} from "@angular/material/card";
import {MatSelectModule} from "@angular/material/select";
import {CdkAccordionModule} from "@angular/cdk/accordion";
import {MatIconModule} from "@angular/material/icon";
import {NgChartsModule} from "ng2-charts";
import {NgOptimizedImage} from "@angular/common";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatGridListModule} from "@angular/material/grid-list";


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
    FuturesComponent,
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
    RouterModule.forRoot(routes),
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
  exports: [RouterModule],
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
