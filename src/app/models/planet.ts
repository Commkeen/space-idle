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
        new Feature(1, 'depleted power core', 'crash site', 10).gainOnSurvey('nanochips', 5),
        new Feature(2, 'iron deposit', 'hills', 10).hideBehindSurvey(1).gainOnSurvey('metal', 12),
        new Feature(3, 'copper deposit', 'forest', 20).hideBehindSurvey(1),
        new Feature(4, 'methane vent', 'forest', 10).hideBehindSurvey(3),
        new Feature(5, 'silver vein', 'mountain', 100).hideBehindSurvey(2),
        new Feature(6, 'iron deposit', 'coast', 50).hideBehindSurvey(3),
        new Feature(7, 'methane vent', 'ocean', 80).hideBehindSurvey(6),
        new Feature(8, 'silver vein', 'coast', 50).hideBehindSurvey(7),
        new Feature(9, 'iron deposit', 'hills', 50).hideBehindSurvey(8),
        new Feature(10, 'copper deposit', 'hills', 50).hideBehindSurvey(8),
        new Feature(11, 'iron deposit', 'desert', 50).hideBehindSurvey(9),
        new Feature(12, 'copper deposit', 'desert', 50).hideBehindSurvey(10),
        new Feature(13, 'glittersand spout', 'desert', 50).hideBehindSurvey(12),
        new Feature(14, 'gold vein', 'mountain', 50).hideBehindSurvey(11),
        new Feature(15, 'synaptite cluster', 'mountain', 50).hideBehindSurvey(13),
        new Feature(16, 'methane vent', 'ocean', 50).hideBehindSurvey(7),
        new Feature(17, 'methane vent', 'ocean', 50).hideBehindSurvey(7),
        new Feature(18, 'methane vent', 'ocean', 50).hideBehindSurvey(7),
        new Feature(19, 'methane vent', 'ocean', 50).hideBehindSurvey(16),
        new Feature(20, 'methane vent', 'ocean', 50).hideBehindSurvey(17),
        new Feature(21, 'methane vent', 'ocean', 50).hideBehindSurvey(18),
        new Feature(22, 'copper deposit', 'coast', 50).hideBehindSurvey(17),
        new Feature(23, 'helium clathrates', 'arctic', 50).hideBehindSurvey(22),
        new Feature(24, 'helium clathrates', 'arctic', 50).hideBehindSurvey(23),
        new Feature(25, 'helium clathrates', 'arctic', 50).hideBehindSurvey(23),
        new Feature(26, 'helium clathrates', 'arctic', 50).hideBehindSurvey(23),
        new Feature(27, 'charybdin crystals', 'abyssal crater', 50).hideBehindSurvey(16),
        new Feature(28, 'charybdin crystals', 'abyssal crater', 50).hideBehindSurvey(18),


    ]},
    {instanceId: 2, name: 'ice planet', temperature: 'frozen', atmosphere: 'oxygen', features: [
      new Feature(1, 'nitrogen sea', 'ocean', 40),
      new Feature(2, 'hydrogen vent', 'ocean', 40),
      new Feature(3, 'methane clathrates', 'tundra', 50),
      new Feature(4, 'titanium deposit', 'mountain', 40),
    ]}
];
