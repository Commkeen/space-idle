import { Resource } from '../models/resource';


export class ShipSystemDefinition {
  public name: string;
  public research: string;
  public baseCost: Resource[];
  public costMultiplier: number;
}
