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
    public planetId: number,
    public instanceId: number,
    public name: string
  ) {}

  public hideBehindSurvey(regionId: number, level: number): Region {
    this.hiddenBehindRegion = regionId;
    this.hiddenBehindSurvey = level;
    return this;
  }

  public addFeature(name: string, infrastructureLevel: number = 1): Region {
    const feature = new Feature(this.planetId, this.instanceId, this.features.length, name);
    feature.hiddenBehindSurvey = infrastructureLevel;
    this.features.push(feature);
    return this;
  }

  public removeFeature(feature: Feature): Region {
    this.features.splice(this.features.indexOf(feature), 1);
    return this;
  }

  public replaceFeature(oldFeatureId: number, newFeatureName: string): Region {
    this.features.find(x => x.instanceId === oldFeatureId).name = newFeatureName;
    return this;
  }
}

export class Feature {

    public hiddenBehindSurvey = 1;
    constructor(
      public planetId: number,
      public regionId: number,
      public instanceId: number,
      public name: string
      ) {}
}

export const MOCK_SYSTEM: Planet[] = [
    {instanceId: 1, name: 'forest planet', temperature: 'temperate', atmosphere: 'oxygen', regions: [
        new Region(1, 1, 'Plains')
          .addFeature('copper deposit', 1)
          .addFeature('silver vein', 2)
          .addFeature('wrecked hull plating', 2)
          .addFeature('crater', 3)
          .addFeature('copper deposit', 4)
          .addFeature('wrecked hull plating', 4)
          .addFeature('lignite deposit', 5)
          .addFeature('corrupted databank', 5)
          .addFeature('energy cell', 6),
        new Region(1, 2, 'Hills')
          .hideBehindSurvey(1, 3)
          .addFeature('corundum deposit', 1)
          .addFeature('corrupted databank', 1)
          .addFeature('copper deposit', 2)
          .addFeature('energy cell', 2)
          .addFeature('lignite deposit', 3)
          .addFeature('corrupted databank', 3)
          .addFeature('gold vein', 4)
          .addFeature('wrecked hull plating', 5),
        new Region(1, 3, 'Forest')
          .hideBehindSurvey(1, 4)
          .addFeature('lignite deposit', 1)
          .addFeature('corrupted databank', 2),
        new Region(1, 4, 'Coast')
          .hideBehindSurvey(2, 2)
          .addFeature('waterlogged processing unit', 1)
          .addFeature('lignite deposit', 2)
          .addFeature('methane vent', 3),
        new Region(1, 5, 'Ocean')
          .hideBehindSurvey(4, 2)
          .addFeature('methane vent', 2)
          .addFeature('waterlogged processing unit', 3)
          .addFeature('undersea oil field', 4),
        new Region(1, 6, 'Ocean Floor')
          .hideBehindSurvey(5, 7)
          .addFeature('charybdin crystals', 4),
        new Region(1, 7, 'Mountain')
          .hideBehindSurvey(2, 3)
          .addFeature('hematite deposit', 2),
        new Region(1, 8, 'Desert')
          .hideBehindSurvey(7, 5)
          .addFeature('corundum deposit', 1)
          .addFeature('glittersand spout', 5),
        new Region(1, 9, 'Arctic')
          .hideBehindSurvey(5, 5)
          .addFeature('helium clathrates', 1)
          .addFeature('argon clathrates', 2)
          .addFeature('helium clathrates', 3)
          .addFeature('oil field', 4)
          .addFeature('dyene cluster', 5)
    ]},
    {instanceId: 2, name: 'ice planet', temperature: 'frozen', atmosphere: 'oxygen', regions: [
      new Region(1, 1, 'Plains')
        .addFeature('methane vent')
        .addFeature('dyene cluster', 1)
    ]}
];
