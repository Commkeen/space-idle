import { Resource, ResourceCollection } from '../models/resource';
import { BonusEffect } from './effectDefinitions';

export class UpgradeDefinition {
  public cost: ResourceCollection = new ResourceCollection();
  public effects: BonusEffect[] = [];
  constructor(
    public name: string,
    public description: string,
    public researchNeeded: string
  ) {}

  public addCost(resource: string, amount: number): UpgradeDefinition {
    this.cost.add(resource, amount);
    return this;
  }
}

export const UPGRADE_LIBRARY: UpgradeDefinition[] = [
  new UpgradeDefinition('Improved Furnace', 'desc', 'Alloys').addCost('duranium', 10),

];
