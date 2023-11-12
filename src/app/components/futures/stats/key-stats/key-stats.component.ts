import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-key-stats',
  templateUrl: './key-stats.component.html',
  styleUrls: ['./key-stats.component.scss']
})
export class KeyStatsComponent {
  @Input() withdrawals!: number;
  @Input() compounds!: number;
  @Input() totalPayouts!: number;
  @Input() totalDays!: number;
  @Input() deposits!: number;
  @Input() balance!: number;
  @Input() realizedProfit!: number;
  @Input() realizedProfitPercent!: number;
  @Input() availableYield!: number;
  @Input() unrealizedProfit!: number;
  @Input() unrealizedProfitPercent!: number;

}
