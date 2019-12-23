

// Defines ship abilities and feature abilities
export class AbilityDefinition {
  public name: string;

  setDescription(): AbilityDefinition {
    return this;
  }

  addCost(): AbilityDefinition {
    return this;
  }

  addCooldown(): AbilityDefinition {
    return this;
  }
}

export class ShipAbilityDefinition extends AbilityDefinition {

}

export class FeatureAbilityDefinition extends AbilityDefinition {

}
