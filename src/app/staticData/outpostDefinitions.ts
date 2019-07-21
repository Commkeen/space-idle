import { ResourceCollection, Resource } from "../models/resource";

export class OutpostDefinition {
  levels: OutpostLevelDefinition[] = [];

  constructor(public planetType: string) { }

  public getLevel(level: number): OutpostLevelDefinition {
    return this.levels.find(x => x.level === level);
  }

  public addLevel(level: number, name: string): OutpostDefinition {
    this.levels.push(new OutpostLevelDefinition(level, name));
    return this;
  }

  public addCost(level: number, resource: string, amount: number): OutpostDefinition {
    const levelDef = this.getLevel(level);
    levelDef.cost.add(resource, amount);
    return this;
  }

  public addPrerequisite(level: number, researchNeeded: string): OutpostDefinition {
    const levelDef = this.getLevel(level);
    levelDef.researchNeeded = researchNeeded;
    return this;
  }

  public setDroneCapacity(level: number, capacity: number): OutpostDefinition {
    const levelDef = this.getLevel(level);
    levelDef.droneCapacity = capacity;
    return this;
  }
}

export class OutpostLevelDefinition {
  public cost: ResourceCollection = new ResourceCollection();
  public researchNeeded = '';
  public droneCapacity = 0;

  constructor(public level: number, public name: string) { }
}

export const OUTPOST_LIBRARY: OutpostDefinition[] = [
  new OutpostDefinition('temperate')
      .addLevel(1, 'Survival Outpost').addCost(1, 'metal', 10).setDroneCapacity(1, 10)
      .addLevel(2, 'Command Hub').addCost(2, 'duranium', 20).addCost(2, 'silicate', 50)
      .setDroneCapacity(2, 100)
      .addLevel(3, 'Launch Complex').addCost(3, 'duranium', 100).setDroneCapacity(3, 500)
];
