export class Planet {
    instanceId: number;
    name: string;
    temperature: string;
    atmosphere: string;
    features: Feature[];
}

export class Feature {

    constructor(
      public instanceId: number,
      public name: string,
      public surveyDifficulty: number
      ) {}
}

export const MOCK_SYSTEM: Planet[] = [
    {instanceId: 1, name: 'forest planet', temperature: 'temperate', atmosphere: 'oxygen', features: [
        new Feature(1, 'iron deposit', 40),
        new Feature(2, 'iron deposit', 40),
        new Feature(3, 'copper deposit', 50),
        new Feature(4, 'methane vent', 40),
    ]},
    {instanceId: 2, name: 'ice planet', temperature: 'frozen', atmosphere: 'oxygen', features: [
      new Feature(1, 'nitrogen sea', 40),
      new Feature(2, 'hydrogen vent', 40),
      new Feature(3, 'methane clathrates', 50),
      new Feature(4, 'titanium deposit', 40),
    ]}
];
