import {Resource, ResourceCollection} from '../models/resource';
import { Effect, BaseProductionEffect, BaseConsumptionEffect } from './effectDefinitions';

export class StructureDefinition {
    baseBuildCost: ResourceCollection = new ResourceCollection();
    effects: Effect[] = [];

    constructor(public name: string, public sortCategory: string) {

    }

    public addCost(resource: string, amount: number): StructureDefinition {
      this.baseBuildCost.add(resource, amount);
      return this;
    }

    public addEffect(bonusEffect: Effect): StructureDefinition {
      this.effects.push(bonusEffect);
      return this;
    }

    public addProduction(resource: string, amount: number): StructureDefinition {
      const bonusEffect = new BaseProductionEffect(resource, amount);
      this.effects.push(bonusEffect);
      return this;
    }

    public addConsumption(resource: string, amount: number): StructureDefinition {
      const effect = new BaseConsumptionEffect(resource, amount);
      this.effects.push(effect);
      return this;
    }


}

export const STRUCTURE_LIBRARY: StructureDefinition[] = [
    // Gathering
    new StructureDefinition('Mining Complex', 'gather').addCost('metal', 10).addConsumption('power', 10).addProduction('metal', 1),
    new StructureDefinition('Scanner Array', 'gather').addCost('metal', 100).addConsumption('power', 2).addProduction('survey', 0.2),

    // Refinement
    new StructureDefinition('Smelter', 'refine').addCost('metal', 100)
            .addConsumption('power', 2).addConsumption('metal', 2).addConsumption('silicate', 3)
            .addProduction('duranium', 0.2),

    // Power
    new StructureDefinition('Combustion Reactor', 'power').addCost('metal', 100)
            .addConsumption('hydrocarbon', 1.5)
            .addProduction('power', 10),
    new StructureDefinition('Solar Plant', 'power').addCost('metal', 100)
            .addProduction('power', 10),

    // Outpost
    new StructureDefinition('Temperate Outpost', 'outpost').addCost('metal', 100)
            .addProduction('power', 5)
];
