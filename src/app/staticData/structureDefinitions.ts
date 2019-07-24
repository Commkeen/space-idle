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

    public hasConsumption(): boolean {
      return this.effects.some(element => element instanceof BaseConsumptionEffect);
    }


}

export const STRUCTURE_LIBRARY: StructureDefinition[] = [
    // Gathering
    new StructureDefinition('Mining Complex', 'gather').addCost('metal', 10).addConsumption('power', 1).addProduction('metal', 1),
    new StructureDefinition('Scanner Array', 'gather').addCost('nanochips', 40).addConsumption('power', 2).addProduction('survey', 0.6),

    // Refinement
    new StructureDefinition('Smelter', 'refine').addPrereq('Construction')
            .addCost('metal', 20)
            .addConsumption('power', 1).addConsumption('metal', 5)
            .addConsumption('hydrocarbon', 2)
            .addProduction('duranium', 0.2),
    new StructureDefinition('Electronics Lab', 'refine').addPrereq('Construction')
            .addCost('duranium', 10)
            .addConsumption('power', 2).addConsumption('silicate', 1)
            .addConsumption('rareMetal', 0.3)
            .addProduction('nanochips', 0.3),
    new StructureDefinition('Cryodistillery', 'refine').addPrereq('arcticSurveyUpgrade')
            .addCost('duranium', 30)
            .addConsumption('power', 3).addConsumption('gas', 2)
            .addProduction('cryofluid', 0.2),
    new StructureDefinition('Nanofiber Loom', 'refine').addPrereq('Tensile Polymers')
            .addCost('duranium', 40).addCost('nanochips', 20)
            .addConsumption('power', 2).addConsumption('hydrocarbon', 4)
            .addConsumption('silicate', 1)
            .addProduction('nanofiber', 0.2),
    new StructureDefinition('Optronics Workshop', 'refine').addPrereq('Photon Processing')
            .addCost('duranium', 100).addCost('nanochips', 50)
            .addConsumption('power', 2).addConsumption('glittersand', 1)
            .addConsumption('nanochips', 2).addConsumption('gas', 1)
            .addProduction('optronics', 0.2),
    new StructureDefinition('High-Energy Lab', 'refine').addPrereq('Electrodynamics')
            .addCost('duranium', 100).addCost('nanofiber', 20)
            .addConsumption('power', 4).addConsumption('rareMetal', 1)
            .addConsumption('cryofluid', 1)
            .addProduction('ultraconductors', 0.2),
    new StructureDefinition('Dimensional Forge', 'refine').addPrereq('Extradimensional Synthesis')
            .addCost('nanofiber', 50).addCost('optronics', 25)
            .addConsumption('power', 4).addConsumption('charybdin', 1)
            .addConsumption('nanofiber', 1).addConsumption('glittersand', 1)
            .addProduction('hyperlattice', 0.4),
    new StructureDefinition('Silksteel Foundry', 'refine').addPrereq('Unbreakable Materials')
            .addCost('duranium', 100).addCost('nanofiber', 20).addCost('optronics', 20)
            .addConsumption('power', 4).addConsumption('duranium', 10)
            .addConsumption('nanofiber', 5).addConsumption('cryofluid', 2)
            .addProduction('silksteel', 0.4),
    new StructureDefinition('Neurocomputing Lab', 'refine').addPrereq('Synthetic Thought')
            .addCost('silksteel', 30).addCost('optronics', 50)
            .addConsumption('power', 5).addConsumption('synaptite', 1)
            .addConsumption('optronics', 10).addConsumption('ultraconductors', 2)
            .addProduction('cogitex', 0.3),
    new StructureDefinition('Gravitics Lab', 'refine').addPrereq('Artificial Gravity')
            .addCost('silksteel', 50).addConsumption('optronics', 50)
            .addConsumption('power', 5).addConsumption('dyene', 1)
            .addConsumption('ultraconductors', 2)
            .addProduction('gravalloy', 0.5),

    // Power
    new StructureDefinition('Combustion Reactor', 'power')
            .addCost('metal', 10)
            .addConsumption('hydrocarbon', 1.5)
            .addProduction('power', 10),
    new StructureDefinition('Solar Plant', 'power').addPrereq('Electrodynamics')
            .addCost('duranium', 10).addCost('silicate', 100).addCost('ultraconductors', 5)
            .addProduction('power', 10)
];
