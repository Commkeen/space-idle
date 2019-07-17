import { Injectable } from '@angular/core';
import { ResourceService } from './resource.service';
import { TimeService } from './time.service';
import { PlanetService } from './planet.service';
import { STRUCTURE_LIBRARY } from '../staticData/structureDefinitions';
import { Structure, PlanetInteractionModel, DroneCollection } from '../models/planetInteractionModel';
import { ResourceCollection } from '../models/resource';
import { Feature } from '../models/planet';
import { EXPLOIT_LIBRARY } from '../staticData/exploitDefinitions';
import { FEATURE_LIBRARY } from '../staticData/featureDefinitions';
import { TASK_LIBRARY } from '../staticData/taskDefinitions';
import { BaseProductionEffect } from '../staticData/effectDefinitions';

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
    const interactionModel = this._planetService.getPlanetInteractionModel(instanceId);
    interactionModel.localResources.resetRates();
    this.updateDroneProductionRate(interactionModel.drones, interactionModel.localResources);
    interactionModel.features.features.forEach(feature => {
      if (feature.exploited) {
        const featureInstance = this._planetService.getFeature(feature.featureInstanceId, instanceId);
        this.updateFeatureProductionRate(featureInstance, interactionModel.localResources);
      }
    });
    interactionModel.structures.forEach(structure => {
      this.updateStructureProductionRate(structure, interactionModel.localResources);
    });
  }

  private updateFeatureProductionRate(feature: Feature, resources: ResourceCollection) {

    const featureDef = FEATURE_LIBRARY.find(x => x.name === feature.specificName);
    const exploitDef = EXPLOIT_LIBRARY.find(x => x.name === featureDef.exploitName);
    exploitDef.effects.forEach(element => {
      if (element instanceof BaseProductionEffect) {
        const resourceGen = (element as BaseProductionEffect);
        resources.addProductionRate(resourceGen.resource, resourceGen.amount);
      }
    });
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

  private updateDroneProductionRate(drones: DroneCollection, resources: ResourceCollection) {
    TASK_LIBRARY.forEach(task => {
      task.baseProduction.resources.forEach(resource => {
        resources.addProductionRate(resource.resource, resource.amount * drones.get(task.name));
      });
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
      if (resource.resource === 'power') {return; }
      this._resourceService.globalResources.add(resource.resource, resource.productionRate * (dT / 1000));
    });
  }
}
