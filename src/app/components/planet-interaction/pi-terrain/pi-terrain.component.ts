import { Component, OnInit } from '@angular/core';
import { PlanetService } from '../../../services/planet.service';
import { Planet, Region, Feature } from '../../../models/planet';
import { isNullOrUndefined } from 'util';
import { Resource, ResourceCollection } from '../../../models/resource';
import { ResearchService } from 'src/app/services/research.service';
import { ResourceService } from 'src/app/services/resource.service';
import { RegionInteraction, FeatureInteraction } from 'src/app/models/planetInteractionModel';
import { FeatureAction } from 'src/app/staticData/actionDefinitions';
import { ActionService } from 'src/app/services/action.service';
import { FlagsService } from 'src/app/services/flags.service';

@Component({
  selector: 'app-pi-terrain',
  templateUrl: './pi-terrain.component.html',
  styleUrls: ['./pi-terrain.component.scss']
})
export class PiTerrainComponent implements OnInit {

  constructor(private actionService: ActionService, private planetService: PlanetService,
              private researchService: ResearchService, private resourceService: ResourceService,
              private flagService: FlagsService) {
    this.planetService.selectedPlanetChanged.subscribe(x => this.updateRegionList());
  }

  public regionList: RegionListItem[] = [];

  ngOnInit() {
    this.updateRegionList();
  }

  getSelectedPlanet(): Planet {
    return this.planetService.getSelectedPlanet();
  }

  getSurveyProgressNeeded(regionId: number): number {
    return this.planetService.getSurveyProgressNeeded(regionId);
  }

  showOutpostPanel(regionId: number): boolean {
    return this.flagService.check('droneRelayRepaired');
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
      if (a instanceof FeatureAction) {
        (a as FeatureAction).doFeatureAction(this.actionService, regionId, feature);
      }
      else {
        a.doAction(this.actionService);
      }
    });
    this.updateRegionList();
  }

  survey(regionId: number) {
    this.planetService.surveyRegion(regionId);
    this.updateRegionList();
  }

  buyOutpost(regionId: number) {
    // TODO
    this.planetService.upgradeOutpost(regionId);
    this.updateRegionList();
  }

  canAffordOutpost(regionId: number): boolean {
    return true; // TODO
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
    item.outpostLevel = regionInteraction.outpostLevel;
    item.surveyLevel = regionInteraction.surveyLevel;
    item.surveyProgress = regionInteraction.surveyProgress;
    item.droneSlots = regionInteraction.outpostLevel;
    item.dronesAssigned = regionInteraction.assignedDrones;
    item.canGather = item.outpostLevel > 0;

    // Get all hidden features, and find the lowest survey required one,
    // So we know which level to cut off hints at
    let hintLevel = 0;
    const hiddenFeatures = region.features.filter(x => x.hiddenBehindSurvey > item.surveyLevel);
    if (hiddenFeatures.length > 0) {
      hintLevel = Math.min(...hiddenFeatures.map(x => x.hiddenBehindSurvey));
    }

    region.features.forEach(f => {
      const featureInteraction = regionInteraction.getFeature(f.instanceId);
      item.features.push(this.createFeatureListItem(f, featureInteraction, item.outpostLevel, item.surveyLevel, hintLevel));
    });
    return item;
  }

  private createFeatureListItem(feature: Feature, featureInteraction: FeatureInteraction, outpostLevel: number, surveyLevel: number, hintLevel: number): FeatureListItem {
    const featureDef = this.planetService.getFeatureDefinition(feature.name);
    const exploitDef = this.planetService.getExploitDefinitionForFeature(feature.name);
    const item = new FeatureListItem();
    item.name = feature.name;
    item.id = feature.instanceId;
    item.surveyNeeded = feature.hiddenBehindSurvey;
    item.canGather = outpostLevel === 0;
    item.active = item.surveyNeeded <= surveyLevel;
    item.hintActive = item.surveyNeeded > surveyLevel && item.surveyNeeded <= hintLevel;
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
  public outpostLevel: number;
  public surveyLevel: number;
  public surveyProgress: number;
  public dronesAssigned: number;
  public droneSlots: number;
  public features: FeatureListItem[] = [];
  public canGather = false;
}

export class FeatureListItem {
  public name: string;
  public id: number;
  public surveyNeeded: number;
  public active: boolean;
  public hintActive: boolean;
  public canGather: boolean;
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
