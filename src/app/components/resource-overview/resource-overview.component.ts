import { Component, OnInit } from '@angular/core';
import { ResourceService } from '../../services/resource.service';
import { PlanetService } from '../../services/planet.service';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-resource-overview',
  templateUrl: './resource-overview.component.html',
  styleUrls: ['./resource-overview.component.scss']
})
export class ResourceOverviewComponent implements OnInit {

  constructor(private resourceService: ResourceService, private planetService: PlanetService) { }

  ngOnInit() {
  }

  getPower(rateSource: string = 'localRates'): ResourceListItem {
    const globalResources = this.resourceService.globalResources;
    let localResources = null;
    const localInteractionModel = this.planetService.getSelectedPlanetInteractionModel();
    if (!isNullOrUndefined(localInteractionModel)) {localResources = localInteractionModel.localResources; }
    let resource = globalResources.resources.find(x => x.resource === 'power');
    if (rateSource === 'localRates' && !isNullOrUndefined(localResources)) {
      resource = localResources.resources.find(x => x.resource === 'power');
    }
    const item = new ResourceListItem();
    if (!isNullOrUndefined(resource)) {
      item.production = resource.productionRate;
      item.consumption = resource.consumptionRate;
    }
    return item;
  }

  getResourceList(rateSource: string): ResourceListItem[] {
    const globalResources = this.resourceService.globalResources;
    let localResources = null;
    const localInteractionModel = this.planetService.getSelectedPlanetInteractionModel();
    if (!isNullOrUndefined(localInteractionModel)) {localResources = localInteractionModel.localResources; }
    const resourceList: ResourceListItem[] = [];

    globalResources.resources.forEach(element => {
      if (element.resource === 'power') {return; }
      if (!this.resourceService.isDiscovered(element.resource)) {return; }
      let rate: number = element.getNetProductionRate();
      if (rateSource === 'localRates' && !isNullOrUndefined(localResources)) {
        rate = 0;
        const localResource = localResources.resources.find(x => x.resource === element.resource);
        if (!isNullOrUndefined(localResource)) {rate = localResource.getNetProductionRate(); }
      }

      resourceList.push({ name: element.resource,
                          amount: element.amount,
                          maxAmount: element.max,
                          rate: rate,
                          production: 0,
                          consumption: 0});
    });

    return resourceList;
  }

}

export class ResourceListItem {
  public name: string;
  public amount: number;
  public maxAmount: number;
  public rate: number;
  public production: number;
  public consumption: number;
}
