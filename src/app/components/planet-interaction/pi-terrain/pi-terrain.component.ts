import { Component, OnInit } from '@angular/core';
import { PlanetService } from '../../../services/planet.service';
import { Planet, Region, Feature } from '../../../models/planet';
import { Resource, ResourceCollection } from '../../../models/resource';
import { ResearchService } from 'src/app/services/research.service';
import { ResourceService } from 'src/app/services/resource.service';
import { RegionInteraction, FeatureInteraction } from 'src/app/models/planetInteractionModel';
import { FeatureAction } from 'src/app/staticData/actionDefinitions';
import { ActionService } from 'src/app/services/action.service';
import { FlagsService } from 'src/app/services/flags.service';
import { TaskService } from 'src/app/services/task.service';
import { TaskDefinition } from 'src/app/staticData/taskDefinitions';
import { FeatureTask } from 'src/app/models/task';
import { AbilityDefinition } from 'src/app/staticData/abilityDefinitions';
import { TooltipViewModel } from 'src/app/models/tooltipViewModel';

@Component({
  selector: 'app-pi-terrain',
  templateUrl: './pi-terrain.component.html',
  styleUrls: ['./pi-terrain.component.scss']
})
export class PiTerrainComponent implements OnInit {

  constructor(private actionService: ActionService, private planetService: PlanetService,
              private researchService: ResearchService, private resourceService: ResourceService,
              private flagService: FlagsService, private taskService: TaskService) {
    this.planetService.selectedPlanetChanged.subscribe(x => this.updateRegionList());
    this.planetService.regionChanged.subscribe(x => this.updateRegionList());
    this.researchService.onResearchUpdated.subscribe(x => this.updateRegionList());
  }

  public regionList: RegionListItem[] = [];

  ngOnInit() {
    this.updateRegionList();
  }

  getSelectedPlanet(): Planet {
    return this.planetService.getSelectedPlanet();
  }

  getSurveyProgress(regionId: number): number {
    return this.planetService.getSurveyProgress(regionId);
  }

  getSurveyProgressNeeded(regionId: number): number {
    return this.planetService.getSurveyProgressNeeded(regionId);
  }

  taskIsVisible(taskItem: TaskItem): boolean {
    if (!taskItem.def.repeatable && taskItem.instance != null && taskItem.instance.progress >= taskItem.instance.needed) {return false;}
    return true;
  }

  getSurveyLevelText(region: RegionListItem): string {
    if (region.surveyLevel > 0) {return 'Survey Lv ' + region.surveyLevel};
    if (this.upgradeRequiredForSurvey(region)) {return 'Upgrade Required';}
    return 'Unsurveyed';
  }

  getSurveyButtonName(region: RegionListItem): string {
    if (!this.flagService.check('surveyRepaired')) {return 'Drone Survey';}
    if (this.isSurveyRunning(region)) {return 'Surveying';}
    return 'Survey Scan';
  }

  survey(region: RegionListItem) {
    if (this.isSurveyRunning(region)) {return;}
    if (!this.canAffordSurvey(region)) {return;}
    const useSurveyTask = this.flagService.check('surveyRepaired');
    if (useSurveyTask) {
      this.taskService.beginSurvey(this.getSelectedPlanet().instanceId, region.id);
    }
    else {
      this.resourceService.spend(new Resource('drones', 1));
      this.planetService.surveyRegion(10, region.id);
    }

    this.updateRegionList();
  }

  isSurveyRunning(region: RegionListItem): boolean {
    return this.taskService.isSurveyRunning(this.getSelectedPlanet().instanceId, region.id);
  }

  canAffordSurvey(region: RegionListItem): boolean {
    if (this.flagService.check('surveyRepaired')) {return true;}
    const drones = this.resourceService.get('drones');
    const assigned = this.planetService.getPlanetInteractionModel().regions.getTotalAssignedDrones();
    return assigned < drones;
  }

  upgradeRequiredForSurvey(region: RegionListItem): boolean {
    const def = this.planetService.getRegionDefinition(region.name);
    if (def.surveyUpgradeNeeded === '') {return false;}
    if (this.researchService.isUpgradeCompleted(def.surveyUpgradeNeeded)) {return false;}
    return true;
  }

  surveyTooltip(region: RegionListItem): TooltipViewModel {
    const tooltip = new TooltipViewModel();
    if (!this.flagService.check('surveyRepaired'))
    {
      tooltip.name = "Drone Survey";
      tooltip.desc = "Send a drone to survey the region. The drone will not survive.";
      tooltip.costs = new ResourceCollection();
      tooltip.costs.add('drones', 1);
    }
    else
    {
      tooltip.name = "Survey Scan";
    }
    return tooltip;
  }

  buyDroneHub(region: RegionListItem) {
    this.planetService.buildDroneHub(region.id);
    this.updateRegionList();
  }

  canAffordDroneHub(region: RegionListItem): boolean {
    return this.resourceService.canAfford(region.droneHubCost); // TODO
  }

  droneHubTooltip(region: RegionListItem): TooltipViewModel {
    const tooltip = new TooltipViewModel();
    tooltip.name = "Drone Hub";
    //tooltip.desc = upg.description;
    tooltip.costs = region.droneHubCost;
    return tooltip;
  }

  showDroneHubButton(region: RegionListItem): boolean {
    if (region.surveyLevel <= 0) {return false;}
    return this.flagService.check('droneRelayRepaired');
  }

