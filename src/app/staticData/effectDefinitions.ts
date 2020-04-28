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
