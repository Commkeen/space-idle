import { ResourceCollection } from './resource';
import { isNullOrUndefined } from 'util';

export class PlanetInteractionModel {
    planetInstanceId: number;
    outpostLevel: 0;
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
}

export class RegionInteraction {
  regionInstanceId: number;
  outpostLevel = 0;
  surveyLevel = 0;
  surveyProgress = 0;
  assignedDrones = 0;
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

  isFeatureExploited(region: number, feature: number): boolean {
    return this.getRegion(region).isFeatureExploited(feature);
  }

  advanceOutpost(regionId: number) {
    this.getRegion(regionId).outpostLevel++;
  }

  getOutpostLevel(regionId: number): number {
    return this.getRegion(regionId).outpostLevel;
  }

  getSurveyLevel(regionId: number): number {
    return this.getRegion(regionId).surveyLevel;
  }

  exploit(region: number, feature: number): void {
    this.getFeature(region, feature).exploited = true;
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
}

export class DroneCollection {
  public droneCapacity = 0;
  private idleDrones = 0;
  private regionAssignments: Map<number, number> = new Map();

  get(regionId: number): number {
    if (this.regionAssignments.has(regionId)) {
      return this.regionAssignments.get(regionId);
    }
    return 0;
  }

  getIdle(): number {
    return this.idleDrones;
  }

  getTotal(): number {
    let total = this.idleDrones;
    for (const value of Array.from(this.regionAssignments.values())) {
      total += value;
    }
    return total;
  }

  createDrone(): void {
    this.idleDrones += 1;
  }

  assign(regionId: number): void {
    if (this.idleDrones <= 0) {
      return;
    }
    if (!this.regionAssignments.has(regionId)) {
      this.regionAssignments.set(regionId, 0);
    }
    this.regionAssignments.set(regionId, this.get(regionId) + 1);
    this.idleDrones -= 1;
  }

  unassign(regionId: number): void {
    if (this.get(regionId) > 0) {
      this.regionAssignments.set(regionId, this.get(regionId) - 1);
      this.idleDrones += 1;
    }
  }
}
