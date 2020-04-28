import { ResourceCollection } from '../models/resource';

export class InfrastructureDefinition {

  public description = '';
  public tech = '';
  public cost = new ResourceCollection();

  constructor(
    public name: string
  ) { }
}

export class RegionDefinition {

  public description = '';
  public surveyUpgradeNeeded = '';
  public surveyBaseCost: number = 10;
  public surveyCostMultiplier: number = 2.2;
  public droneHubBaseCost: ResourceCollection = new ResourceCollection();
  public droneHubCostMultiplier: number = 2.5;
  public infrastructure: InfrastructureDefinition[] = [];

  constructor(
    public name: string
  ) { }

  public setDescription(desc: string): RegionDefinition {
    this.description = desc;
    return this;
  }

  public setSurveyUpgradeNeeded(upgrade: string): RegionDefinition {
    this.surveyUpgradeNeeded = upgrade;
    return this;
  }

  public setSurveyBaseCost(cost: number): RegionDefinition {
    this.surveyBaseCost = cost;
    return this;
  }

  public setSurveyCostMultiplier(multiplier: number): RegionDefinition {
    this.surveyCostMultiplier = multiplier;
    return this;
  }

  public addDroneHubCost(resource: string, amount: number): RegionDefinition {
    this.droneHubBaseCost.add(resource, amount);
    return this;
  }

  public setDroneHubCostMultiplier(multiplier: number): RegionDefinition {
    this.droneHubCostMultiplier = multiplier;
    return this;
  }
}

export const REGION_LIBRARY: RegionDefinition[] = [
  new RegionDefinition('Plains').setDescription('Rolling plains.')
    .setSurveyBaseCost(10)
    .setSurveyCostMultiplier(2.3)
    .addDroneHubCost('metal', 2)
    .setDroneHubCostMultiplier(2.2),
  new RegionDefinition('Hills').setDescription('Geographically complex region rich in minerals.')
  .setSurveyBaseCost(25)
  .setSurveyCostMultiplier(2.4)
  .addDroneHubCost('metal', 2)
  .setDroneHubCostMultiplier(2.2),
  new RegionDefinition('Mountain').setDescription('Difficult to traverse, but can contain many valuable materials.')
  .setSurveyUpgradeNeeded('Mountain Survey')
  .setSurveyBaseCost(25)
  .setSurveyCostMultiplier(2.4)
  .addDroneHubCost('metal', 2)
  .setDroneHubCostMultiplier(2.2),
  new RegionDefinition('Coast').setDescription('Coast description.')
  .setSurveyBaseCost(25)
  .setSurveyCostMultiplier(2.4)
  .addDroneHubCost('metal', 2)
  .setDroneHubCostMultiplier(2.2),
  new RegionDefinition('Forest').setDescription('Forest description.')
  .setSurveyBaseCost(25)
  .setSurveyCostMultiplier(2.4)
  .addDroneHubCost('metal', 2)
  .setDroneHubCostMultiplier(2.2),
  new RegionDefinition('Ocean').setDescription('Ocean description.')
  .setSurveyUpgradeNeeded('Maritime Survey')
  .setSurveyBaseCost(25)
  .setSurveyCostMultiplier(2.4)
  .addDroneHubCost('metal', 2)
  .setDroneHubCostMultiplier(2.2),
  new RegionDefinition('Ocean Floor').setDescription('Ocean Floor description.')
  .setSurveyUpgradeNeeded('Undersea Survey')
  .setSurveyBaseCost(25)
  .setSurveyCostMultiplier(2.4)
  .addDroneHubCost('metal', 2)
  .setDroneHubCostMultiplier(2.2),
  new RegionDefinition('Desert').setDescription('Desert description.')
  .setSurveyUpgradeNeeded('Desert Survey')
  .setSurveyBaseCost(25)
  .setSurveyCostMultiplier(2.4)
  .addDroneHubCost('metal', 2)
  .setDroneHubCostMultiplier(2.2),
  new RegionDefinition('Arctic').setDescription('Arctic description.')
  .setSurveyUpgradeNeeded('Arctic Survey')
  .setSurveyBaseCost(25)
  .setSurveyCostMultiplier(2.4)
  .addDroneHubCost('metal', 2)
  .setDroneHubCostMultiplier(2.2),
];
