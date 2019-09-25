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

// The highest effect for each resource is chosen, and multiplied by drones in the region
export class BaseRegionalPerDroneProductionEffect extends Effect {
  constructor(
    public resource: string,
    public amount: number
    ) {
      super();
      this.canStack = false;
    }
}

// This will stack on top of base regional per-drone production
export class StackingRegionalPerDroneProductionEffect extends Effect {
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
