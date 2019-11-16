import { ResourceCollection } from "../models/resource";
import { Effect } from "./effectDefinitions";

export class ActionDefinition {
  public name = '';
  public description = '';
  public cooldown = 1;
  public cost: ResourceCollection = new ResourceCollection();
  public effects: Effect[] = [];

  constructor(name: string) {
    this.name = name;
  }

  setDescription(desc: string): ActionDefinition {
    this.description = desc;
    return this;
  }

  addCost(resource: string, amount: number): ActionDefinition {
    this.cost.add(resource, amount);
    return this;
  }

  setCooldown(cooldown: number): ActionDefinition {
    this.cooldown = cooldown;
    return this;
  }
}

export const ACTION_LIBRARY: ActionDefinition[] = [
  new ActionDefinition('Build Drone'),
  new ActionDefinition('Fabricate Nanochip'),
  new ActionDefinition('Build Outpost'),
  new ActionDefinition('Repair Ship Computer')
];
