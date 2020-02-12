import { ResourceCollection } from "../models/resource";
import { Effect } from "./effectDefinitions";
import { Feature } from "../models/planet";
import { FeatureDefinition } from "./featureDefinitions";
import { PlanetService } from "../services/planet.service";

export class Action {

}

export abstract class FeatureAction extends Action {
  abstract doAction(planetSvc: PlanetService, regionId: number, targetFeature: Feature);
}

export class TransformFeatureAction extends FeatureAction {
  constructor(public newFeatureName: string) {
    super();
  }

  doAction(planetSvc: PlanetService, regionId: number, targetFeature: Feature) {
    planetSvc.replaceFeature(regionId, targetFeature.instanceId, this.newFeatureName);
  }
}
