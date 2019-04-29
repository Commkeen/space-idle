import { ResourceCollection } from "./resource";

export class Planet {
    instanceId: number;
    name: string;
    temperature: string;
    atmosphere: string;
    features: Feature[];
}

export class Feature {

    public hiddenBehindSurvey = 0;
    public resourcesOnSurvey: ResourceCollection = new ResourceCollection();
    constructor(
      public instanceId: number,
      public specificName: string,
      public genericName: string,
      public surveyCost: number
      ) {}

    public hideBehindSurvey(featureId: number): Feature {
      this.hiddenBehindSurvey = featureId;
      return this;
    }

    public gainOnSurvey(resource: string, amount: number): Feature {
      this.resourcesOnSurvey.add(resource, amount);
      return this;
    }
}

export const MOCK_SYSTEM: Planet[] = [
    {instanceId: 1, name: 'forest planet', temperature: 'temperate', atmosphere: 'oxygen', features: [
        new Feature(1, 'depleted power core', 'crash site', 40).gainOnSurvey('electronics', 5),
        new Feature(2, 'iron deposit', 'hills', 40).hideBehindSurvey(1).gainOnSurvey('metal', 12),
        new Feature(3, 'copper deposit', 'forest', 50).hideBehindSurvey(1),
        new Feature(4, 'methane vent', 'forest', 40).hideBehindSurvey(3),
        new Feature(5, 'silver vein', 'mountain', 100).hideBehindSurvey(2),
        new Feature(6, 'iron deposit', 'coast', 50).hideBehindSurvey(3),
        new Feature(7, 'hydrogen vent', 'ocean', 80).hideBehindSurvey(6)
    ]},
    {instanceId: 2, name: 'ice planet', temperature: 'frozen', atmosphere: 'oxygen', features: [
      new Feature(1, 'nitrogen sea', 'ocean', 40),
      new Feature(2, 'hydrogen vent', 'ocean', 40),
      new Feature(3, 'methane clathrates', 'tundra', 50),
      new Feature(4, 'titanium deposit', 'mountain', 40),
    ]}
];
