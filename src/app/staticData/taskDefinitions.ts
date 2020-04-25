import { ResourceCollection } from '../models/resource';
import { Action } from './actionDefinitions';

export class TaskDefinition {
  name: string;
  desc: string = '';
  baseRate: number = 0.01;
  needed: number;
  startCost: ResourceCollection = new ResourceCollection();
  costPerSecond: ResourceCollection = new ResourceCollection();
  resultsOnComplete: Action[] = [];
  resultsPerTick: Action[] = [];
  repeatable: boolean = false;

  constructor(name: string, needed: number) {
    this.name = name;
    this.needed = needed;
  }
}
