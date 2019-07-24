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
        new Feature(2, 'hematite deposit', 'hills', 10).hideBehindSurvey(1).gainOnSurvey('metal', 12),
        new Feature(3, 'copper deposit', 'forest', 20).hideBehindSurvey(1),
        new Feature(4, 'methane vent', 'forest', 10).hideBehindSurvey(3),
        new Feature(5, 'silver vein', 'mountain', 100).hideBehindSurvey(2),
        new Feature(6, 'hematite deposit', 'coast', 20).hideBehindSurvey(3),
        new Feature(7, 'methane vent', 'ocean', 80).hideBehindSurvey(6),
        new Feature(8, 'silver vein', 'coast', 50).hideBehindSurvey(7),
        new Feature(9, 'magnetite deposit', 'hills', 50).hideBehindSurvey(8),
        new Feature(10, 'copper deposit', 'hills', 50).hideBehindSurvey(8),
        new Feature(11, 'magnetite deposit', 'desert', 50).hideBehindSurvey(9),
        new Feature(12, 'copper deposit', 'desert', 50).hideBehindSurvey(10),
        new Feature(13, 'glittersand spout', 'desert', 50).hideBehindSurvey(12),
        new Feature(14, 'gold vein', 'mountain', 50).hideBehindSurvey(11),
        new Feature(15, 'synaptite cluster', 'mountain', 50).hideBehindSurvey(13),
        new Feature(16, 'methane vent', 'ocean', 50).hideBehindSurvey(7),
        new Feature(17, 'oil field', 'ocean', 50).hideBehindSurvey(7),
        new Feature(18, 'methane vent', 'ocean', 50).hideBehindSurvey(7),
        new Feature(19, 'methane vent', 'ocean', 50).hideBehindSurvey(16),
        new Feature(20, 'oil field', 'ocean', 50).hideBehindSurvey(17),
        new Feature(21, 'methane vent', 'ocean', 50).hideBehindSurvey(18),
        new Feature(22, 'copper deposit', 'coast', 50).hideBehindSurvey(17),
        new Feature(23, 'helium clathrates', 'arctic', 50).hideBehindSurvey(22),
        new Feature(24, 'oil field', 'arctic', 50).hideBehindSurvey(23),
        new Feature(25, 'porphyritic synaptite', 'arctic', 50).hideBehindSurvey(23),
        new Feature(26, 'helium clathrates', 'arctic', 50).hideBehindSurvey(23),
        new Feature(27, 'charybdin crystals', 'abyssal crater', 50).hideBehindSurvey(16),
        new Feature(28, 'charybdin crystals', 'abyssal crater', 50).hideBehindSurvey(18),
        new Feature(29, 'dyene cluster', 'abyssal crater', 50).hideBehindSurvey(21),
        new Feature(30, 'oil field', 'hills', 30).hideBehindSurvey(4),
        new Feature(31, 'corundum deposit', 'hills', 30).hideBehindSurvey(2),
        new Feature(32, 'lignite deposit', 'forest', 30).hideBehindSurvey(2),
        new Feature(33, 'lignite deposit', 'forest', 30).hideBehindSurvey(4),
        new Feature(34, 'copper deposit', 'mountain', 100).hideBehindSurvey(2),
        new Feature(35, 'corundum deposit', 'mountain', 100).hideBehindSurvey(34),
        new Feature(36, 'hematite deposit', 'mountain', 100).hideBehindSurvey(34),
        new Feature(37, 'silver vein', 'mountain', 100).hideBehindSurvey(34),
        new Feature(38, 'oil field', 'mountain', 100).hideBehindSurvey(35),
        new Feature(39, 'magnetite deposit', 'mountain', 100).hideBehindSurvey(35),
        new Feature(40, 'bitumen deposit', 'mountain', 100).hideBehindSurvey(35),
        new Feature(41, 'magnetite deposit', 'mountain', 100).hideBehindSurvey(36),
        new Feature(42, 'bitumen deposit', 'mountain', 100).hideBehindSurvey(36),
        new Feature(43, 'copper deposit', 'mountain', 100).hideBehindSurvey(37),
        new Feature(44, 'methane vent', 'mountain', 100).hideBehindSurvey(37),
        new Feature(45, 'lignite deposit', 'forest', 30).hideBehindSurvey(3),
        new Feature(46, 'helium clathrates', 'arctic', 50).hideBehindSurvey(22),
        new Feature(47, 'gold vein', 'arctic', 50).hideBehindSurvey(22),
        new Feature(48, 'oil field', 'arctic', 50).hideBehindSurvey(25),
        new Feature(49, 'porphyritic synaptite', 'arctic', 50).hideBehindSurvey(26),
        new Feature(50, 'oil field', 'desert', 50).hideBehindSurvey(11),


    ]},
    {instanceId: 2, name: 'ice planet', temperature: 'frozen', atmosphere: 'oxygen', features: [
      new Feature(1, 'nitrogen sea', 'ocean', 40),
      new Feature(2, 'hydrogen vent', 'ocean', 40),
      new Feature(3, 'methane clathrates', 'tundra', 50),
      new Feature(4, 'titanium deposit', 'mountain', 40),
    ]}
];
