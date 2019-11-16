import { Component, OnInit } from '@angular/core';
import { PlanetService } from '../../../services/planet.service';
import { Planet, Region, Feature } from '../../../models/planet';
import { isNullOrUndefined } from 'util';
import { Resource, ResourceCollection } from '../../../models/resource';
import { ResearchService } from 'src/app/services/research.service';
import { ResourceService } from 'src/app/services/resource.service';
import { RegionInteraction, FeatureInteraction } from 'src/app/models/planetInteractionModel';

@Component({
  selector: 'app-pi-terrain',
  templateUrl: './pi-terrain.component.html',
  styleUrls: ['./pi-terrain.component.scss']
})
export class PiTerrainComponent implements OnInit {

  constructor(private planetService: PlanetService, private researchService: ResearchService, private resourceService: ResourceService) {
    this.planetService.selectedPlanetChanged.subscribe(x => this.updateRegionList());
  }

  public regionList: RegionListItem[] = [];

  ngOnInit() {
    this.updateRegionList();
  }

  getSelectedPlanet(): Planet {
    return this.planetService.getSelectedPlanet();
  }

  buyInfrastructure(regionId: number) {
    // TODO
  }

  canAffordInfrastructure(regionId: number): boolean {
    return true; // TODO
  }

  buyExploit(regionId: number, featureId: number) {
    this.planetService.exploitFeature(regionId, featureId);
    this.updateRegionList();
  }

  canAffordExploit(feature: FeatureListItem): boolean {
    if (isNullOrUndefined(feature.exploitCost)) { return false; }
    return this.resourceService.canAfford(feature.exploitCost);
  }

  updateRegionList() {
    this.regionList = [];
    const regions = this.getSelectedPlanet().regions;
    const regionInteractions = this.planetService.getPlanetInteractionModel().regions;
    regions.forEach(regionModel => {
      const regionInteraction = regionInteractions.getRegion(regionModel.instanceId);
      this.regionList.push(this.createRegionListItem(regionModel, regionInteraction));
    });
  }

  private createRegionListItem(region: Region, regionInteraction: RegionInteraction): RegionListItem {
    const item = new RegionListItem();
    item.name = region.name;
    item.id = region.instanceId;
    item.infrastructureLevel = regionInteraction.infrastructureLevel;
    item.droneSlots = 0; // TODO
    item.dronesAssigned = regionInteraction.assignedDrones;
    region.features.forEach(f => {
      const featureInteraction = regionInteraction.getFeature(f.instanceId);
      item.features.push(this.createFeatureListItem(f, featureInteraction));
    });
    return item;
  }

  private createFeatureListItem(feature: Feature, featureInteraction: FeatureInteraction): FeatureListItem {
    const featureDef = this.planetService.getFeatureDefinition(feature.name);
    const exploitDef = this.planetService.getExploitDefinitionForFeature(feature.name);
    const item = new FeatureListItem();
    item.name = feature.name;
    item.id = feature.instanceId;
    item.infrastructureNeeded = feature.hiddenBehindInfrastructure;
    item.canExploit = !featureInteraction.exploited;
    item.exploitCost = exploitDef.cost;

    return item;
  }
}

export class RegionListItem {
  public name: string;
  public id: number;
  public infrastructureLevel: number;
  public dronesAssigned: number;
  public droneSlots: number;
  public expanded = false;
  public features: FeatureListItem[] = [];
}

export class FeatureListItem {
  public name: string;
  public id: number;
  public infrastructureNeeded: number;
  public canExploit: boolean;
  public exploitCost: ResourceCollection;
}

export class RegionDetailsViewModel {
  public name = '';
  public description = '';
  public currentProduction: ResourceCollection = new ResourceCollection();
}
