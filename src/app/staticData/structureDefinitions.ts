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

    // TODO: Move these into a proper service that can account for external bonuses and stuff
    public getProductionRates(): ResourceCollection {
      const production = new ResourceCollection();
      this.effects.forEach(element => {
        if (element instanceof BaseProductionEffect) {
          const resourceGen = (element as BaseProductionEffect);
          production.add(resourceGen.resource, resourceGen.amount);
        }
      });
      return production;
    }

    public getConsumptionRates(): ResourceCollection {
      const consumption = new ResourceCollection();
      this.effects.forEach(element => {
        if (element instanceof BaseConsumptionEffect) {
          const resourceGen = (element as BaseConsumptionEffect);
          consumption.add(resourceGen.resource, resourceGen.amount);
        }
      });
      return consumption;
    }


}

export const STRUCTURE_LIBRARY: StructureDefinition[] = [
    // Gathering
    new StructureDefinition('Mining Complex', 'gather').addCost('metal', 10).addConsumption('power', 10).addProduction('metal', 1),
    new StructureDefinition('Scanner Array', 'gather').addCost('metal', 100).addConsumption('power', 2).addProduction('survey', 0.2),

    // Refinement
    new StructureDefinition('Smelter', 'refine').addPrereq('Construction')
            .addCost('metal', 100)
            .addConsumption('power', 1).addConsumption('metal', 2)
            .addConsumption('hydrocarbon', 3)
            .addProduction('duranium', 0.2),
    new StructureDefinition('Electronics Lab', 'refine').addPrereq('Construction')
            .addCost('duranium', 10)
            .addConsumption('power', 1).addConsumption('silicate', 1)
            .addConsumption('rareMetal', 1)
            .addProduction('nanochips', 1),
    new StructureDefinition('Cryodistillery', 'refine').addPrereq('arcticSurveyUpgrade')
            .addCost('duranium', 30)
            .addConsumption('power', 1).addConsumption('gas', 1)
            .addProduction('cryofluid', 1),
    new StructureDefinition('Nanofiber Loom', 'refine').addPrereq('Tensile Polymers')
            .addCost('duranium', 40).addCost('nanochips', 20)
            .addConsumption('power', 1).addConsumption('hydrocarbon', 1)
            .addConsumption('silicate', 1)
            .addProduction('nanofiber', 1),
    new StructureDefinition('Optronics Workshop', 'refine').addPrereq('Photon Processing')
            .addCost('duranium', 100).addCost('nanochips', 50)
            .addConsumption('power', 1).addConsumption('glittersand', 1)
            .addConsumption('nanochips', 1).addConsumption('gas', 1)
            .addProduction('optronics', 1),
    new StructureDefinition('High-Energy Lab', 'refine').addPrereq('Electrodynamics')
            .addCost('duranium', 100).addCost('nanofiber', 20)
            .addConsumption('power', 1).addConsumption('rareMetal', 1)
            .addConsumption('cryofluid', 1)
            .addProduction('ultraconductors', 1),
    new StructureDefinition('Dimensional Forge', 'refine').addPrereq('Extradimensional Synthesis')
            .addCost('nanofiber', 50).addCost('optronics', 25)
            .addConsumption('power', 1).addConsumption('charybdin', 1)
            .addConsumption('nanofiber', 1).addConsumption('glittersand', 1)
            .addProduction('hyperlattice', 1),
    new StructureDefinition('Silksteel Foundry', 'refine').addPrereq('Unbreakable Materials')
            .addCost('duranium', 100).addCost('nanofiber', 20).addCost('optronics', 20)
            .addConsumption('power', 1).addConsumption('duranium', 1)
            .addConsumption('nanofiber', 1).addConsumption('cryofluid', 1)
            .addProduction('silksteel', 1),
    new StructureDefinition('Neurocomputing Lab', 'refine').addPrereq('Synthetic Thought')
            .addCost('silksteel', 30).addCost('optronics', 50)
            .addConsumption('power', 1).addConsumption('synaptite', 1)
            .addConsumption('optronics', 1).addConsumption('ultraconductors', 1)
            .addProduction('cogitex', 1),
    new StructureDefinition('Gravitics Lab', 'refine').addPrereq('Artificial Gravity')
            .addCost('silksteel', 50).addConsumption('optronics', 50)
            .addConsumption('power', 1).addConsumption('dyene', 1)
            .addConsumption('ultraconductors', 1)
            .addProduction('gravalloy', 1),

    // Power
    new StructureDefinition('Combustion Reactor', 'power').addCost('metal', 100)
            .addConsumption('hydrocarbon', 1.5)
            .addProduction('power', 10),
    new StructureDefinition('Solar Plant', 'power').addCost('metal', 100)
            .addProduction('power', 10),
];