  showDroneCounts(region: RegionListItem): boolean {
    if (region.dronesAssigned > 0) {return true;}
    if (region.droneSlots > 1) {return true;}
    return false;
  }

  showDroneControl(feature: FeatureListItem): boolean {
    return feature.region.droneSlots > 0 && feature.droneSlots > 0;
  }

  assignDrone(feature: FeatureListItem) {
    this.planetService.assignDrone(feature.featureInstance);
  }

  unassignDrone(feature: FeatureListItem) {
    this.planetService.unassignDrone(feature.featureInstance);
  }

  canAssignDrone(region: RegionListItem, feature: FeatureListItem) {
    return feature.dronesAssigned < feature.droneSlots &&
    region.dronesAssigned < region.droneSlots &&
    this.planetService.getIdleDrones() > 0;
  }

  canUnassignDrone(region: RegionListItem, feature: FeatureListItem) {
    return feature.dronesAssigned > 0;
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
    item.droneSlots = regionInteraction.droneSlots;
    item.dronesAssigned = regionInteraction.assignedDrones;
    item.canGather = item.outpostLevel > 0;
    item.droneHubCost = this.planetService.getDroneHubCost(region.instanceId);

    // Get all hidden features, and find the lowest survey required one,
    // So we know which level to cut off hints at
    let hintLevel = 0;
    const hiddenFeatures = region.features.filter(x => x.hiddenBehindSurvey > item.surveyLevel);
    if (hiddenFeatures.length > 0) {
      hintLevel = Math.min(...hiddenFeatures.map(x => x.hiddenBehindSurvey));
    }

    region.features.forEach(f => {
      const featureInteraction = regionInteraction.getFeature(f.instanceId);
      item.features.push(this.createFeatureListItem(item, f, featureInteraction, item.outpostLevel, item.surveyLevel, hintLevel));
    });
    return item;
  }

  private createFeatureListItem(regionItem: RegionListItem, feature: Feature, featureInteraction: FeatureInteraction, outpostLevel: number, surveyLevel: number, hintLevel: number): FeatureListItem {
    const featureDef = this.planetService.getFeatureDefinition(feature.name);
    const item = new FeatureListItem();
    item.region = regionItem;
    item.featureInstance = feature;
    item.name = feature.name;
    item.id = feature.instanceId;
    item.surveyNeeded = feature.hiddenBehindSurvey;
    item.canGather = outpostLevel === 0;
    item.active = item.surveyNeeded <= surveyLevel;
    item.droneSlots = featureDef.droneSlots;
    item.dronesAssigned = featureInteraction.assignedDrones;
    item.hintActive = item.surveyNeeded > surveyLevel && item.surveyNeeded <= hintLevel;
    featureDef.abilities.forEach((a, i) => {
      if (a.visibleUpgrade != '' && !this.researchService.isUpgradeCompleted(a.visibleUpgrade)) {return;}
      const ability = new AbilityItem();
      ability.def = a;
      ability.name = a.name;
      ability.index = i;
      ability.canActivate = true;
      item.abilities.push(ability);
    });
    this.populateFeatureTasks(regionItem.id, item);

    return item;
  }

  private updateFeatureListItem(planetId: number, regionId: number, featureId: number) {
    if (planetId != this.getSelectedPlanet().instanceId) {return;}
    const regionItem = this.regionList.find(x => x.id === regionId);
    if (regionItem == null) {return;}
    const featureItem = regionItem.features.find(x => x.id === featureId);
    if (featureItem == null) {
      return; //TODO: Create feature list item
    }
    this.populateFeatureTasks(regionId, featureItem);
  }

  private populateFeatureTasks(regionId: number, featureItem: FeatureListItem) {
    featureItem.tasks = [];
    const featureDef = this.planetService.getFeatureDefinition(featureItem.name);
    const featureInstance = this.planetService.getFeature(regionId, featureItem.id);
    const featureInteraction = this.planetService.getPlanetInteractionModel()
                                .regions.getFeature(regionId, featureItem.id);
    featureDef.tasks.forEach(tDef => {
      const instance = featureInteraction.tasks.find(x => x.definition === tDef);
      if (instance != null && instance.progress >= instance.needed && !tDef.repeatable) {return;}
      const taskItem = new TaskItem();
      taskItem.regionId = regionId;
      taskItem.featureId = featureItem.id;
      taskItem.def = tDef;
      taskItem.instance = instance;
      taskItem.index = featureItem.tasks.length;
      featureItem.tasks.push(taskItem);
    });
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
  public droneHubCost: ResourceCollection;
  public features: FeatureListItem[] = [];
  public canGather = false;
}

export class FeatureListItem {
  public region: RegionListItem;
  public featureInstance: Feature;
  public name: string;
  public id: number;
  public surveyNeeded: number;
  public active: boolean;
  public hintActive: boolean;
  public dronesAssigned: number;
  public droneSlots: number;
  public canGather: boolean;
  public abilities: AbilityItem[] = [];
  public tasks: TaskItem[] = [];
}

export class AbilityItem {
  public def: AbilityDefinition;
  public name: string;
  public index: number;
  public canActivate: boolean;
}

export class TaskItem {
  public regionId: number;
  public featureId: number;
  public def: TaskDefinition;
  public instance: FeatureTask;
  public index: number;

  public progress(): number {
    if (this.instance != null) {return this.instance.progress;}
    return 0;
  }
}

export class RegionDetailsViewModel {
  public name = '';
  public description = '';
  public currentProduction: ResourceCollection = new ResourceCollection();
}
