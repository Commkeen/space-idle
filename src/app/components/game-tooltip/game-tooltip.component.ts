import { Component, OnInit, Input } from '@angular/core';
import { TooltipViewModel } from 'src/app/models/tooltipViewModel';
import { ResourceCollection } from 'src/app/models/resource';

@Component({
  selector: 'app-game-tooltip',
  templateUrl: './game-tooltip.component.html',
  styleUrls: ['./game-tooltip.component.scss']
})
export class GameTooltipComponent {

  @Input() tooltipModel: TooltipViewModel;

  constructor() {
    this.tooltipModel = new TooltipViewModel();
    this.tooltipModel.name = 'Default Name';
    this.tooltipModel.desc = 'Lorem ipsum dolor sit amet.  Lorem ipsum dolor sit amet.';
    this.tooltipModel.costs = new ResourceCollection();
    this.tooltipModel.costs.add('metal', 21);
    this.tooltipModel.costs.add('silicates', 52);
  }

}
