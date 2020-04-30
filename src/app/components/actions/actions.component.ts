import { Component, OnInit } from '@angular/core';
import { Resource } from 'src/app/models/resource';
import { ResourceService } from 'src/app/services/resource.service';
import { Action } from 'src/app/staticData/actionDefinitions';
import { SHIP_ABILITY_LIBRARY, ShipAbilityDefinition, AbilityDefinition } from 'src/app/staticData/abilityDefinitions';
import { FlagsService } from 'src/app/services/flags.service';
import { TooltipViewModel } from 'src/app/models/tooltipViewModel';
import { ActionService } from 'src/app/services/action.service';
import { TaskService } from 'src/app/services/task.service';
import { ResearchService } from 'src/app/services/research.service';
import { UpgradeDefinition, UPGRADE_LIBRARY } from 'src/app/staticData/upgradeDefinitions';

@Component({
  selector: 'app-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.scss']
})
export class ActionsComponent implements OnInit {

  constructor(public actionService: ActionService, public resourceService: ResourceService,
              public flagsService: FlagsService, public taskService: TaskService,
              public researchService: ResearchService) { }

  ngOnInit() {

  }

  getCurrentTask() {
    return this.taskService.getCurrentTask();
  }

  getAbilities(): ShipAbilityDefinition[] {
    const abilities = SHIP_ABILITY_LIBRARY.filter(x => {
      return this.isAbilityVisible(x);
    });

    return abilities;
  }


  isAbilityVisible(ability: AbilityDefinition) {
    if (this.flagsService.check(ability.hiddenFlag)) {return false;}
    if (ability.visibleNeededResearchName != '') {
      if (this.researchService.getProgress(ability.visibleNeededResearchName).knowledgeLevel < ability.visibleNeededResearchLevel) {
        return false;
      }
    }
    return !ability.visibleFlags.some(x => {
      return !this.flagsService.check(x);
    })
  }

  getUpgrades(): UpgradeDefinition[] {
    const upgrades = this.researchService.getAvailableUpgrades().map(x => {
      return this.researchService.getUpgradeDefinition(x);
    });

    return upgrades;
  }

  getUpgradeTooltip(upg: UpgradeDefinition): TooltipViewModel {
    const tooltip = new TooltipViewModel();
    tooltip.name = upg.name;
    tooltip.desc = upg.description;
    tooltip.costs = upg.cost;
    return tooltip;
  }

  canAffordUpgrade(upg: UpgradeDefinition): boolean {
    return this.resourceService.canAfford(upg.cost);
  }

  onClickUpgrade(upg: UpgradeDefinition): boolean {
    if (!this.canAffordUpgrade(upg)) {return;}
    const result = this.researchService.buyUpgrade(upg.name);
    if (result) {
      upg.actions.forEach(act => {
        act.doAction(this.actionService);
      });
    }
  }

  showWin() {
    return this.flagsService.check('shuttleLaunched');
  }

}
