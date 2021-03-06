import { ResourceCollection } from './resource';

export class TooltipViewModel {
  name: string;
  desc: string;
  costs: ResourceCollection;
  consumption: ResourceCollection;
  production: ResourceCollection;
}
