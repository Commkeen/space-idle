import { ResourceCollection } from './resource';
import { isNullOrUndefined } from 'util';

export class PlanetInteractionModel {
    planetInstanceId: number;
    outpostLevel: 0;
    structures: Structure[];
    features: FeatureInteractionCollection = new FeatureInteractionCollection();
    localResources: ResourceCollection;
    drones: DroneCollection = new DroneCollection();
}

export class Structure {
    name: string;
    amount: number;
    active: number;
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

export class DroneCollection {
  public droneCapacity = 0;
  private idleDrones = 0;
  private tasks: Map<string, number> = new Map();

  get(task: string): number {
    if (this.tasks.has(task)) {
      return this.tasks.get(task);
    }
    return 0;
  }

  getIdle(): number {
    return this.idleDrones;
  }

  getTotal(): number {
    let total = this.idleDrones;
    for (const value of Array.from(this.tasks.values())) {
      total += value;
    }
    return total;
  }

  createDrone(): void {
    this.idleDrones += 1;
  }

  assign(task: string): void {
    if (this.idleDrones <= 0) {
      return;
    }
    if (!this.tasks.has(task)) {
      this.tasks.set(task, 0);
    }
    this.tasks.set(task, this.get(task) + 1);
    this.idleDrones -= 1;
  }

  unassign(task: string): void {
    if (this.get(task) > 0) {
      this.tasks.set(task, this.get(task) - 1);
      this.idleDrones += 1;
    }
  }

}
