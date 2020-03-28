import { ResourceCollection, Resource } from "../models/resource";
import { Effect } from "./effectDefinitions";
import { Feature } from "../models/planet";
import { FeatureDefinition } from "./featureDefinitions";
import { PlanetService } from "../services/planet.service";
import { ResourceService } from '../services/resource.service';
import { FlagsService } from '../services/flags.service';

export abstract class Action {
  public abstract doAction(resourceSvc: ResourceService);
}

export class AddResourceAction extends Action {
  public resource: Resource;
  constructor (resource: string, amount: number) {
    super();
    this.resource = new Resource(resource, amount);
  }

  doAction(resourceSvc: ResourceService) {
    resourceSvc.globalResources.add(this.resource.resource, this.resource.amount);
  }
}

export class FlagAction extends Action {
  public flag: string;
  constructor (flag: string) {
    super();
    this.flag = flag;
  }

  doAction(resourceSvc: ResourceService) {
    // flagSvc.set(this.flag);
  }
}

export abstract class FeatureAction extends Action {
  doAction(resourceSvc: ResourceService) {};
  public abstract doFeatureAction(planetSvc: PlanetService, regionId: number, targetFeature: Feature);
}

export class TransformFeatureAction extends FeatureAction {
  constructor(public newFeatureName: string) {
    super();
  }

  doFeatureAction(planetSvc: PlanetService, regionId: number, targetFeature: Feature) {
    planetSvc.replaceFeature(regionId, targetFeature.instanceId, this.newFeatureName);
  }
}
