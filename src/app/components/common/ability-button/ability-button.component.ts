import { Component, OnInit, Input } from '@angular/core';
import { AbilityDefinition, FeatureAbilityDefinition } from 'src/app/staticData/abilityDefinitions';
import { Feature } from 'src/app/models/planet';
import { FeatureAction } from 'src/app/staticData/actionDefinitions';
import { ActionService } from 'src/app/services/action.service';
import { TooltipViewModel } from 'src/app/models/tooltipViewModel';
import { ResourceService } from 'src/app/services/resource.service';
import { TimeService } from 'src/app/services/time.service';
import { ResourceCollection } from 'src/app/models/resource';
import { ResearchService } from 'src/app/services/research.service';

@Component({
  selector: 'ability-button',
  templateUrl: './ability-button.component.html',
  styleUrls: ['./ability-button.component.scss']
})
export class AbilityButtonComponent implements OnInit {

  @Input() ability: AbilityDefinition;
  @Input() feature: Feature;

  cooldown: number = 0;
  costs: ResourceCollection = new ResourceCollection();
  tooltip: TooltipViewModel = new TooltipViewModel();

  constructor(private _actionService: ActionService,
    private _researchService: ResearchService,
    private _resourceService: ResourceService,
    private _timeService: TimeService) { }

  ngOnInit(): void {
    this._timeService.tick.subscribe(x => this.update(x));
    this.initTooltip();
    this.updateCosts();
  }

  initTooltip() {
    this.tooltip.name = this.ability.name;
    this.tooltip.desc = this.ability.desc;
    this.tooltip.costs = this.costs;
  }

  update(dT: number) {
    this.tickCooldown(dT);
    this.updateCosts();
  }

  tickCooldown(dT: number) {
    if (this.cooldown > 0) {
      this.cooldown -= dT / 1000;
      if (this.cooldown < 0) {this.cooldown = 0;}
    }
  }

  updateCosts() {
    this.costs.clear();
    this.costs.addCollection(this.ability.costs);
    let scalar = 0;
    if (this.ability.costScalesWithTheory != '') {
      scalar = this._researchService.getProgress(this.ability.costScalesWithTheory).theoryLevel;
    }
    else if (this.ability.costScalesWithResource != '') {
      scalar = this._resourceService.get(this.ability.costScalesWithResource);
    }
    for (let i = 0; i < scalar; i++) {
      this.costs.applyMultiplier(this.ability.costMultiplier);
    }
  }

  getCooldownPercent() {
    if (this.ability.cooldown == 0) {return 0;}
    return this.cooldown * 100 / this.ability.cooldown;
  }

  canAfford() {
    if (!this._resourceService.canAfford(this.costs)) {return false;}
    if (this.costs.has('drones')) {
      return (this._actionService.canAffordDroneCost(this.costs.get('drones').amount));
    }
    return true;
  }

  onClick() {
    if (this.ability == null) {return;}
    if (!this.canAfford()) {return;}
    this._resourceService.spend(this.costs);
    this.cooldown = this.ability.cooldown;
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
