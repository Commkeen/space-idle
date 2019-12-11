import { Injectable } from '@angular/core';
import { Resource, ResourceCollection } from '../models/resource';
import { TimeService } from './time.service';

@Injectable({
  providedIn: 'root'
})
export class ResourceService {

  public globalResources: ResourceCollection = new ResourceCollection();
  public discoveredResources: string[] = [];
  public energyRate = 0.15;

  constructor(private _timeService: TimeService) { }

  init() {
    this._timeService.tick.subscribe(x => this.update(x));
  }

  update(dt: number) {
    this.globalResources.resources.forEach(element => {
      if (!this.discoveredResources.includes(element.resource) && this.globalResources.has(element.resource)) {
        this.discoveredResources.push(element.resource);
      }
    });
  }

  canAfford(resources: Resource | ResourceCollection): boolean {
    let result = true;
    if (resources instanceof Resource) {
      return this.globalResources.has(resources.resource, resources.amount);
    }
    resources.resources.forEach(element => {
      if (!this.globalResources.has(element.resource, element.amount)) {
        result = false;
      }
    });
    return result;
  }

  spend(resources: Resource | ResourceCollection): boolean {
    let couldAfford = true;
    if (resources instanceof Resource) {
      return this.globalResources.remove(resources.resource, resources.amount);
    }
    if (!this.canAfford(resources)) { return false; }
    couldAfford = this.globalResources.removeCollection(resources);
    return couldAfford;
  }

  isDiscovered(resource: string): boolean {
    return this.discoveredResources.includes(resource);
  }

}
