import { ResourceCollection } from './resource';
import { isNullOrUndefined } from 'util';
import { Task, FeatureTask } from './task';

export class PlanetInteractionModel {
    planetInstanceId: number;
    structures: Structure[];
    regions: RegionInteractionCollection = new RegionInteractionCollection();
    localResources: ResourceCollection;
}

export class Structure {
    name: string;
    amount: number;
    active: number;
    canBuild: boolean;
}

export class FeatureInteraction {
  featureInstanceId: number;
  exploited: boolean;
  assignedDrones: number = 0;
  tasks: FeatureTask[] = [];
}

export class RegionInteraction {
  regionInstanceId: number;
  outpostLevel = 0;
  surveyLevel = 0;
  surveyProgress = 0;
  assignedDrones = 0;
  droneSlots = 0;
  nextOutpostLevelCost: ResourceCollection = null;
  features: FeatureInteraction[] = [];

  isFeatureExploited(feature: number): boolean {
    return this.getFeature(feature).exploited;
  }

  getFeature(featureId: number): FeatureInteraction {
    let feature = this.features.find(x => x.featureInstanceId === featureId);
    if (isNullOrUndefined(feature)) {
      feature = new FeatureInteraction();
      feature.featureInstanceId = featureId;
      this.features.push(feature);
    }
    return feature;
  }
}

export class RegionInteractionCollection {
  regions: RegionInteraction[] = [];

  getOutpostLevel(regionId: number): number {
    return this.getRegion(regionId).outpostLevel;
  }

  getSurveyLevel(regionId: number): number {
    return this.getRegion(regionId).surveyLevel;
  }

  getRegion(regionId: number): RegionInteraction {
    let region = this.regions.find(x => x.regionInstanceId === regionId);
    if (isNullOrUndefined(region)) {
      region = new RegionInteraction();
      region.regionInstanceId = regionId;
      this.regions.push(region);
    }
    return region;
  }

  getFeature(regionId: number, featureId: number): FeatureInteraction {
    const region = this.getRegion(regionId);
    return region.getFeature(featureId);
  }

  getRegionDroneSlots(regionId: number): number {
    return this.getRegion(regionId).droneSlots;
  }

  getRegionAssignedDrones(regionId: number): number {
    return this.getRegion(regionId).assignedDrones;
  }

  getTotalAssignedDrones(): number {
    return this.regions.map(x => x.assignedDrones).reduce((a, b) => {return a+b;});
  }

  getFeatureAssignedDrones(regionId: number, featureId: number): number {
    return this.getFeature(regionId, featureId).assignedDrones;
  }

  assignDrone(regionId: number, featureId: number) {
    this.getRegion(regionId).assignedDrones++;
    this.getFeature(regionId, featureId).assignedDrones++;
  }

  unassignDrone(regionId: number, featureId: number) {
    this.getRegion(regionId).assignedDrones--;
    this.getFeature(regionId, featureId).assignedDrones--;
  }
}
