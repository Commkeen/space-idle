import {Resource, ResourceCollection} from '../models/resource';
import { Effect, BaseProductionEffect, BaseConsumptionEffect } from './effectDefinitions';

export class StructureDefinition {
    baseBuildCost: ResourceCollection = new ResourceCollection();
    effects: Effect[] = [];
    prereqs: string[] = [];

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

    public addPrereq(upgrade: string): StructureDefinition {
      this.prereqs.push(upgrade);
      return this;
    }


}

export const STRUCTURE_LIBRARY: StructureDefinition[] = [
    // Gathering
    new StructureDefinition('Mining Complex', 'gather').addCost('metal', 10).addConsumption('power', 10).addProduction('metal', 1),
    new StructureDefinition('Scanner Array', 'gather').addCost('metal', 100).addConsumption('power', 2).addProduction('survey', 0.2),

    // Refinement
    new StructureDefinition('Smelter', 'refine').addPrereq('Construction').addCost('metal', 100)
            .addConsumption('power', 2).addConsumption('metal', 2).addConsumption('silicate', 3)
            .addProduction('duranium', 0.2),
    new StructureDefinition('Electronics Lab', 'refine').addPrereq('Construction')
            .addCost('', 100)
            .addConsumption('', 1)
            .addProduction('nanochips', 1),
    new StructureDefinition('Cryodistillery', 'refine').addPrereq('arcticSurveyUpgrade')
            .addCost('', 100)
            .addConsumption('', 1)
            .addProduction('cryofluid', 1),
    new StructureDefinition('Nanofiber Loom', 'refine').addPrereq('Tensile Polymers')
            .addCost('', 100)
            .addConsumption('', 1)
            .addProduction('nanofiber', 1),
    new StructureDefinition('Optics Workshop', 'refine').addPrereq('Photon Processing')
            .addCost('', 100)
            .addConsumption('', 1)
            .addProduction('optronics', 1),
    new StructureDefinition('High-Energy Lab', 'refine').addPrereq('Electrodynamics')
            .addCost('', 100)
            .addConsumption('', 1)
            .addProduction('ultraconductors', 1),
    new StructureDefinition('Dimensional Forge', 'refine').addPrereq('Extradimensional Synthesis')
            .addCost('', 100)
            .addConsumption('', 1)
            .addProduction('hyperlattice', 1),
    new StructureDefinition('Silksteel Foundry', 'refine').addPrereq('Unbreakable Materials')
            .addCost('', 100)
            .addConsumption('', 1)
            .addProduction('silksteel', 1),
    new StructureDefinition('Neurocomputing Lab', 'refine').addPrereq('Synthetic Thought')
            .addCost('', 100)
            .addConsumption('', 1)
            .addProduction('cogitex', 1),
    new StructureDefinition('Gravitics Lab', 'refine').addPrereq('Artificial Gravity')
            .addCost('', 100)
            .addConsumption('', 1)
            .addProduction('gravalloy', 1),

    // Power
    new StructureDefinition('Combustion Reactor', 'power').addCost('metal', 100)
            .addConsumption('hydrocarbon', 1.5)
            .addProduction('power', 10),
    new StructureDefinition('Solar Plant', 'power').addCost('metal', 100)
            .addProduction('power', 10),
];
