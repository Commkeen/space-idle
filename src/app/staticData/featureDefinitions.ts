import { Effect, BaseProductionEffect } from "./effectDefinitions";
import { ResourceCollection } from "../models/resource";
import { FeatureAction, TransformFeatureAction, FlagAction, AddTheoryAction, GatherFeatureAction, AddResourceAction, RemoveFeatureAction, AddMaxResourceAction } from "./actionDefinitions";
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

  public addGather(resource: string, amount: number, cooldown: number = 2.5): FeatureDefinition {
    if (!this.hasGather) {
      const gatherAbility = new FeatureAbilityDefinition();
      gatherAbility.name = 'Gather';
      gatherAbility.addAction(new GatherFeatureAction());
      gatherAbility.addCost('energy', 3);
      gatherAbility.addCooldown(cooldown);
      this.abilities.push(gatherAbility);
      this.droneSlots = 1;
      this.hasGather = true;
    }
    this.gatherRates.add(resource, amount);
    return this;
  }

  public addPower(amount: number): FeatureDefinition {
    const powerEffect = new BaseProductionEffect('power', amount);
    this.effects.push(powerEffect);
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

  public abilityNeedsUpgrade(abilityName: string, upgrade: string): FeatureDefinition {
    const ability = this.abilities.find(x => x.name === abilityName);
    ability.setUpgradeNeeded(upgrade);
    return this;
  }

  public abilityNeedsDroneHub(abilityName: string, level: number = 1): FeatureDefinition {
    const ability = this.abilities.find(x => x.name === abilityName);
    ability.droneHubLevelNeeded = level;
    return this;
  }

  public addResourceAction(triggerAbilityName: string, resource: string, amount: number): FeatureDefinition {
    const action = new AddResourceAction(resource, amount);
    const ability = this.abilities.find(x => x.name === triggerAbilityName);
    ability.addAction(action);
    return this;
  }

  public addMaxResourceAction(triggerAbilityName: string, resource: string, amount: number): FeatureDefinition {
    const action = new AddMaxResourceAction(resource, amount);
    const ability = this.abilities.find(x => x.name === triggerAbilityName);
    ability.addAction(action);
    return this;
  }

  public addResearchAction(triggerAbilityName: string, discipline: string, amount: number): FeatureDefinition {
    const action = new AddTheoryAction(discipline, amount);
    const ability = this.abilities.find(x => x.name === triggerAbilityName);
    ability.addAction(action);
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

  public addRemoveFeatureAction(triggerAbilityName: string): FeatureDefinition {
    const action = new RemoveFeatureAction();
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

  public addTaskRemoveResult(taskName: string): FeatureDefinition {
    const task = this.tasks.find(x => x.name === taskName);
    const action = new RemoveFeatureAction();
    task.resultsOnComplete.push(action);
    return this;
  }
}

export const FEATURE_LIBRARY: FeatureDefinition[] = [
  new FeatureDefinition('crater',
    'A crater in the distance appears to have been recently made.')
    .addAbility('Search', 'drones', 1)
    .addTransformAction('Search', 'crashed shuttle')
    .addMaxResourceAction('Search', 'energy', 5)
    .addFlagAction('Search', 'shuttleFound'),
  new FeatureDefinition('crashed shuttle',
    'The ship\'s reserve power is still functioning, along with basic fabrication systems.  It may be possible to repair the computer.')
    .addPower(5)
    .addAbility('Repair Computer', 'nanochips', 5)
    .addAbilityCost('Repair Computer', 'metal', 100)
    .addTransformAction('Repair Computer', 'downed shuttle')
    .addFlagAction('Repair Computer', 'computerRepaired')
    .addFlagAction('Repair Computer', 'showResearchTab'),
  new FeatureDefinition('downed shuttle',
    'With core systems repaired, the shuttle may be able to reach space with the help of a launch facility.')
    .addPower(5),

  new FeatureDefinition('wrecked hull plating',
    'This shredded plating is mostly useless, but some metals can be extracted from the remains.')
    .addAbility('Salvage', 'drones', 2)
    .addResourceAction('Salvage', 'metal', 50)
    .addResearchAction('Salvage', 'Material Science', 20)
    .addRemoveFeatureAction('Salvage'),
  new FeatureDefinition('corrupted databank',
    'Any data this may have contained is irretrievable, but the components could be salvaged.')
    .addAbility('Salvage', 'drones', 2)
    .addAbilityCost('Salvage', 'nanochips', 1)
    .addResourceAction('Salvage', 'nanochips', 8)
    .addResearchAction('Salvage', 'Electronics', 20)
    .addRemoveFeatureAction('Salvage'),
  new FeatureDefinition('waterlogged processing unit',
    'Seawater has destroyed most of the more delicate circuits, but some could be recovered.')
    .addAbility('Salvage', 'drones', 4)
    .abilityNeedsUpgrade('Salvage', 'Hydrophobic Alloys')
    .addResourceAction('Salvage', 'nanochips', 47)
    .addResearchAction('Salvage', 'Electronics', 20)
    .addRemoveFeatureAction('Salvage'),

  new FeatureDefinition('tectonic activity',
    'The geologic activity in this area could provide insight into new survey techniques.')
    .addTask('Study', 100)
    .addTaskResearchResult('Study', 'Planetary Survey', 20)
    .addTaskRemoveResult('Study'),
  new FeatureDefinition('resonance field',
    'Electromagnetic signals in this area are distorted and re-broadcast.  This effect could enhance drone control signals.')
    .addTask('Study', 100)
    .addTaskResearchResult('Study', 'Drone Control', 20)
    .addTaskRemoveResult('Study'),
  new FeatureDefinition('energy signature',
    'Energy readings in this area are inconsistent with the rest of the region.')
    .addTask('Study', 100)
    .addTaskResearchResult('Study', 'Power Systems', 20)
    .addTaskRemoveResult('Study'),
  new FeatureDefinition('electric storm',
    'A powerful storm is creating electromagnetic interference in a wide area.')
    .addTask('Study', 120)
    .addTaskResearchResult('Study', 'Power Systems', 20)
    .addTaskRemoveResult('Study'),
  new FeatureDefinition('graviton emissions',
    'Scanners are picking up faint graviton emissions inconsistent with the planet\'s mass.')
    .addTask('Study', 150)
    .addTaskResearchResult('Study', 'Gravitics', 20)
    .addTaskRemoveResult('Study'),
  new FeatureDefinition('spatial distortion',
    'An anomalous force is causing disruptions in local spacetime.')
    .addTask('Study', 150)
    .addTaskResearchResult('Study', 'Gravitics', 20)
    .addTaskRemoveResult('Study'),

  new FeatureDefinition('energy cell',
    'A mostly intact energy storage cell.  This could be refurbished and put to use.')
    .addAbility('Repair', 'drones', 5)
    .addAbilityCost('Repair', 'nanochips', 15)
    .addMaxResourceAction('Repair', 'energy', 5)
    .addResearchAction('Repair', 'Power Systems', 20)
    .addRemoveFeatureAction('Repair'),

  new FeatureDefinition('hematite deposit', 'A deposit of the iron-rich mineral hematite.')
  .addGather('metal', 18, 30)
  .addAbility('Build Mine', 'metal', 50)
  .addTransformAction('Build Mine', 'hematite mineshaft')
  .addResearchAction('Build Mine', 'Resource Exploitation', 5)
  .abilityVisibleUpgrade('Build Mine', 'Mineral Extraction'),
  new FeatureDefinition('hematite mineshaft', 'A mineshaft built on a hematite deposit.')
  .addGather('metal', 74, 30)
  .setDroneSlots(6),

  new FeatureDefinition('magnetite deposit', 'A deposit of the iron-rich mineral magnetite.')
  .addGather('metal', 26, 45)
  .addAbility('Build Mine', 'metal', 50)
  .addTransformAction('Build Mine', 'hematite mineshaft')
  .addResearchAction('Build Mine', 'Resource Exploitation', 5)
  .abilityVisibleUpgrade('Build Mine', 'Mineral Extraction'),
  new FeatureDefinition('hematite mineshaft', 'A mineshaft built on a hematite deposit.')
  .addGather('metal', 120, 45)
  .setDroneSlots(8),

  new FeatureDefinition('copper deposit', 'A native deposit of metallic copper.')
  .addGather('metal', 2)
  .addAbility('Build Mine', 'metal', 50)
  .addTransformAction('Build Mine', 'copper mineshaft')
  .addResearchAction('Build Mine', 'Resource Exploitation', 5)
  .abilityVisibleUpgrade('Build Mine', 'Mineral Extraction'),
  new FeatureDefinition('copper mineshaft', 'A mineshaft built on a copper deposit.')
  .addGather('metal', 4)
  .setDroneSlots(4),

  new FeatureDefinition('silver vein', 'A native deposit of metallic silver.')
  .addGather('metal', 14, 12)
  .addGather('rareMetal', 0.12)
  .addAbility('Build Mine', 'metal', 250)
  .addTransformAction('Build Mine', 'silver mineshaft')
  .addResearchAction('Build Mine', 'Resource Exploitation', 5)
  .abilityVisibleUpgrade('Build Mine', 'Mineral Extraction'),
  new FeatureDefinition('silver mineshaft', 'A mineshaft built on a silver vein.')
  .addGather('metal', 20)
  .addGather('rareMetal', 1)
  .setDroneSlots(4),

  new FeatureDefinition('corundum deposit', 'A deposit of the semi-precious crystalline mineral corundum.')
  .addGather('silicate', 6)
  .addAbility('Build Mine', 'metal', 150)
  .addTransformAction('Build Mine', 'corundum quarry')
  .addResearchAction('Build Mine', 'Resource Exploitation', 5)
  .abilityVisibleUpgrade('Build Mine', 'Mineral Extraction'),
  new FeatureDefinition('corundum quarry', 'A quarry for collecting minerals from a corundum deposit.')
  .addGather('silicate', 30)
  .setDroneSlots(6),

  new FeatureDefinition('gold vein', 'A native deposit of metallic gold.')
  .addGather('metal', 18, 14)
  .addGather('rareMetal', 0.18)
  .addAbility('Build Mine', 'metal', 350)
  .addTransformAction('Build Mine', 'gold mineshaft')
  .addResearchAction('Build Mine', 'Resource Exploitation', 5)
  .abilityVisibleUpgrade('Build Mine', 'Mineral Extraction'),
  new FeatureDefinition('gold mineshaft', 'A mineshaft built on a gold vein.')
  .addGather('metal', 24)
  .addGather('rareMetal', 1.5)
  .setDroneSlots(8),

  new FeatureDefinition('lignite deposit',
                        'A deposit of lignite, a carbon-rich rock formed from long-decayed organic matter.')
  .addGather('hydrocarbon', 3, 6)
  .addAbility('Build Mine', 'metal', 150)
  .addTransformAction('Build Mine', 'lignite mineshaft')
  .addResearchAction('Build Mine', 'Resource Exploitation', 5)
  .abilityVisibleUpgrade('Build Mine', 'Mineral Extraction'),
  new FeatureDefinition('lignite mineshaft', 'A mineshaft built on a lignite deposit.')
  .addGather('hydrocarbon', 15, 6)
  .setDroneSlots(4),

  new FeatureDefinition('bitumen deposit',
                        'A deposit of bitumen, a carbon-rich rock formed from long-decayed organic matter.')
  .addGather('hydrocarbon', 5, 12)
  .addAbility('Build Mine', 'metal', 275)
  .addTransformAction('Build Mine', 'bitumen mineshaft')
  .addResearchAction('Build Mine', 'Resource Exploitation', 5)
  .abilityVisibleUpgrade('Build Mine', 'Mineral Extraction'),
  new FeatureDefinition('bitumen mineshaft', 'A mineshaft built on a bitumen deposit.')
  .addGather('hydrocarbon', 28, 12)
  .setDroneSlots(6),

  new FeatureDefinition('methane vent',
                        'The ground here emits methane, a simple gaseous hydrocarbon that can be used as fuel or in chemical engineering,' +
                        'as well as small amounts of other gases.')
  .addAbility('Build Extractor', 'duranium', 25)
  .addTransformAction('Build Extractor', 'methane extractor')
  .addResearchAction('Build Extractor', 'Resource Exploitation', 5)
  .abilityVisibleUpgrade('Build Extractor', 'Gas Extraction'),
  new FeatureDefinition('methane extractor', 'Extracts methane and refines it into hydrocarbons.')
  .addGather('hydrocarbon', 6, 50)
  .setDroneSlots(15),

  new FeatureDefinition('glittersand spout',
                        'An unknown process, either geologic or organic, causes glittersand to erupt from the desert\'s depths at semi-regular intervals')
  .addAbility('Build Crawler', 'duranium', 250)
  .addTransformAction('Build Crawler', 'glittersand crawler')
  .addResearchAction('Build Crawler', 'Resource Extraction', 10)
  .abilityVisibleUpgrade('Build Crawler', 'Particulate Enrichment'),
  new FeatureDefinition('glittersand crawler', 'Harvests glittersand from desert spouts.')
  .addGather('glittersand', 5, 50)
  .setDroneSlots(12),

  new FeatureDefinition('helium clathrates',
                        'The ice here has formed tight crystals which trap molecules of helium within their structure.')
  .addAbility('Build Extractor', 'duranium', 150)
  .addTransformAction('Build Extractor', 'helium extractor')
  .addResearchAction('Build Extractor', 'Resource Exploitation', 5)
  .abilityVisibleUpgrade('Build Extractor', 'Clathrate Extraction'),
  new FeatureDefinition('helium extractor', 'Extracts helium from ice fields.')
  .addGather('gas', 6, 50)
  .setDroneSlots(15),

  new FeatureDefinition('argon clathrates',
                        'The ice here has formed tight crystals which trap molecules of argon within their structure.')
  .addAbility('Build Extractor', 'duranium', 250)
  .addTransformAction('Build Extractor', 'argon extractor')
  .addResearchAction('Build Extractor', 'Resource Exploitation', 5)
  .abilityVisibleUpgrade('Build Extractor', 'Clathrate Extraction'),
  new FeatureDefinition('argon extractor', 'Extracts argon from ice fields.')
  .addGather('gas', 15, 50)
  .setDroneSlots(18),

  new FeatureDefinition('charybdin crystals',
                        'Scans of this deep-sea mineral indicate its structure extends beyond three-dimensional space.')
  .addAbility('Drill', 'silksteel', 150)
  .addTransformAction('Drill', 'charybdin drill')
  .addResearchAction('Drill', 'Resource Exploitation', 25)
  .abilityVisibleUpgrade('Drill', 'Crystal Extraction'),
  new FeatureDefinition('charybdin drill', 'Extracts charybdin from deep undersea crystals.')
  .addGather('charybdin', 4, 90)
  .setDroneSlots(8),

  new FeatureDefinition('porphyritic synaptite',
                        'Tiny sparks of current run across the surface of this luminous mineral')
  .addAbility('Build Scoop', 'nanofiber', 150)
  .addTransformAction('Build Scoop', 'synaptite scoop')
  .addResearchAction('Build Scoop', 'Resource Exploitation', 25)
  .abilityVisibleUpgrade('Build Scoop', 'Crystal Extraction'),
  new FeatureDefinition('synaptite scoop', 'An intricate device for extracting synaptite without damaging its delicate subatomic structure.')
  .addGather('synaptite', 4, 90)
  .setDroneSlots(8),

  new FeatureDefinition('dyene cluster',
                        'This brittle material gives off a weak field which interferes with elementary particles.', 'dyene collector')
  .addAbility('Build Collector', 'optronics', 150)
  .addTransformAction('Build Collector', 'dyene collector')
  .addResearchAction('Build Collector', 'Resource Exploitation', 25)
  .abilityVisibleUpgrade('Build Collector', 'Crystal Extraction'),
  new FeatureDefinition('dyene collector', 'Provides drones with the necessary telemetry to extract dyene.')
  .addGather('dyene', 4, 90)
  .setDroneSlots(8),

  new FeatureDefinition('oil field',
                        'An underground deposit of crude oil - a liquid mixture of complex hydrocarbons with a variety of industrial uses.')
  .addAbility('Drill Well', 'duranium', 50)
  .addTransformAction('Drill Well', 'oil well')
  .addResearchAction('Drill Well', 'Resource Exploitation', 5)
  .abilityVisibleUpgrade('Drill Well', 'Liquid Extraction'),
  new FeatureDefinition('undersea oil field',
                        'A rich deposit of oil, deep under the ocean.')
  .addAbility('Drill Well', 'nanofiber', 50)
  .addTransformAction('Drill Well', 'oil well')
  .addResearchAction('Drill Well', 'Resource Exploitation', 5)
  .abilityVisibleUpgrade('Drill Well', 'Liquid Extraction'),
  new FeatureDefinition('oil well',
                        'Extracts oil.')
  .addGather('hydrocarbon', 7)
  .setDroneSlots(8)
];
