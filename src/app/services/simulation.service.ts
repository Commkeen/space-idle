import { Injectable } from '@angular/core';
import { ResourceService } from './resource.service';
import { TimeService } from './time.service';
import { PlanetService } from './planet.service';
import { STRUCTURE_LIBRARY } from '../staticData/structureDefinitions';
import { Structure, PlanetInteractionModel, DroneCollection, RegionInteraction } from '../models/planetInteractionModel';
import { ResourceCollection } from '../models/resource';
import { Feature, Region } from '../models/planet';
import { EXPLOIT_LIBRARY } from '../staticData/exploitDefinitions';
import { FEATURE_LIBRARY } from '../staticData/featureDefinitions';
import { BaseProductionEffect, BaseConsumptionEffect, Effect, BaseRegionalPerDroneProductionEffect, StackingRegionalPerDroneProductionEffect } from '../staticData/effectDefinitions';

@Injectable({
  providedIn: 'root'
})
export class SimulationService {

  constructor(private _resourceService: ResourceService, private _timeService: TimeService, private _planetService: PlanetService) { }

  init() {
    this._timeService.tick.subscribe(x => this.update(x));

    this._resourceService.globalResources.setMax('metal', 10000000);
    this._resourceService.globalResources.setMax('rareMetal', 10000000);
    this._resourceService.globalResources.setMax('silicate', 10000000);
    this._resourceService.globalResources.setMax('hydrocarbon', 10000000);
    this._resourceService.globalResources.setMax('duranium', 10000000);
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
    const drones = interactionModel.drones;
    const regionInteractions = interactionModel.regions;
    regionInteractions.regions.forEach(regionInteraction => {
      const region = regions.find(x => x.instanceId === regionInteraction.regionInstanceId);
      const assignedDrones = drones.get(regionInteraction.regionInstanceId);
      this.updateRegionProductionRate(region, regionInteraction, assignedDrones, interactionModel.localResources);
    });

    interactionModel.structures.forEach(structure => {
      this.updateStructureProductionRate(structure, interactionModel.localResources);
    });
    interactionModel.structures.forEach(structure => {
      this.updateStructureConsumptionRate(structure, interactionModel.localResources);
    });
  }

  private updateRegionProductionRate(region: Region, regionInteraction: RegionInteraction,
                                      assignedDrones: number, resources: ResourceCollection) {
    const effects = this.getActiveEffectsForRegion(region, regionInteraction);
    const productionTotals = this.getProductionTotalsForEffects(effects, assignedDrones);
    productionTotals.resources.forEach(x => {
      resources.addProductionRate(x.resource, x.productionRate);
    });
  }

  private getProductionTotalsForEffects(effects: Effect[], assignedDrones: number): ResourceCollection {
    const results = new ResourceCollection();
    const baseProductionEffects = effects.filter(
      x => x instanceof BaseRegionalPerDroneProductionEffect) as BaseRegionalPerDroneProductionEffect[];
    const addedProductionEffects = effects.filter(
      x => x instanceof StackingRegionalPerDroneProductionEffect) as StackingRegionalPerDroneProductionEffect[];
    baseProductionEffects.forEach(x => {
      if (results.getProduction(x.resource) < x.amount) {
        results.setProductionRate(x.resource, x.amount);
      }
    });
    addedProductionEffects.forEach(x => {
      results.addProductionRate(x.resource, x.amount);
    });
    results.resources.forEach(x => {
      x.productionRate = x.productionRate * assignedDrones;
    });
    return results;
  }

  private getActiveEffectsForRegion(region: Region, regionInteraction: RegionInteraction): Effect[] {
    let result: Effect[] = [];
    region.features.forEach(feature => {
      const featureDef = FEATURE_LIBRARY.find(x => feature.name === x.name);
      const exploitDef = EXPLOIT_LIBRARY.find(x => featureDef.exploitName === x.name);
      result = result.concat(featureDef.effects);
      if (exploitDef && regionInteraction) {
        result = result.concat(exploitDef.effects);
      }
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

  private addNetLocalProductionRatesToGlobalProductionRates(instanceId) {
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
