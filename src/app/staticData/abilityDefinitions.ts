import { ResourceCollection } from "../models/resource";
import { Action } from './actionDefinitions';


// Defines ship abilities and feature abilities
export class AbilityDefinition {
  public name: string;
  public costs: ResourceCollection = new ResourceCollection();
  public actions: Action[] = [];

  setDescription(): AbilityDefinition {
    return this;
  }

  addCost(resource: string, amount: number): AbilityDefinition {
    this.costs.add(resource, amount);
    return this;
  }

  addCooldown(): AbilityDefinition {
    return this;
  }

  addAction(action: Action): AbilityDefinition {
    this.actions.push(action);
    return this;
  }
}

export class ShipAbilityDefinition extends AbilityDefinition {

}

export class FeatureAbilityDefinition extends AbilityDefinition {

}
