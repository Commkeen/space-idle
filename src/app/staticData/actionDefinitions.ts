import { ResourceCollection, Resource } from "../models/resource";
import { Feature } from "../models/planet";
import { ActionService } from '../services/action.service';

export abstract class Action {
  public abstract doAction(actionService: ActionService);
}

export class AddResourceAction extends Action {
  public resource: Resource;
  constructor (resource: string, amount: number) {
    super();
    this.resource = new Resource(resource, amount);
  }

  doAction(actionService: ActionService) {
    actionService.addResource(this.resource);
  }
}

export class AddTheoryAction extends Action {

  constructor (public discipline: string, public amount: number) {
    super();
  }

  doAction(actionService: ActionService) {
    actionService.addTheory(this.discipline, this.amount);
  }
}

export class FlagAction extends Action {
  public flag: string;
  constructor (flag: string) {
    super();
    this.flag = flag;
  }

  doAction(actionService: ActionService) {
    actionService.setFlag(this.flag);
  }
}

export abstract class FeatureAction extends Action {
  doAction(actionService: ActionService) {};
  public abstract doFeatureAction(actionService: ActionService, regionId: number, targetFeature: Feature);
}

export class TransformFeatureAction extends FeatureAction {
  constructor(public newFeatureName: string) {
    super();
  }

  doFeatureAction(actionService: ActionService, regionId: number, targetFeature: Feature) {
    actionService.replaceFeature(regionId, targetFeature.instanceId, this.newFeatureName);
  }
}
