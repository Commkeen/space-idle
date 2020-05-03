export class ResearchDiscipline {
    static baseKnowledgeCost: number = 24;
    static baseTheoryCost: number = 20;
    static baseResearchPerSec: number = 1.43;
    static knowledgeExpCost: number = Math.sqrt(18);

    name: string;
    desc: string = '';
    theoryDesc: string = '';
    revealAtStart: boolean = false;
    baseCostMultiplier: number = 1;
    compoundingCostMultiplier: number = 1;
    theoryCostMultiplier: number = 1;

    upgradeUnlocks: Map<number, string> = new Map<number, string>();
    flagUnlocks: Map<number, string> = new Map<number, string>();

    constructor(name: string) {
      this.name = name;
    }

    setDesc(desc: string): ResearchDiscipline {
      this.desc = desc;
      return this;
    }

    setTheoryDesc(desc: string): ResearchDiscipline {
      this.theoryDesc = desc;
      return this;
    }

    addUpgrade(level: number, upgrade: string): ResearchDiscipline {
      this.upgradeUnlocks.set(level, upgrade);
      return this;
    }

    addFlag(level: number, flag: string): ResearchDiscipline {
      this.flagUnlocks.set(level, flag);
      return this;
    }

    setRevealAtStart(): ResearchDiscipline {
      this.revealAtStart = true;
      return this;
    }

}

export const RESEARCH_LIBRARY: ResearchDiscipline[] = [
  new ResearchDiscipline('Material Science')
    .setDesc('Structures cost 5% less (diminishing) per level.')
    .setTheoryDesc('Gain theory by salvaging materials.')
    .setRevealAtStart()
    .addUpgrade(1, 'Construction')
    .addUpgrade(2, 'Hydrophobic Alloys')
    .addUpgrade(3, 'Tensile Polymers')
    .addUpgrade(5, 'Unbreakable Materials'),
  new ResearchDiscipline('Electronics')
  .setTheoryDesc('Gain theory by salvaging and fabricating electronics.')
    .addUpgrade(1, 'Automated Fabrication')
    .addUpgrade(3, 'Photon Processing')
    .addUpgrade(5, 'Synthetic Thought'),
  new ResearchDiscipline('Hypertopology')
  .setTheoryDesc('Gain theory by studying spatial anomalies.')
    .addUpgrade(1, 'Extradimensional Synthesis'),
  new ResearchDiscipline('Power Systems')
  .setDesc('Ship energy recharges 20% faster per level.')
  .setTheoryDesc('Gain theory by salvaging power and energy systems.')
    .addUpgrade(1, 'Fueled Generators')
    .addUpgrade(3, 'Electrodynamics')
    .addUpgrade(4, 'Solar Power'),
  new ResearchDiscipline('Gravitics')
  .setTheoryDesc('Gain theory by studying spatial anomalies.')
    .addUpgrade(1, 'Artificial Gravity'),
  new ResearchDiscipline('Planetary Survey')
  .setDesc('Survey scannning is 20% faster per level.')
  .setTheoryDesc('Gain theory by surveying regions.')
    .addUpgrade(2, 'Maritime Survey')
    .addUpgrade(3, 'Mountain Survey')
    .addUpgrade(4, 'Desert Survey')
    .addUpgrade(5, 'Arctic Survey')
    .addUpgrade(6, 'Undersea Survey'),
  new ResearchDiscipline('Drone Control')
  .setDesc('Drone hubs cost 5% less (diminishing) per level.')
  .setTheoryDesc('Gain theory by building drone hubs.')
    .addUpgrade(1, 'Bandwidth Multiplexing')
    .addUpgrade(2, 'Adaptive Tooling')
    .addUpgrade(3, 'Heuristic Processors'),
  new ResearchDiscipline('Resource Exploitation')
  .setDesc('Drones collect 10% extra resources/sec per level.')
  .setTheoryDesc('Gain theory by building resource extraction improvements.')
    .setRevealAtStart()
    .addUpgrade(1, 'Mineral Extraction')
    .addUpgrade(2, 'Liquid Extraction')
    .addUpgrade(2, 'Gas Extraction')
    .addUpgrade(3, 'Clathrate Extraction')
    .addUpgrade(4, 'Particulate Enrichment')
    .addUpgrade(5, 'Crystal Extraction'),
  new ResearchDiscipline('Anomaly Scanning')
];
