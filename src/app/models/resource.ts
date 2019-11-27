import { isNullOrUndefined } from 'util';

export class Resource {
    constructor(public resource: string, public amount: number, public max: number= 0,
                public productionRate: number= 0, public consumptionRate: number= 0) {}

    getNetProductionRate() {
        return this.productionRate - this.consumptionRate;
    }

    getEfficiency() {
        if (this.productionRate === 0) {return 0; }
        if (this.getNetProductionRate() >= 0) {return 1; }
        return this.productionRate / this.consumptionRate;
    }

    isPower(): boolean {
      return this.resource === 'power';
    }
}

export class ResourceCollection {

    resources: Resource[] = [];

    constructor() {}

    add(resource: string, amount: number) {
        let resourceItem = this.resources.find(x => x.resource === resource);
        if (isNullOrUndefined(resourceItem)) {
            resourceItem = new Resource(resource, 0);
            this.resources.push(resourceItem);
        }
        resourceItem.amount += amount;
        if (resourceItem.amount > resourceItem.max && resourceItem.max !== 0) {
            resourceItem.amount = resourceItem.max;
        }
    }

    addCollection(other: ResourceCollection) {
      other.resources.forEach(element => {
        this.add(element.resource, element.amount);
      }, this);
    }

    remove(resource: string, amount: number): boolean {
        let couldAfford = true;
        const resourceItem = this.resources.find(x => x.resource === resource);
        if (isNullOrUndefined(resourceItem)) {return false; }
        resourceItem.amount -= amount;
        if (resourceItem.amount < 0) {
            resourceItem.amount = 0;
            couldAfford = false;
        }
        return couldAfford;
    }

    removeCollection(other: ResourceCollection): boolean {
      let couldAfford = true;
      other.resources.forEach(element => {
        const removeResult = this.remove(element.resource, element.amount);
        if (!removeResult) { couldAfford = false; }
      });
      return couldAfford;
    }

    setMax(resource: string, max: number) {
        let resourceItem = this.resources.find(x => x.resource === resource);
        if (isNullOrUndefined(resourceItem)) {
            resourceItem = new Resource(resource, 0);
            this.resources.push(resourceItem);
        }
        resourceItem.max = max;
        if (resourceItem.amount > resourceItem.max) {
            resourceItem.amount = resourceItem.max;
        }
    }

    addProductionRate(resource: string, rate: number) {
        let resourceItem = this.resources.find(x => x.resource === resource);
        if (isNullOrUndefined(resourceItem)) {
            resourceItem = new Resource(resource, 0);
            this.resources.push(resourceItem);
        }
        resourceItem.productionRate += rate;
    }

    setProductionRate(resource: string, rate: number) {
        let resourceItem = this.resources.find(x => x.resource === resource);
        if (isNullOrUndefined(resourceItem)) {
            resourceItem = new Resource(resource, 0);
            this.resources.push(resourceItem);
        }
        resourceItem.productionRate = rate;
    }

    addConsumptionRate(resource: string, rate: number) {
        let resourceItem = this.resources.find(x => x.resource === resource);
        if (isNullOrUndefined(resourceItem)) {
            resourceItem = new Resource(resource, 0);
            this.resources.push(resourceItem);
        }
        resourceItem.consumptionRate += rate;
    }

    setConsumptionRate(resource: string, rate: number) {
        let resourceItem = this.resources.find(x => x.resource === resource);
        if (isNullOrUndefined(resourceItem)) {
            resourceItem = new Resource(resource, 0);
            this.resources.push(resourceItem);
        }
        resourceItem.consumptionRate = rate;
    }

    resetRates() {
        this.resources.forEach(resource => {resource.productionRate = 0; resource.consumptionRate = 0; });
    }

    has(resource: string, amount?: number): boolean {
        if (!amount) { amount = 0.01; }
        const resourceItem = this.resources.find(x => x.resource === resource);
        if (isNullOrUndefined(resourceItem)) {return false; }
        return resourceItem.amount >= amount;
    }

    getAmount(resource: string): number {
      const resourceItem = this.resources.find(x => x.resource === resource);
        if (isNullOrUndefined(resourceItem)) {return 0; }
        return resourceItem.amount;
    }

    getProduction(resource: string): number {
      const resourceItem = this.resources.find(x => x.resource === resource);
        if (isNullOrUndefined(resourceItem)) {return 0; }
        return resourceItem.productionRate;
    }

    getConsumption(resource: string): number {
      const resourceItem = this.resources.find(x => x.resource === resource);
        if (isNullOrUndefined(resourceItem)) {return 0; }
        return resourceItem.consumptionRate;
    }

    getNetProduction(resource: string): number {
      const resourceItem = this.resources.find(x => x.resource === resource);
        if (isNullOrUndefined(resourceItem)) {return 0; }
        return resourceItem.productionRate - resourceItem.consumptionRate;
    }

    getMax(resource: string): number {
      const resourceItem = this.resources.find(x => x.resource === resource);
        if (isNullOrUndefined(resourceItem)) {return 0; }
        return resourceItem.max;
    }

    clear() {
      while (this.resources.length > 0) {
        this.resources.pop();
      }
    }

}
