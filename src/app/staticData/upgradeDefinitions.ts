import { Resource, ResourceCollection } from '../models/resource';
import { Effect } from './effectDefinitions';
import { Action, FlagAction } from './actionDefinitions';

export class UpgradeDefinition {
  public cost: ResourceCollection = new ResourceCollection();
  public effects: Effect[] = [];
  public actions: Action[] = [];
  public friendlyName: string;
  constructor(
    public name: string,
    public description: string,
    public researchNeeded?: string
  ) {
    this.friendlyName = name;
  }

  public addCost(resource: string, amount: number): UpgradeDefinition {
    this.cost.add(resource, amount);
    return this;
  }

  public addAction(action: Action): UpgradeDefinition {
    this.actions.push(action);
    return this;
  }

  public setsFlag(flag: string): UpgradeDefinition {
    const action = new FlagAction(flag);
    this.addAction(action);
    return this;
  }

}

export const UPGRADE_LIBRARY: UpgradeDefinition[] = [
  new UpgradeDefinition('Construction', 'Large scale construction projects.')
  .addCost('metal', 50)
  .setsFlag('showStructureTab'),
  new UpgradeDefinition('Hydrophobic Alloys', 'Waterproofed drones for aquatic salvage operations.')
  .addCost('metal', 75),
  new UpgradeDefinition('Tensile Polymers', 'High-strength, lightweight polymers for advanced construction.')
  .addCost('duranium', 15)
  .addCost('silicate', 50),
  new UpgradeDefinition('Unbreakable Materials', 'Engineered at the subatomic level to withstand extreme stress.')
  .addCost('duranium', 15)
  .addCost('silicate', 50),

  new UpgradeDefinition('Automated Fabrication', 'Scale up the nanochip fabrication process for bulk production.')
  .addCost('nanochips', 8),
  new UpgradeDefinition('Photon Processing', 'Using glittersand to manipulate photon waveforms provides a new foundation for electronic engineering.')
  .addCost('nanochips', 35)
  .addCost('glittersand', 15),
  new UpgradeDefinition('Synthetic Thought', 'The neural patterns in synaptite form the basis of self-adaptive, intelligent networks.')
  .addCost('optronics', 35)
  .addCost('synaptite', 15),

  new UpgradeDefinition('Extradimensional Synthesis', '4-dimensional crystalloid materials allow construction to extend beyond mundane limits.')
  .addCost('charybdin', 35),

  new UpgradeDefinition('Fueled Generators', 'On planets rich with oxygen and organic molecules, burning hydrocarbons can be a simple, effective power source.')
  .addCost('hydrocarbon', 25),
  new UpgradeDefinition('Electrodynamics', 'As power needs increase, the inefficiencies of typical conductive materials become a problem.')
  .addCost('cryofluid', 15),
  new UpgradeDefinition('Solar Power', '')
  .addCost('ultraconductors', 15),

  new UpgradeDefinition('Artificial Gravity', '')
  .addCost('dyene', 15),

  new UpgradeDefinition('Maritime Survey', '')
  .addCost('metal', 15),
  new UpgradeDefinition('Mountain Survey', '')
  .addCost('duranium', 15),
  new UpgradeDefinition('Desert Survey', '')
  .addCost('duranium', 15),
  new UpgradeDefinition('Arctic Survey', '')
  .addCost('duranium', 15),
  new UpgradeDefinition('Undersea Survey', '')
  .addCost('duranium', 15),

  new UpgradeDefinition('Bandwidth Multiplexing', '')
  .addCost('nanochips', 15),
  new UpgradeDefinition('Adaptive Tooling', '')
  .addCost('optronics', 15),
  new UpgradeDefinition('Heuristic Processors', '')
  .addCost('cogitex', 15),

  new UpgradeDefinition('Mineral Extraction', '')
  .addCost('metal', 25),
  new UpgradeDefinition('Liquid Extraction', '')
  .addCost('duranium', 25),
  new UpgradeDefinition('Gas Extraction', '')
  .addCost('duranium', 50),
  new UpgradeDefinition('Clathrate Extraction', '')
  .addCost('nanofiber', 15),
  new UpgradeDefinition('Particulate Enrichment', '')
  .addCost('nanofiber', 25),
  new UpgradeDefinition('Crystal Extraction', '')
  .addCost('nanofiber', 50),
];
