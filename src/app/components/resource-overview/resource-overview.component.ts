import { Component, OnInit } from '@angular/core';
import { ResourceService } from '../../services/resource.service';
import { PlanetService } from '../../services/planet.service';
import { isNullOrUndefined } from 'util';
import { isNull } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-resource-overview',
  templateUrl: './resource-overview.component.html',
  styleUrls: ['./resource-overview.component.scss']
})
export class ResourceOverviewComponent implements OnInit {

  constructor(private resourceService: ResourceService, private planetService: PlanetService) { }

  ngOnInit() {
  }

  getPower(rateSource: string): ResourceListItem {
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
      item.production = resource.productionRate.toFixed(0);
      item.consumption = resource.consumptionRate.toFixed(0);
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
      let rate: number = element.getNetProductionRate();
      if (rateSource === 'localRates' && !isNullOrUndefined(localResources)) {
        rate = 0;
        const localResource = localResources.resources.find(x => x.resource === element.resource);
        if (!isNullOrUndefined(localResource)) {rate = localResource.getNetProductionRate(); }
      }

      const formatAmount = element.amount.toFixed(0);
      const formatMax = element.max.toFixed(0);
      const formatRate = rate.toFixed(1);

      resourceList.push({ name: element.resource,
                          amount: formatAmount,
                          maxAmount: formatMax,
                          rate: formatRate,
                          production: '',
                          consumption: ''});
    });

    return resourceList;
  }

}

export class ResourceListItem {
  public name: string;
  public amount: string;
  public maxAmount: string;
  public rate: string;
  public production: string;
  public consumption: string;
}
