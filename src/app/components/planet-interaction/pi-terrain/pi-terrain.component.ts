import { Component, OnInit } from '@angular/core';
import { PlanetService } from '../../../services/planet.service';
import { Planet, Region, Feature } from '../../../models/planet';
import { isNullOrUndefined } from 'util';
import { Resource, ResourceCollection } from '../../../models/resource';
import { ResearchService } from 'src/app/services/research.service';
import { ResourceService } from 'src/app/services/resource.service';
import { RegionInteraction, FeatureInteraction } from 'src/app/models/planetInteractionModel';
import { FeatureAction } from 'src/app/staticData/actionDefinitions';

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

  gatherRegion(regionId: number) {
    this.planetService.gatherRegion(regionId);
  }

  gatherFeature(regionId: number, featureId: number) {
    this.planetService.gatherFeature(regionId, featureId);
  }

  activateAbility(regionId: number, featureId: number, abilityIndex: number) {
    const feature = this.planetService.getFeature(regionId, featureId);
    const featureDef = this.planetService.getFeatureDefinition(feature.name);
    const abilityDef = featureDef.abilities[abilityIndex];
    abilityDef.actions.forEach (a => {
      (a as FeatureAction).doFeatureAction(this.planetService, regionId, feature);
    });
    this.updateRegionList();
  }

  buyInfrastructure(regionId: number) {
    // TODO
    this.planetService.upgradeInfrastructure(regionId);
    this.updateRegionList();
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
      if (this.planetService.isRegionVisible(regionModel.instanceId)) {
        const regionInteraction = regionInteractions.getRegion(regionModel.instanceId);
        this.regionList.push(this.createRegionListItem(regionModel, regionInteraction));
      }
    });
  }

  private createRegionListItem(region: Region, regionInteraction: RegionInteraction): RegionListItem {
    const item = new RegionListItem();
    item.name = region.name;
    item.id = region.instanceId;
    item.infrastructureLevel = regionInteraction.infrastructureLevel;
    item.droneSlots = 0; // TODO
    item.dronesAssigned = regionInteraction.assignedDrones;
    item.canGather = item.infrastructureLevel > 0;

    // Get all hidden features, and find the lowest infrastructure required one,
    // So we know which level to cut off hints at
    let hintLevel = 0;
    const hiddenFeatures = region.features.filter(x => x.hiddenBehindInfrastructure > item.infrastructureLevel);
    if (hiddenFeatures.length > 0) {
      hintLevel = Math.min(...hiddenFeatures.map(x => x.hiddenBehindInfrastructure));
    }

    region.features.forEach(f => {
      const featureInteraction = regionInteraction.getFeature(f.instanceId);
      item.features.push(this.createFeatureListItem(f, featureInteraction, item.infrastructureLevel, hintLevel));
    });
    return item;
  }

  private createFeatureListItem(feature: Feature, featureInteraction: FeatureInteraction, infrastructureLevel: number, hintLevel: number): FeatureListItem {
    const featureDef = this.planetService.getFeatureDefinition(feature.name);
    const exploitDef = this.planetService.getExploitDefinitionForFeature(feature.name);
    const item = new FeatureListItem();
    item.name = feature.name;
    item.id = feature.instanceId;
    item.infrastructureNeeded = feature.hiddenBehindInfrastructure;
    item.canExploit = false;
    item.canGather = infrastructureLevel === 0;
    item.exploitCost = exploitDef?.cost ?? new ResourceCollection();
    item.active = item.infrastructureNeeded <= infrastructureLevel;
    item.hintActive = item.infrastructureNeeded > infrastructureLevel && item.infrastructureNeeded <= hintLevel;
    featureDef.abilities.forEach((a, i) => {
      const ability = new AbilityItem();
      ability.name = a.name;
      ability.index = i;
      ability.canActivate = true;
      item.abilities.push(ability);
    });

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
  public canGather = false;
}

export class FeatureListItem {
  public name: string;
  public id: number;
  public infrastructureNeeded: number;
  public active: boolean;
  public hintActive: boolean;
  public canGather: boolean;
  public canExploit: boolean;
  public exploitCost: ResourceCollection;
  public abilities: AbilityItem[] = [];
}

export class AbilityItem {
  public name: string;
  public index: number;
  public canActivate: boolean;
}

export class RegionDetailsViewModel {
  public name = '';
  public description = '';
  public currentProduction: ResourceCollection = new ResourceCollection();
}
