export class BonusEffect {
  public canStack = true;
  public isGlobal = false;
}

export class ResourceBonusEffect extends BonusEffect {
  constructor(
    public resource: string,
    public additiveMultiplier: number,
  ) {
    super();
  }
}

export class StructureCostBonusEffect extends BonusEffect {
  structure: string;
  resource: string;
  costReduction: number;
}
