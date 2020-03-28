import { Component, OnInit } from '@angular/core';
import { Resource } from 'src/app/models/resource';
import { ResourceService } from 'src/app/services/resource.service';
import { Action } from 'src/app/staticData/actionDefinitions';
import { SHIP_ABILITY_LIBRARY, ShipAbilityDefinition } from 'src/app/staticData/abilityDefinitions';
import { FlagsService } from 'src/app/services/flags.service';
import { TooltipViewModel } from 'src/app/models/tooltipViewModel';

@Component({
  selector: 'app-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.scss']
})
export class ActionsComponent implements OnInit {

  constructor(public resourceService: ResourceService, public flagsService: FlagsService) { }

  ngOnInit() {

  }

  onClickAbility(ability: ShipAbilityDefinition) {
    this.resourceService.spend(ability.costs);
    ability.actions.forEach(x => {
      x.doAction(this.resourceService);
    });
  }

  canAfford(ability: ShipAbilityDefinition) {
    return this.resourceService.canAfford(ability.costs);
  }

  getTooltip(ability: ShipAbilityDefinition): TooltipViewModel {
    const tooltip = new TooltipViewModel();
    tooltip.name = ability.name;
    tooltip.desc = ability.desc;
    tooltip.costs = ability.costs;
    return tooltip;
  }

  getAbilities(): ShipAbilityDefinition[] {
    const abilities = SHIP_ABILITY_LIBRARY.filter(x => {
      return this.flagsService.check(x.visibleFlag);
    });

    return abilities;
  }

}
