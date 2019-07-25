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
  new UnsurveyedFeatureDefinition('mountain', 'mountainSurveyUpgrade',
    'Mountains are difficult for drones to navigate, but can be an excellent source of valuable minerals.'),
  new UnsurveyedFeatureDefinition('desert', 'desertSurveyUpgrade',
    'Deserts contain the possibility of oil reserves, as well as more exotic resources.'),
  new UnsurveyedFeatureDefinition('ocean', 'oceanSurveyUpgrade',
    'The ocean can hide a wealth of resources, and crossing them can lead to new lands.'),
  new UnsurveyedFeatureDefinition('coast', '', 'The coastline is rich in silicates, which can be used in electronics fabrication.'),
  new UnsurveyedFeatureDefinition('arctic', 'arcticSurveyUpgrade', 'The inhospitable cold of the arctic requires special drone upgrades.'),
  new UnsurveyedFeatureDefinition('abyssal crater', 'underseaSurveyUpgrade',
    'The deepest reaches of the planet\'s oceans.  What could be lurking down here?')
];

export const FEATURE_LIBRARY: FeatureDefinition[] = [
  new FeatureDefinition('depleted power core',
    'The power core is mostly spent, but with the right equipment it could still prove useful.', 'energy recombiner'),
  new FeatureDefinition('hematite deposit', 'A deposit of the iron-rich mineral hematite.', 'hematite mineshaft'),
  new FeatureDefinition('magnetite deposit', 'A deposit of the iron-rich mineral magnetite.', 'magnetite mineshaft'),
  new FeatureDefinition('corundum deposit', 'A deposit of the semi-precious crystalline mineral corundum.', 'corundum quarry'),
  new FeatureDefinition('copper deposit', 'A native deposit of metallic copper.', 'copper mineshaft'),
  new FeatureDefinition('silver vein', 'A native deposit of metallic silver.', 'silver mineshaft'),
  new FeatureDefinition('gold vein', 'A native deposit of metallic gold.', 'gold mineshaft'),
  new FeatureDefinition('lignite deposit',
                        'A deposit of lignite, a carbon-rich rock formed from long-decayed organic matter.', 'lignite mine'),
  new FeatureDefinition('bitumen deposit',
                        'A deposit of bitumen, a carbon-rich rock formed from long-decayed organic matter.', 'bitumen mine'),
  new FeatureDefinition('methane vent',
                        'The ground here emits methane, a simple gaseous hydrocarbon that can be used as fuel or in chemical engineering,' +
                        'as well as small amounts of other gases.',
                        'methane extractor'),
  new FeatureDefinition('glittersand spout',
                        'An unknown process, either geologic or organic, causes glittersand to erupt from the desert\'s depths at semi-regular intervals',
                        'crawler'),
  new FeatureDefinition('helium clathrates',
                        'The ice here has formed tight crystals which trap molecules of helium within their structure.',
                        'helium extractor'),
  new FeatureDefinition('charybdin crystals',
                        'Scans of this deep-sea mineral indicate its structure extends beyond three-dimensional space.',
                        'charybdin drill'),
  new FeatureDefinition('porphyritic synaptite',
                        'Tiny sparks of current run across the surface of this luminous mineral', 'synaptite scoop'),
  new FeatureDefinition('dyene cluster',
                        'This brittle material gives off a weak field which interferes with elementary particles.', 'dyene collector'),
  new FeatureDefinition('oil field',
                        'An underground deposit of crude oil - a liquid mixture of complex hydrocarbons with a variety of industrial uses.',
                        'oil drill')
];
