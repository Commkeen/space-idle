import { Injectable } from '@angular/core';
import { Resource, ResourceCollection } from '../models/resource';

@Injectable({
  providedIn: 'root'
})
export class ResourceService {

  public globalResources: ResourceCollection = new ResourceCollection();

  constructor() { }

}
