import { Injectable } from '@angular/core';
import { FlagsService } from './flags.service';
import { PlanetService } from './planet.service';
import { ResourceService } from './resource.service';
import { Resource } from '../models/resource';
import { ResearchService } from './research.service';
import { Feature } from '../models/planet';

@Injectable({
  providedIn: 'root'
})
export class ActionService {

  constructor(private _flagService: FlagsService, private _planetService: PlanetService,
              private _resourceService: ResourceService, private _researchService: ResearchService) { }

  setFlag(flag: string) {
    this._flagService.set(flag);
  }

  addTheory(discipline: string, amount: number) {
    this._researchService.addTheory(discipline, amount);
  }

  addResource(resource: Resource) {
    this._resourceService.globalResources.add(resource.resource, resource.amount);
  }

  addMaxResource(resource: Resource) {
    this._resourceService.addMax(resource.resource, resource.amount);
  }

  addEnergyRate(amount: number) {
    this._resourceService.addEnergyRate(amount);
  }

  gatherFeature(feature: Feature) {
    this._planetService.gatherFeature(feature.regionId, feature.instanceId);
  }

  replaceFeature(regionId: number, featureInstanceId: number, newFeatureName: string) {
    this._planetService.replaceFeature(regionId, featureInstanceId, newFeatureName);
  }

  removeFeature(feature: Feature) {
    this._planetService.removeFeature(feature);
  }
}
