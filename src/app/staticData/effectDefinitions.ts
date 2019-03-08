export class BonusEffect {
  public canStack = true;
  public isGlobal = false;
}

export class ResourceMultiplierBonusEffect extends BonusEffect {
  constructor(
    public resource: string,
    public additiveMultiplier: number,
  ) {
    super();
  }
}

export class ResourceGenerationBonusEffect extends BonusEffect {
  constructor(
    public resource: string,
    public amount: number,
  ) {
    super();
  }
}

export class StructureCostBonusEffect extends BonusEffect {
  structure: string;
  resource: string;
  costReduction: number;
}
