import { ResourceCollection } from "../models/resource";
import { Action, AddResourceAction } from './actionDefinitions';


// Defines ship abilities and feature abilities
export class AbilityDefinition {
  public name: string;
  public desc: string;
  public cooldown: number;
  public costs: ResourceCollection = new ResourceCollection();
  public actions: Action[] = [];
  public visibleFlag = '';

  setDescription(desc: string): AbilityDefinition {
    this.desc = desc;
    return this;
  }

  setVisibleFlag(flag: string): AbilityDefinition {
    this.visibleFlag = flag;
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
  .setVisibleFlag('shuttleFound')
  .addCost('metal', 20)
  .addCost('silicates', 15)
  .grantsResource('nanochips', 1)
];
