import { ResourceCollection } from '../models/resource';

export class InfrastructureDefinition {

  public description = '';
  public tech = '';
  public cost = new ResourceCollection();

  constructor(
    public name: string
  ) { }
}

export class RegionDefinition {

  public description = '';
  public infrastructure: InfrastructureDefinition[] = [];

  constructor(
    public name: string
  ) { }

  public setDescription(desc: string): RegionDefinition {
    this.description = desc;
    return this;
  }

  public addInfrastructure(level: number, name: string): RegionDefinition {
    this.infrastructure[level] = new InfrastructureDefinition(name);
    return this;
  }

  public setInfrastructureDescription(level: number, desc: string): RegionDefinition {
    this.infrastructure[level].description = desc;
    return this;
  }

  public addCost(level: number, resource: string, amount: number): RegionDefinition {
    this.infrastructure[level].cost.add(resource, amount);
    return this;
  }


}




