export class BonusEffect {
  canStack: boolean;
  isGlobal: boolean;
}

export class ResourceBonusEffect extends BonusEffect {
  resource: string;
  additiveMultiplier: number;
}

export class StructureCostBonusEffect extends BonusEffect {
  structure: string;
  resource: string;
  costReduction: number;
}
