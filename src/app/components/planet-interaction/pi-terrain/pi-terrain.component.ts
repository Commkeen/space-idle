import { Component, OnInit } from '@angular/core';
import { PlanetService } from '../../../services/planet.service';
import { Planet } from '../../../models/planet';
import { isNullOrUndefined } from 'util';
import { Resource, ResourceCollection } from '../../../models/resource';
import { ResearchService } from 'src/app/services/research.service';
import { ResourceService } from 'src/app/services/resource.service';

@Component({
  selector: 'app-pi-terrain',
  templateUrl: './pi-terrain.component.html',
  styleUrls: ['./pi-terrain.component.scss']
})
export class PiTerrainComponent implements OnInit {

  selectedRegionId: number;
  selectedFeatureId: number;
  featureList: FeatureListItem[] = [];
  featureDetails: FeatureDetailsViewModel = new FeatureDetailsViewModel();

  constructor(private planetService: PlanetService, private researchService: ResearchService, private resourceService: ResourceService) {
    this.planetService.selectedPlanetChanged.subscribe(x => this.updateFeatureList());
  }

  ngOnInit() {
    this.updateFeatureList();
  }

  getSelectedPlanet(): Planet {
    return this.planetService.getSelectedPlanet();
  }

  selectFeature(id: number) {
    this.selectedFeatureId = id;
    // this.updateFeatureDetails(id);
  }

  buyExploit() {
    const id = this.selectedFeatureId;
    this.planetService.exploitFeature(this.getSelectedPlanet().instanceId, id);
    this.updateFeatureList();
    this.selectFeature(id);
  }

  canAffordExploit(): boolean {
    if (isNullOrUndefined(this.featureDetails)) { return false; }
    return this.resourceService.canAfford(this.featureDetails.exploitCost);
  }

  updateFeatureList() {
    this.featureList = [];
    if (isNullOrUndefined(this.getSelectedPlanet())) { return; }
  }

  updateFeatureDetails(regionId: number, featureId: number) {
    this.featureDetails = new FeatureDetailsViewModel();
    if (isNullOrUndefined(regionId) || regionId === 0
        || isNullOrUndefined(featureId) || featureId === 0) { return; }

    const region = this.getSelectedPlanet().regions.find(x => x.instanceId === regionId);
    const feature = region.features.find(x => x.instanceId === featureId);
    const regionInteractions = this.planetService.getPlanetInteractionModel().regions;
    const exploitDef = this.planetService.getExploitDefinitionForFeature(feature.name);
    const featureDef = this.planetService.getFeatureDefinition(feature.name);

    this.featureDetails.exploited = regionInteractions.isFeatureExploited(regionId, featureId);
    this.featureDetails.exploitButtonText = 'EXPLOIT';
    this.featureDetails.exploitCost.addCollection(exploitDef.cost);
    this.featureDetails.exploitProduction.addCollection(exploitDef.getProduction());

    this.featureDetails.canBuyExploit = !this.featureDetails.exploited;

    if (!this.featureDetails.exploited) {
      this.featureDetails.name = featureDef.name;
      this.featureDetails.description = featureDef.description;
    } else if (this.featureDetails.exploited) {
      this.featureDetails.name = featureDef.name;
      this.featureDetails.description = 'Already exploited';
    }
  }
}

export class RegionListItem {
  public name: string;
  public id: number;
  public infrastructureLevel: number;
  public dronesAssigned: number;
  public droneSlots: number;
  public expanded = false;
  public features: FeatureListItem[];
}

export class FeatureListItem {
  public name: string;
  public id: number;
  public exploited: boolean;
}

export class RegionDetailsViewModel {
  public name = '';
  public description = '';
  public currentProduction: ResourceCollection = new ResourceCollection();
}

export class FeatureDetailsViewModel {
  public name = '';
  public description = '';
  public exploited = false;
  public canBuyExploit = false;
  public needExploitTech = false;
  public exploitButtonText = '';
  public currentProduction: ResourceCollection = new ResourceCollection();
  public exploitCost: ResourceCollection = new ResourceCollection();
  public exploitProduction: ResourceCollection = new ResourceCollection();
}
