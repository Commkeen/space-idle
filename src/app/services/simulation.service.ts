import { Injectable } from '@angular/core';
import { ResourceService } from './resource.service';
import { TimeService } from './time.service';
import { PlanetService } from './planet.service';
import { STRUCTURE_LIBRARY } from '../staticData/structureDefinitions';
import { Structure, PlanetInteractionModel } from '../models/planetInteractionModel';
import { ResourceCollection } from '../models/resource';

@Injectable({
  providedIn: 'root'
})
export class SimulationService {

  constructor(private _resourceService: ResourceService, private _timeService: TimeService, private _planetService: PlanetService) { }

  init() {
    this._timeService.tick.subscribe(x => this.update(x));

    this._resourceService.globalResources.setMax('metal', 100);
    this._resourceService.globalResources.setMax('rareMetal', 100);
    this._resourceService.globalResources.setMax('silicate', 100);
    this._resourceService.globalResources.setMax('hydrocarbon', 100);
    this._resourceService.globalResources.setMax('duranium', 100);
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
    interactionModel.structures.forEach(structure => {
      this.updateStructureProductionRate(structure, interactionModel.localResources);
    });
  }

  private updateStructureProductionRate(structure: Structure, resources: ResourceCollection) {
    const structureDef = STRUCTURE_LIBRARY.find(x => x.name === structure.name);
    structureDef.production.forEach(resource => {
      resources.addProductionRate(resource.resource, resource.amount * structure.amount);
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

  private runStructureConsumptionAndProduction(dT: number, structure: Structure) {
    const structureDef = STRUCTURE_LIBRARY.find(x => x.name === structure.name);
    structureDef.production.forEach(resource => {
      this._resourceService.globalResources.add(resource.resource, resource.amount * structure.amount * (dT / 1000));
    });
  }
}
