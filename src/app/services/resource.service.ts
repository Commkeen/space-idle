import { Injectable } from '@angular/core';
import { Resource, ResourceCollection } from '../models/resource';
import { TimeService } from './time.service';

@Injectable({
  providedIn: 'root'
})
export class ResourceService {

  public globalResources: ResourceCollection = new ResourceCollection();
  public discoveredResources: string[] = [];

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

  isDiscovered(resource: string): boolean {
    return this.discoveredResources.includes(resource);
  }

}
