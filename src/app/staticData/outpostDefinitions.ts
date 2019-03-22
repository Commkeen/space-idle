import { ResourceCollection, Resource } from "../models/resource";

export class OutpostDefinition {
  levels: OutpostLevelDefinition[] = [];

  constructor(public planetType: string) { }

  public addLevel(level: number, name: string): OutpostDefinition {
    this.levels.push(new OutpostLevelDefinition(level, name));
    return this;
  }

  public addCost(level: number, resource: string, amount: number): OutpostDefinition {
    const levelDef = this.levels.find(x => x.level === level);
    levelDef.cost.push(new Resource(resource, amount));
    return this;
  }

  public addPrerequisite(level: number, researchNeeded: string): OutpostDefinition {
    const levelDef = this.levels.find(x => x.level === level);
    levelDef.researchNeeded = researchNeeded;
    return this;
  }
}

export class OutpostLevelDefinition {
  public cost: Resource[] = [];
  public researchNeeded = '';

  constructor(public level: number, public name: string) { }
}

export const OUTPOST_LIBRARY: OutpostDefinition[] = [
  new OutpostDefinition('temperate')
      .addLevel(1, 'Survival Outpost').addCost(1, 'metal', 10)
      .addLevel(2, 'Command Hub').addCost(2, 'duranium', 20).addCost(2, 'silicate', 50)
      .addLevel(3, 'Launch Complex').addCost(3, 'duranium', 100)
];
