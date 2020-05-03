import { Injectable } from '@angular/core';
import { ResourceService } from './resource.service';
import { TimeService } from './time.service';
import { PlanetService } from './planet.service';
import { STRUCTURE_LIBRARY } from '../staticData/structureDefinitions';
import { Structure, RegionInteraction, FeatureInteraction } from '../models/planetInteractionModel';
import { ResourceCollection } from '../models/resource';
import { Feature, Region } from '../models/planet';
import { EXPLOIT_LIBRARY } from '../staticData/exploitDefinitions';
import { FEATURE_LIBRARY } from '../staticData/featureDefinitions';
import { BaseProductionEffect, BaseConsumptionEffect, Effect } from '../staticData/effectDefinitions';

@Injectable({
  providedIn: 'root'
})
export class SimulationService {

  constructor(private _resourceService: ResourceService, private _timeService: TimeService, private _planetService: PlanetService) { }

  init() {
    this._timeService.tick.subscribe(x => this.update(x));

    this._resourceService.globalResources.setMax('drones', 50);
    this._resourceService.globalResources.setMax('metal', 5000);
    this._resourceService.globalResources.setMax('rareMetal', 5000);
    this._resourceService.globalResources.setMax('silicate', 5000);
    this._resourceService.globalResources.setMax('hydrocarbon', 5000);
    this._resourceService.globalResources.setMax('duranium', 5000);

    this._resourceService.globalResources.setMax('energy', 10);
    this._resourceService.globalResources.add('energy', 10);

    this._resourceService.globalResources.add('metal', 5);

    //this._resourceService.globalResources.add('drones', 50);
    //this._resourceService.globalResources.add('metal', 5000);
    //this._resourceService.globalResources.add('silicate', 5000);
    //this._resourceService.globalResources.add('rareMetal', 5000);
    //this._resourceService.globalResources.add('hydrocarbon', 5000);
    //this._resourceService.globalResources.add('nanochips', 5000);
  }

  reset() {

  }

  update(dT: number) {
    const globalResources = this._resourceService.globalResources;
    globalResources.resetRates();
    const system = this._planetService.getCurrentSystem();
    system.forEach(planet => {
      this.updatePlanet(dT, planet.instanceId);
    });
    this.updateEnergy(dT);
  }

  private updateEnergy(dT: number) {
    this._resourceService.globalResources.add('energy', this._resourceService.energyRate * (dT/1000));
  }

  private updatePlanet(dT: number, instanceId: number) {
    this.updateLocalPlanetProductionRates(instanceId);
    this.addNetLocalProductionRatesToGlobalProductionRates(instanceId);
    this.runPlanetProduction(dT, instanceId);
  }

  private updateLocalPlanetProductionRates(instanceId: number) {
    const regions = this._planetService.getPlanet(instanceId).regions;
    const interactionModel = this._planetService.getPlanetInteractionModel(instanceId);
    interactionModel.localResources.resetRates();
    const regionInteractions = interactionModel.regions;
    regionInteractions.regions.forEach(regionInteraction => {
      const region = regions.find(x => x.instanceId === regionInteraction.regionInstanceId);
      if (regionInteraction.surveyLevel == 0) {return;}
      regionInteraction.features.forEach(featureInteraction => {
        const feature = region.features.find(x => x.instanceId === featureInteraction.featureInstanceId);
        if (feature.hiddenBehindSurvey > regionInteraction.surveyLevel) {return;}
        const assignedDrones = featureInteraction.assignedDrones;
        this.updateFeatureProductionRate(feature, featureInteraction, assignedDrones, interactionModel.localResources);
      });
    });

    interactionModel.structures.forEach(structure => {
      this.updateStructureProductionRate(structure, interactionModel.localResources);
    });
    interactionModel.structures.forEach(structure => {
      this.updateStructureConsumptionRate(structure, interactionModel.localResources);
    });
  }

