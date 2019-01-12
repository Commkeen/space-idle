export class UnsurveyedFeatureDefinition {
  constructor (
    public name: string,
    public description: string,
  ) {}
}

export class FeatureDefinition {
  constructor (
    public name: string,
    public description: string,
    public exploitName: string,
  ) {}
}

export const UNSURVEYED_FEATURE_LIBRARY: UnsurveyedFeatureDefinition[] = [
  new UnsurveyedFeatureDefinition('hills', 'description for hills'),
  new UnsurveyedFeatureDefinition('forest', 'description for forest'),
  new UnsurveyedFeatureDefinition('mountain', 'description for mountain'),
  new UnsurveyedFeatureDefinition('desert', 'description for desert'),
  new UnsurveyedFeatureDefinition('ocean', 'description for ocean')
];

export const FEATURE_LIBRARY: FeatureDefinition[] = [
 new FeatureDefinition('iron deposit', 'placeholder for iron', 'iron mineshaft'),
 new FeatureDefinition('copper deposit', 'placeholder for copper', 'copper mineshaft'),
 new FeatureDefinition('methane vent', 'placeholder for methane', 'methane extractor')
];
