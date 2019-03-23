import { Component, OnInit } from '@angular/core';
import { PlanetService } from '../../../services/planet.service';
import { Planet } from '../../../models/planet';
import { isNullOrUndefined } from 'util';
import { ResourceCollection } from '../../../models/resource';
import { ResearchService } from 'src/app/services/research.service';

@Component({
  selector: 'app-pi-terrain',
  templateUrl: './pi-terrain.component.html',
  styleUrls: ['./pi-terrain.component.scss']
})
export class PiTerrainComponent implements OnInit {

  selectedFeatureId: number;
  featureList: FeatureListItem[] = [];
  featureDetails: FeatureDetailsViewModel = new FeatureDetailsViewModel();

  constructor(private planetService: PlanetService, private researchService: ResearchService) {
    this.planetService.selectedPlanetChanged.subscribe(x => this.updateFeatureList());
    this.researchService.onResearchUpdated.subscribe(x => this.updateFeatureDetails(this.selectedFeatureId));
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

  buySurvey() {
    const id = this.selectedFeatureId;
    this.planetService.surveyFeature(this.getSelectedPlanet().instanceId, id);
    this.updateFeatureList();
    this.selectFeature(id);
  }

  buyExploit() {
    const id = this.selectedFeatureId;
    this.planetService.exploitFeature(this.getSelectedPlanet().instanceId, id);
    this.updateFeatureList();
    this.selectFeature(id);
  }

  updateFeatureList() {
    this.featureList = [];
    if (isNullOrUndefined(this.getSelectedPlanet())) { return; }

    const features = this.getSelectedPlanet().features;
    const featureInteractions = this.planetService.getPlanetInteractionModel(this.getSelectedPlanet().instanceId).features;
    features.forEach(element => {
      const featureItem = new FeatureListItem();
      featureItem.id = element.instanceId;
      featureItem.name = featureInteractions.isSurveyed(element.instanceId) ? element.specificName : element.genericName;
      featureItem.discovered = featureInteractions.isDiscovered(element.instanceId);
      featureItem.surveyed = featureInteractions.isSurveyed(element.instanceId);
      featureItem.exploited = featureInteractions.isExploited(element.instanceId);
      this.featureList.push(featureItem);
    });

    this.selectFeature(0);
  }

  updateFeatureDetails(instanceId: number) {
    this.featureDetails = new FeatureDetailsViewModel();
    if (isNullOrUndefined(instanceId) || instanceId === 0) { return; }

    const feature = this.getSelectedPlanet().features.find(x => x.instanceId === instanceId);
    const featureInteractions = this.planetService.getPlanetInteractionModel().features;
    const exploitDef = this.planetService.getExploitDefinitionForFeature(feature.specificName);
    const unsurveyedFeatureDef = this.planetService.getUnsurveyedFeatureDefinition(feature.genericName);
    const surveyedFeatureDef = this.planetService.getSurveyedFeatureDefinition(feature.specificName);

    this.featureDetails.surveyed = featureInteractions.isSurveyed(instanceId);
    this.featureDetails.exploited = featureInteractions.isExploited(instanceId);
    this.featureDetails.surveyButtonText = 'SURVEY';
    this.featureDetails.exploitButtonText = 'EXPLOIT';
    this.featureDetails.surveyCost = 10;
    exploitDef.cost.resources.forEach(element => {
      this.featureDetails.exploitCost.add(element.resource, element.amount);

    // TODO: canBuyExploit and canSurvey should be based on research, not upgrades
    this.featureDetails.needSurveyTech =
          unsurveyedFeatureDef.surveyTech !== '' && !this.researchService.isUpgradeCompleted(unsurveyedFeatureDef.surveyTech);


    this.featureDetails.canSurvey = !this.featureDetails.surveyed && !this.featureDetails.needSurveyTech;
    this.featureDetails.canBuyExploit = this.featureDetails.surveyed && !this.featureDetails.exploited;

    if (!this.featureDetails.surveyed) {
      this.featureDetails.name = unsurveyedFeatureDef.name;
      this.featureDetails.description = unsurveyedFeatureDef.description;
    } else if (!this.featureDetails.exploited) {
      this.featureDetails.name = surveyedFeatureDef.name;
      this.featureDetails.description = surveyedFeatureDef.description;
    } else if (this.featureDetails.exploited) {
      this.featureDetails.name = surveyedFeatureDef.name;
      this.featureDetails.description = 'Already exploited';
    }

    });
  }
}

export class FeatureListItem {
  public name: string;
  public id: number;
  public discovered: boolean;
  public surveyed: boolean;
  public exploited: boolean;
}

export class FeatureDetailsViewModel {
  public name = '';
  public description = '';
  public surveyed = false;
  public exploited = false;
  public canSurvey = false;
  public canBuyExploit = false;
  public needSurveyTech = false;
  public needExploitTech = false;
  public surveyButtonText = '';
  public exploitButtonText = '';
  public surveyCost: number;
  public exploitCost: ResourceCollection = new ResourceCollection();
}
