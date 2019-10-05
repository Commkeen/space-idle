import { Component, OnInit, Input } from '@angular/core';
import { TooltipViewModel } from 'src/app/models/tooltipViewModel';

@Component({
  selector: 'app-game-tooltip',
  templateUrl: './game-tooltip.component.html',
  styleUrls: ['./game-tooltip.component.scss']
})
export class GameTooltipComponent {

  @Input() tooltipModel: TooltipViewModel;

}
