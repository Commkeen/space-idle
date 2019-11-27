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

export const REGION_LIBRARY: RegionDefinition[] = [
  new RegionDefinition('Plains').setDescription('Rolling plains.')
    .addInfrastructure(1, 'Survey scan').setDescription('An initial scan of the region.')
    .addCost(1, 'metal', 5),
  new RegionDefinition('Hills').setDescription('Geographically complex region rich in minerals.')
    .addInfrastructure(1, 'Tunnels').setInfrastructureDescription(1, 'Tunnels to facilitate mining.')
    .addCost(1, 'metal', 25),
  new RegionDefinition('Mountain').setDescription('Difficult to traverse, but can contain many valuable materials.')
    .addInfrastructure(1, 'Seismic Attenuators').setInfrastructureDescription(1, 'Control for seismic disturbances.')
    .addCost(1, 'nanochips', 5)
];
