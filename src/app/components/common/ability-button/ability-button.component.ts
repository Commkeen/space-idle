import { Component, OnInit, Input } from '@angular/core';
import { AbilityDefinition, FeatureAbilityDefinition } from 'src/app/staticData/abilityDefinitions';
import { Feature } from 'src/app/models/planet';
import { FeatureAction } from 'src/app/staticData/actionDefinitions';
import { ActionService } from 'src/app/services/action.service';
import { TooltipViewModel } from 'src/app/models/tooltipViewModel';
import { ResourceService } from 'src/app/services/resource.service';

@Component({
  selector: 'ability-button',
  templateUrl: './ability-button.component.html',
  styleUrls: ['./ability-button.component.scss']
})
export class AbilityButtonComponent implements OnInit {

  @Input() ability: AbilityDefinition;
  @Input() feature: Feature;

  constructor(private _actionService: ActionService, private _resourceService: ResourceService) { }

  ngOnInit(): void {
  }

  getTooltip(): TooltipViewModel {
    const tooltip = new TooltipViewModel();
    tooltip.name = this.ability.name;
    tooltip.desc = this.ability.desc;
    tooltip.costs = this.ability.costs;
    return tooltip;
  }

  canAfford() {
    return this._resourceService.canAfford(this.ability.costs);
  }

  onClick() {
    if (this.ability == null) {return;}
    if (!this.canAfford()) {return;}
    this._resourceService.spend(this.ability.costs);
    this.ability.actions.forEach(a => {
      if (a instanceof FeatureAction) {
        (a as FeatureAction).doFeatureAction(this._actionService, this.feature);
      }
      else {
        a.doAction(this._actionService);
      }
    });
  }

}
