import { ResourceCollection } from "../models/resource";
import { Action, AddResourceAction, FlagAction } from './actionDefinitions';


// Defines ship abilities and feature abilities
export class AbilityDefinition {
  public name: string;
  public desc: string;
  public cooldown: number;
  public costs: ResourceCollection = new ResourceCollection();
  public actions: Action[] = [];
  public visibleFlags: string[] = [];
  public hiddenFlag: string = '';
  public visibleNeededResearchName: string = '';
  public visibleNeededResearchLevel: number = 0;

  setDescription(desc: string): AbilityDefinition {
    this.desc = desc;
    return this;
  }

  addVisibleFlag(flag: string): AbilityDefinition {
    this.visibleFlags.push(flag);
    return this;
  }

  setHiddenFlag(flag: string): AbilityDefinition {
    this.hiddenFlag = flag;
    return this;
  }

  setVisibleNeededResearch(discipline: string, level: number): AbilityDefinition {
    this.visibleNeededResearchName = discipline;
    this.visibleNeededResearchLevel = level;
    return this;
  }

  addCost(resource: string, amount: number): AbilityDefinition {
    this.costs.add(resource, amount);
    return this;
  }

  addCooldown(cooldown: number): AbilityDefinition {
    this.cooldown = cooldown;
    return this;
  }

  addAction(action: Action): AbilityDefinition {
    this.actions.push(action);
    return this;
  }

  grantsResource(resource: string, amount: number): AbilityDefinition {
    const action = new AddResourceAction(resource, amount);
    this.addAction(action);
    return this;
  }

  setsFlag(flag: string): AbilityDefinition {
    const action = new FlagAction(flag);
    this.addAction(action);
    return this;
  }
}

export class FeatureAbilityDefinition extends AbilityDefinition {

}

export class ShipAbilityDefinition extends AbilityDefinition {
  constructor(name: string) {
    super();
    this.name = name;
  }
}

export const SHIP_ABILITY_LIBRARY: ShipAbilityDefinition[] = [
  new ShipAbilityDefinition('Build Drone')
  .addCost('metal', 5)
  .addCost('energy', 4)
  .grantsResource('drones', 1),
  new ShipAbilityDefinition('Fabricate Nanochip')
  .addVisibleFlag('fabricatorRepaired')
  .addCost('metal', 20)
  .addCost('silicates', 15)
  .grantsResource('nanochips', 1),
  new ShipAbilityDefinition('Repair Fabricator')
  .addVisibleFlag('shuttleFound')
  .setsFlag('fabricatorRepaired')
  .setHiddenFlag('fabricatorRepaired'),
  new ShipAbilityDefinition('Repair Survey Scanner')
  .addVisibleFlag('shuttleFound')
  .setsFlag('surveyRepaired')
  .setHiddenFlag('surveyRepaired'),
  new ShipAbilityDefinition('Repair Drone Relay')
  .addVisibleFlag('shuttleFound')
  .setsFlag('droneRelayRepaired')
  .setHiddenFlag('droneRelayRepaired'),
  new ShipAbilityDefinition('Repair Research Computer')
  .addVisibleFlag('shuttleFound')
  .setsFlag('researchUnlocked')
  .setHiddenFlag('researchUnlocked'),
  new ShipAbilityDefinition('Launch Ship')
  .setsFlag('shuttleLaunched')
  .setVisibleNeededResearch('Gravitics', 1)
  .setHiddenFlag('shuttleLaunched')

];
