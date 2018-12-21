export class FeatureDefinition {
  constructor (
    public name: string,
    public description: string,
    public exploitName: string,
  ) {}
}

export const FEATURE_LIBRARY: FeatureDefinition[] = [
 new FeatureDefinition('iron deposit', 'placeholder for iron', 'iron mineshaft'),
 new FeatureDefinition('copper deposit', 'placeholder for copper', 'copper mineshaft'),
 new FeatureDefinition('methane vent', 'placeholder for methane', 'methane extractor')
];
