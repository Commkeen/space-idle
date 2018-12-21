import { Component, OnInit, Input } from '@angular/core';
import {Planet, Feature} from '../../models/planet';
import {PlanetService} from '../../services/planet.service';
import { isNullOrUndefined } from 'util';
import { ResourceCollection } from '../../models/resource';

@Component({
  selector: 'app-planet-survey',
  templateUrl: './planet-survey.component.html',
  styleUrls: ['./planet-survey.component.scss']
})
export class PlanetSurveyComponent implements OnInit {

  selectedFeatureId: number;
  featureList: FeatureListItem[] = [];
  featureDetails: FeatureDetailsViewModel = new FeatureDetailsViewModel();

  constructor(private planetService: PlanetService) {
    this.planetService.selectedPlanetChanged.subscribe(x => this.updateFeatureList());
  }

  ngOnInit() {

  }

  getSelectedPlanet(): Planet {
    return this.planetService.getSelectedPlanet();
  }

  selectFeature(id: number) {
    this.selectedFeatureId = id;
    this.updateFeatureDetails(id);
  }

  buyExploit(id: number) {
    this.planetService.buyExploit(this.planetService.getSelectedPlanet().instanceId, this.selectedFeatureId);
  }

  updateFeatureList() {
    this.featureList = [];
    if (isNullOrUndefined(this.getSelectedPlanet())) { return; }

    const features = this.getSelectedPlanet().features;
    features.forEach(element => {
      this.planetService.getFeatureDefinition(element.name);
      const featureItem = new FeatureListItem();
      featureItem.name = element.name;
      featureItem.id = element.instanceId;
      featureItem.exploited = false;
      featureItem.hidden = false;
      this.featureList.push(featureItem);
    });

    this.selectFeature(0);
  }

  updateFeatureDetails(instanceId: number) {
    this.featureDetails = new FeatureDetailsViewModel();
    if (isNullOrUndefined(instanceId) || instanceId === 0) { return; }

    const feature = this.getSelectedPlanet().features.find(x => x.instanceId === instanceId);
    const featureDef = this.planetService.getFeatureDefinition(feature.name);
    const exploit = this.planetService.getExploitDefinitionForFeature(feature.name);
    this.featureDetails.name = feature.name;
    this.featureDetails.description = featureDef.description;
    this.featureDetails.exploited = false;
    this.featureDetails.canBuyExploit = true;
    this.featureDetails.buyExploitText = 'EXPLOIT';
    exploit.cost.resources.forEach(element => {
      this.featureDetails.exploitCost.add(element.resource, element.amount);
    });
  }
}

export class FeatureListItem {
  public name: string;
  public id: number;
  public hidden: boolean;
  public exploited: boolean;
}

export class FeatureDetailsViewModel {
  public name = '';
  public description = '';
  public exploited = false;
  public canBuyExploit = false;
  public buyExploitText = '';
  public exploitCost: ResourceCollection = new ResourceCollection();
}