  private updateFeatureProductionRate(feature: Feature, featureInteraction: FeatureInteraction,
                                      assignedDrones: number, resources: ResourceCollection) {
    const def = FEATURE_LIBRARY.find(x => feature.name === x.name);
    if (def.hasGather && assignedDrones <= 0) {
      def.gatherRates.resources.forEach(x => {
        resources.addProductionRate(x.resource, x.amount * assignedDrones * 0.05);
      });
    }

    def.effects.forEach(e => {
      if (e instanceof BaseProductionEffect) {
        resources.addProductionRate(e.resource, e.amount);
      }
      if (e instanceof BaseConsumptionEffect) {
        resources.addConsumptionRate(e.resource, e.amount);
      }
    })
  }

  private getActiveEffectsForRegion(region: Region, regionInteraction: RegionInteraction): Effect[] {
    let result: Effect[] = [];
    region.features.forEach(feature => {
      const featureDef = FEATURE_LIBRARY.find(x => feature.name === x.name);
      result = result.concat(featureDef.effects);
    });
    return result;
  }

  private updateStructureProductionRate(structure: Structure, resources: ResourceCollection) {
    const structureDef = STRUCTURE_LIBRARY.find(x => x.name === structure.name);
    structureDef.effects.forEach(element => {
      if (element instanceof BaseProductionEffect) {
        const resourceGen = (element as BaseProductionEffect);
        resources.addProductionRate(resourceGen.resource, resourceGen.amount * structure.active);
      }
    });
  }

  // Adds resource consumption to local resources.
  // If consumption ends up higher than production, spend from global stockpile to make it up.
  // If we can't, power down to a sustainable number of buildings.
  private updateStructureConsumptionRate(structure: Structure, resources: ResourceCollection) {
    const structureDef = STRUCTURE_LIBRARY.find(x => x.name === structure.name);

    const currentActive = structure.active;
    let finalActive = structure.active;
    const consumption = new ResourceCollection();

    // Add all possible consumption, but move finalActive down to the max sustainable amount of active structures
    structureDef.effects.forEach(element => {
      if (element instanceof BaseConsumptionEffect) {
        const resource = (element as BaseConsumptionEffect).resource;
        const amountPerActive = (element as BaseConsumptionEffect).amount;
        const consumeRate = amountPerActive * currentActive;
        consumption.add(resource, consumeRate);
        const prodRate = resources.getNetProduction(resource);
        const stock = this._resourceService.globalResources.getAmount(resource);
        if (prodRate + stock < consumeRate) {
          const deficit = consumeRate - (prodRate + stock);
          const deficitBldgs = Math.ceil(deficit / amountPerActive);
          finalActive = Math.min(finalActive, currentActive - deficitBldgs);
        }
      }
    });

    // If we ended up needing to power down structures, power them down and reduce consumption accordingly
    if (finalActive < currentActive) {
      structure.active = finalActive;
      structureDef.effects.forEach(element => {
        const resource = (element as BaseConsumptionEffect).resource;
        const amountPerActive = (element as BaseConsumptionEffect).amount;
        consumption.remove(resource, amountPerActive * (currentActive - finalActive));
      });
    }

    consumption.resources.forEach(resource => {
      resources.addConsumptionRate(resource.resource, resource.amount);
    });
  }

  private addNetLocalProductionRatesToGlobalProductionRates(instanceId: number) {
    const interactionModel = this._planetService.getPlanetInteractionModel(instanceId);
    interactionModel.localResources.resources.forEach(resource => {
      this._resourceService.globalResources.addProductionRate(resource.resource, resource.productionRate);
    });
  }

  private runPlanetProduction(dT: number, instanceId: number) {
    const interactionModel = this._planetService.getPlanetInteractionModel(instanceId);
    interactionModel.localResources.resources.forEach(resource => {
      if (resource.isPower()) { return; }
      const production = resource.getNetProductionRate();
      if (production > 0) {
        this._resourceService.globalResources.add(resource.resource, production * (dT / 1000));
      } else {
        this._resourceService.globalResources.remove(resource.resource, Math.abs(production * (dT / 1000)));
      }
    });
  }
}
