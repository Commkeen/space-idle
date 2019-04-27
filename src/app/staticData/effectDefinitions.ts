export class Effect {
  public canStack = true;
  public isGlobal = false;
}

export class BaseProductionEffect extends Effect {
  constructor(
    public resource: string,
    public amount: number
    ) {
      super();
    }
}

export class BaseConsumptionEffect extends Effect {
  constructor(
    public resource: string,
    public amount: number
  ) {
    super();
  }
}

export class ProductionMultiplierEffect extends Effect {
  constructor(
    public resource: string,
    public multiplier: number
  ) {
    super();
  }
}

export class FlatProductionEffect extends Effect {
  constructor(
    public resource: string,
    public amount: number
  ) {
    super();
  }
}
