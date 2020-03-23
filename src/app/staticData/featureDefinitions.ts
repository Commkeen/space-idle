import { Effect, BaseRegionalPerDroneProductionEffect } from "./effectDefinitions";
import { ResourceCollection } from "../models/resource";
import { FeatureAction } from "./actionDefinitions";
import { AbilityDefinition } from "./abilityDefinitions";

export class FeatureDefinition {
  public abilities: AbilityDefinition[] = [];
  public effects: Effect[] = [];
  public description = '';
  public exploitName = '';
  public gatherRates: ResourceCollection = new ResourceCollection();

  constructor (
    public name: string,
    description?: string,
    exploitName?: string
  ) {
    if (description) {
      this.description = description;
    }
    if (exploitName) {
      this.exploitName = exploitName;
    }
  }

  public addGather(resource: string, amount: number): FeatureDefinition {
    this.gatherRates.add(resource, amount);
    return this;
  }

  public addProduction(resource: string, amount: number): FeatureDefinition {
    const effect = new BaseRegionalPerDroneProductionEffect(resource, amount);
    this.effects.push(effect);
    return this;
  }

  public setDescription(desc: string): FeatureDefinition {
    this.description = desc;
    return this;
  }

  public setExploit(name: string): FeatureDefinition {
    this.exploitName = name;
    return this;
  }

  public addAbility(name: string, costResource: string, costAmount: number): FeatureDefinition {
    const ability = new AbilityDefinition();
    ability.name = name;
    if (costAmount > 0) {
      ability.addCost(costResource, costAmount);
    }
    this.abilities.push(ability);
    return this;
  }


}

export const FEATURE_LIBRARY: FeatureDefinition[] = [
  new FeatureDefinition('depleted power core',
    'The power core is mostly spent, but with the right equipment it could still prove useful.', 'energy recombiner'),
  new FeatureDefinition('crater',
    'A crater in the distance appears to have been recently made.')
    .addAbility('Search', 'drones', 1),
    // .addTransformAction('Search', 'crashed shuttle')
    // .addFlagAction()
  new FeatureDefinition('crashed shuttle',
    'The ship\'s reserve power is still functioning, along with basic fabrication systems.  It may be possible to repair the computer.'),
  new FeatureDefinition('downed shuttle',
    'With core systems repaired, the shuttle may be able to reach space with the help of a launch facility.'),
  new FeatureDefinition('hematite deposit', 'A deposit of the iron-rich mineral hematite.', 'hematite mineshaft')
  .addGather('metal', 2),
  new FeatureDefinition('magnetite deposit', 'A deposit of the iron-rich mineral magnetite.', 'magnetite mineshaft'),
  new FeatureDefinition('corundum deposit', 'A deposit of the semi-precious crystalline mineral corundum.', 'corundum quarry'),
  new FeatureDefinition('copper deposit', 'A native deposit of metallic copper.', 'copper mineshaft')
  .addGather('metal', 2),
  new FeatureDefinition('silver vein', 'A native deposit of metallic silver.', 'silver mineshaft')
  .addGather('rareMetal', 1),
  new FeatureDefinition('gold vein', 'A native deposit of metallic gold.', 'gold mineshaft'),
  new FeatureDefinition('lignite deposit',
                        'A deposit of lignite, a carbon-rich rock formed from long-decayed organic matter.', 'lignite mine')
  .addGather('hydrocarbon', 2),
  new FeatureDefinition('bitumen deposit',
                        'A deposit of bitumen, a carbon-rich rock formed from long-decayed organic matter.', 'bitumen mine'),
  new FeatureDefinition('methane vent',
                        'The ground here emits methane, a simple gaseous hydrocarbon that can be used as fuel or in chemical engineering,' +
                        'as well as small amounts of other gases.',
                        'methane extractor')
  .addGather('hydrocarbon', 3),
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
