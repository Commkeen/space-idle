export class UnsurveyedFeatureDefinition {
  constructor (
    public name: string,
    public surveyTech: string,
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
  new UnsurveyedFeatureDefinition('crash site', '', 'The wreckage of a ship is visible in the distance.'),
  new UnsurveyedFeatureDefinition('hills', '', 'The rolling hills of geologically active planets often conceal valuable metal deposits.'),
  new UnsurveyedFeatureDefinition('forest', '',
    'Carbon-based plant life can be a useful source of hydrocarbons for manufacturing and energy production.'),
  new UnsurveyedFeatureDefinition('mountain', 'mountainSurveyUpgrade', 'description for mountain'),
  new UnsurveyedFeatureDefinition('desert', 'desertSurveyUpgrade', 'description for desert'),
  new UnsurveyedFeatureDefinition('ocean', 'oceanSurveyUpgrade', 'description for ocean'),
  new UnsurveyedFeatureDefinition('coast', '', 'description for coast'),
  new UnsurveyedFeatureDefinition('arctic', 'arcticSurveyUpgrade', 'description for arctic'),
  new UnsurveyedFeatureDefinition('abyssal crater', 'deepSeaSurveyUpgrade', 'description for abyssal crater')
];

export const FEATURE_LIBRARY: FeatureDefinition[] = [
  new FeatureDefinition('depleted power core',
    'The power core is mostly spent, but with the right equipment it could still prove useful.', 'energy recombiner'),
  new FeatureDefinition('iron deposit', 'placeholder for iron', 'iron mineshaft'),
  new FeatureDefinition('copper deposit', 'placeholder for copper', 'copper mineshaft'),
  new FeatureDefinition('silver vein', 'placeholder for silver', 'silver mineshaft'),
  new FeatureDefinition('gold vein', 'placeholder for gold', 'gold mineshaft'),
  new FeatureDefinition('', '', ''),
  new FeatureDefinition('methane vent', 'placeholder for methane', 'methane extractor'),
  new FeatureDefinition('glittersand spout', 'placeholder for glittersand', 'glittersand crawler'),
  new FeatureDefinition('helium clathrates', 'placeholder for helium', 'helium extractor'),
  new FeatureDefinition('charybdin crystals', 'placeholder for charybdin', 'charybdin drill'),
  new FeatureDefinition('synaptite cluster', 'placeholder for synaptite', 'synaptite scoop')
];
