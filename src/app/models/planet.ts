import { ResourceCollection } from './resource';

export class Planet {
    instanceId: number;
    name: string;
    temperature: string;
    atmosphere: string;
    regions: Region[];
}

export class Region {
  public hiddenBehindRegion = 0;
  public hiddenBehindSurvey = 0;
  public features: Feature[] = [];
  constructor(
    public instanceId: number,
    public name: string
  ) {}

  public hideBehindInfrastructure(regionId: number, level: number): Region {
    this.hiddenBehindRegion = regionId;
    this.hiddenBehindSurvey = level;
    return this;
  }

  public addFeature(name: string, infrastructureLevel: number = 0): Region {
    const feature = new Feature(this.features.length, name);
    feature.hiddenBehindSurvey = infrastructureLevel;
    this.features.push(feature);
    return this;
  }

  public replaceFeature(oldFeatureId: number, newFeatureName: string): Region {
    this.features[oldFeatureId].name = newFeatureName;
    return this;
  }
}

export class Feature {

    public hiddenBehindSurvey = 1;
    constructor(
      public instanceId: number,
      public name: string
      ) {}
}

export const MOCK_SYSTEM: Planet[] = [
    {instanceId: 1, name: 'forest planet', temperature: 'temperate', atmosphere: 'oxygen', regions: [
        new Region(1, 'Plains')
          .addFeature('copper deposit')
          .addFeature('lignite deposit', 2)
          .addFeature('crater', 2)
          .addFeature('silver vein', 3),
        new Region(2, 'Hills')
          .hideBehindInfrastructure(1, 1)
          .addFeature('hematite deposit')
          .addFeature('lignite deposit')
          .addFeature('methane vent', 2),
        new Region(3, 'Mountain')
          .hideBehindInfrastructure(2, 1)
          .addFeature('silver vein')
    ]},
    {instanceId: 2, name: 'ice planet', temperature: 'frozen', atmosphere: 'oxygen', regions: [
      new Region(1, 'Plains')
        .addFeature('methane vent')
        .addFeature('dyene cluster', 1)
    ]}
];
