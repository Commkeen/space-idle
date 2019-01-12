export class Planet {
    instanceId: number;
    name: string;
    temperature: string;
    atmosphere: string;
    features: Feature[];
}

export class Feature {

    public hiddenBehindSurvey = 0;
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
}

export const MOCK_SYSTEM: Planet[] = [
    {instanceId: 1, name: 'forest planet', temperature: 'temperate', atmosphere: 'oxygen', features: [
        new Feature(1, 'iron deposit', 'hills', 40),
        new Feature(2, 'iron deposit', 'hills', 40),
        new Feature(3, 'copper deposit', 'hills', 50),
        new Feature(4, 'methane vent', 'forest', 40).hideBehindSurvey(3),
    ]},
    {instanceId: 2, name: 'ice planet', temperature: 'frozen', atmosphere: 'oxygen', features: [
      new Feature(1, 'nitrogen sea', 'ocean', 40),
      new Feature(2, 'hydrogen vent', 'ocean', 40),
      new Feature(3, 'methane clathrates', 'tundra', 50),
      new Feature(4, 'titanium deposit', 'mountain', 40),
    ]}
];
