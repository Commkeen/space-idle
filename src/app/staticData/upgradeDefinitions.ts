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
  .addCost('metal', 25)
  .setsFlag('showStructureTab'), // Smelter, nanochips
  // new UpgradeDefinition('Improved Furnace', 'desc', 'Construction').addCost('duranium', 10),
  new UpgradeDefinition('Tensile Polymers', 'desc', 'Construction').addCost('duranium', 10).addCost('silicate', 10), // Nanofiber
  // new UpgradeDefinition('Clathrate Extraction', 'desc', 'Tensile Polymers').addCost('nanochips', 10).addCost('nanofiber', 10), // Noble gas
  new UpgradeDefinition('oceanSurveyUpgrade', 'desc', 'Construction').addCost('duranium', 50),
  new UpgradeDefinition('mountainSurveyUpgrade', 'desc', 'Tensile Polymers').addCost('nanofiber', 10),
  new UpgradeDefinition('desertSurveyUpgrade', 'desc', 'oceanSurveyUpgrade').addCost('hydrocarbon', 10), // Glittersand
  new UpgradeDefinition('Photon Processing', 'desc', 'desertSurveyUpgrade').addCost('glittersand', 10), // Optronics
  new UpgradeDefinition('Unbreakable Materials', 'desc', 'Photon Processing').addCost('optronics', 10), // Silksteel
  new UpgradeDefinition('arcticSurveyUpgrade', 'desc', 'Photon Processing').addCost('optronics', 20), // Cryofluid
  new UpgradeDefinition('Electrodynamics', 'desc', 'oceanSurveyUpgrade')
                        .addCost('cryofluid', 10).addCost('nanochips', 20), // Ultraconductors
  new UpgradeDefinition('underseaSurveyUpgrade', 'desc', 'oceanSurveyUpgrade').addCost('ultraconductors', 10), // Charybdin
  new UpgradeDefinition('Extradimensional Synthesis', 'desc', 'underseaSurveyUpgrade').addCost('charybdin', 10), // Hyperlattice
  new UpgradeDefinition('Synthetic Thought', 'desc', 'Photon Processing')
                        .addCost('ultraconductors', 10).addCost('optronics', 10), // Cogitex
  new UpgradeDefinition('Artificial Gravity', 'desc', 'Electrodynamics').addCost('dyene', 10).addCost('ultraconductors', 10), // Gravalloy
  new UpgradeDefinition('Mineral Extraction', 'desc').addCost('metal', 5),
];
