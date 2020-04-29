import { Effect } from "./effectDefinitions";
import { ResourceCollection } from "../models/resource";
import { FeatureAction, TransformFeatureAction, FlagAction, AddTheoryAction, GatherFeatureAction } from "./actionDefinitions";
import { FeatureAbilityDefinition } from "./abilityDefinitions";
import { TaskDefinition } from './taskDefinitions';

export class FeatureDefinition {
  public abilities: FeatureAbilityDefinition[] = [];
  public tasks: TaskDefinition[] = [];
  public effects: Effect[] = [];
  public description = '';
  public exploitName = '';
  public droneSlots = 0;
  public hasGather: boolean = false;
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

  public addGather(resource: string, amount: number, cooldown: number = 1.5): FeatureDefinition {
    if (!this.hasGather) {
      const gatherAbility = new FeatureAbilityDefinition();
      gatherAbility.name = 'Gather';
      gatherAbility.addAction(new GatherFeatureAction());
      gatherAbility.addCost('energy', 1);
      gatherAbility.addCooldown(cooldown);
      this.abilities.push(gatherAbility);
      this.droneSlots = 1;
      this.hasGather = true;
    }
    this.gatherRates.add(resource, amount);
    return this;
  }

  public setDescription(desc: string): FeatureDefinition {
    this.description = desc;
    return this;
  }

  public setDroneSlots(slots: number): FeatureDefinition {
    this.droneSlots = slots;
    return this;
  }

  public addAbility(name: string, costResource: string, costAmount: number): FeatureDefinition {
    const ability = new FeatureAbilityDefinition();
    ability.name = name;
    if (costAmount > 0) {
      ability.addCost(costResource, costAmount);
    }
    this.abilities.push(ability);
    return this;
  }

  public addAbilityCost(abilityName: string, costResource: string, costAmount: number): FeatureDefinition {
    const ability = this.abilities.find(x => x.name === abilityName);
    ability.addCost(costResource, costAmount);
    return this;
  }

  public abilityVisibleUpgrade(abilityName: string, upgrade: string): FeatureDefinition {
    const ability = this.abilities.find(x => x.name === abilityName);
    ability.setVisibleUpgrade(upgrade);
    return this;
  }

  public abilityNeedsDroneHub(abilityName: string, level: number = 1): FeatureDefinition {
    const ability = this.abilities.find(x => x.name === abilityName);
    ability.droneHubLevelNeeded = level;
    return this;
  }

  public addTransformAction(triggerAbilityName: string, newFeatureName: string): FeatureDefinition {
    const action = new TransformFeatureAction(newFeatureName);
    const ability = this.abilities.find(x => x.name === triggerAbilityName);
    ability.addAction(action);
    return this;
  }

  public addFlagAction(triggerAbilityName: string, flagName: string): FeatureDefinition {
    const action = new FlagAction(flagName);
    const ability = this.abilities.find(x => x.name === triggerAbilityName);
    ability.addAction(action);
    return this;
  }

  public addTask(name: string, needed: number): FeatureDefinition {
    const task = new TaskDefinition(name, needed);
    this.tasks.push(task);
    return this;
  }

  public addTaskResearchResult(taskName: string, discipline: string, amount: number): FeatureDefinition {
    const task = this.tasks.find(x => x.name === taskName);
    const action = new AddTheoryAction(discipline, amount);
    task.resultsOnComplete.push(action);
    return this;
  }

  public addTaskTransformResult(taskName: string, newFeatureName: string): FeatureDefinition {
    const task = this.tasks.find(x => x.name === taskName);
    const action = new TransformFeatureAction(newFeatureName);
    task.resultsOnComplete.push(action);
    return this;
  }
}

export const FEATURE_LIBRARY: FeatureDefinition[] = [
  new FeatureDefinition('crater',
    'A crater in the distance appears to have been recently made.')
    .addAbility('Search', 'drones', 1)
    .addTransformAction('Search', 'crashed shuttle')
    .addFlagAction('Search', 'shuttleFound'),
  new FeatureDefinition('crashed shuttle',
    'The ship\'s reserve power is still functioning, along with basic fabrication systems.  It may be possible to repair the computer.')
    .addAbility('Repair Computer', 'nanochips', 5)
    .addAbilityCost('Repair Computer', 'metal', 100)
    .addTransformAction('Repair Computer', 'downed shuttle')
    .addFlagAction('Repair Computer', 'computerRepaired')
    .addFlagAction('Repair Computer', 'showResearchTab'),
  new FeatureDefinition('downed shuttle',
    'With core systems repaired, the shuttle may be able to reach space with the help of a launch facility.'),

  new FeatureDefinition('hematite deposit', 'A deposit of the iron-rich mineral hematite.')
    .addGather('metal', 6),

  new FeatureDefinition('magnetite deposit', 'A deposit of the iron-rich mineral magnetite.')
    .addGather('metal', 12),

  new FeatureDefinition('copper deposit', 'A native deposit of metallic copper.')
  .addGather('metal', 2)
  .addAbility('Build Mine', 'metal', 50)
  .addTransformAction('Build Mine', 'copper mineshaft')
  .abilityVisibleUpgrade('Build Mine', 'Mineral Extraction'),
  new FeatureDefinition('copper mineshaft', 'A mineshaft built on a copper deposit.')
  .addGather('metal', 4)
  .setDroneSlots(4),

  new FeatureDefinition('silver vein', 'A native deposit of metallic silver.')
  .addGather('metal', 5, 5)
  .addGather('rareMetal', 1)
  .addAbility('Build Mine', 'metal', 250)
  .addTransformAction('Build Mine', 'silver mineshaft')
  .abilityVisibleUpgrade('Build Mine', 'Mineral Extraction'),
  new FeatureDefinition('silver mineshaft', 'A mineshaft built on a silver vein.')
  .addGather('metal', 8)
  .addGather('rareMetal', 2)
  .setDroneSlots(4),

  new FeatureDefinition('corundum deposit', 'A deposit of the semi-precious crystalline mineral corundum.')
  .addGather('silicate', 6)
  .addAbility('Build Mine', 'metal', 150)
  .addTransformAction('Build Mine', 'corundum quarry'),
  new FeatureDefinition('corundum quarry', 'A quarry for collecting minerals from a corundum deposit.')
  .addGather('silicate', 30)
  .setDroneSlots(6),

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
                        'An underground deposit of crude oil - a liquid mixture of complex hydrocarbons with a variety of industrial uses.')
  .addAbility('Drill Well', 'duranium', 50)
  .addTransformAction('Drill Well', 'oil well'),
  new FeatureDefinition('undersea oil field',
                        'A rich deposit of oil, deep under the ocean.')
  .addAbility('Drill Well', 'nanofiber', 50)
  .addTransformAction('Drill Well', 'oil well'),
  new FeatureDefinition('oil well',
                        'Extracts oil.')
  .addGather('hydrocarbon', 7)
  .setDroneSlots(8)
];
