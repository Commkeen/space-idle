import { ResourceCollection } from './resource';
import { isNullOrUndefined } from 'util';

export class PlanetInteractionModel {
    planetInstanceId: number;
    structures: Structure[];
    features: FeatureInteractionCollection = new FeatureInteractionCollection();
    localResources: ResourceCollection;
}

export class Structure {
    name: string;
    amount: number;
    canBuild: boolean;
}

export class FeatureInteraction {
    featureInstanceId: number;
    discovered: boolean;
    surveyed: boolean;
    exploited: boolean;
}

export class FeatureInteractionCollection {
  features: FeatureInteraction[] = [];

  isDiscovered(id: number): boolean {
    return this.getFeature(id).discovered;
  }

  isSurveyed(id: number): boolean {
    return this.getFeature(id).surveyed;
  }

  isExploited(id: number): boolean {
    return this.getFeature(id).exploited;
  }

  discover(id: number): void {
    this.getFeature(id).discovered = true;
  }

  survey(id: number): void {
    this.getFeature(id).surveyed = true;
  }

  exploit(id: number): void {
    this.getFeature(id).exploited = true;
  }

  private getFeature(id: number): FeatureInteraction {
    let feature = this.features.find(x => x.featureInstanceId === id);
    if (isNullOrUndefined(feature)) {
      feature = new FeatureInteraction();
      feature.featureInstanceId = id;
      this.features.push(feature);
    }
    return feature;
  }
}
