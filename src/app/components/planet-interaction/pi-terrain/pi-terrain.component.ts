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
import { TaskService } from 'src/app/services/task.service';
import { TaskDefinition } from 'src/app/staticData/taskDefinitions';
import { FeatureTask } from 'src/app/models/task';

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

  activateTask(taskItem: TaskItem) {
    this.taskService.beginFeatureTask(this.getSelectedPlanet().instanceId, taskItem.regionId, taskItem.featureId, taskItem.def.name);
    this.updateRegionList();
  }

  taskIsVisible(taskItem: TaskItem): boolean {
    if (!taskItem.def.repeatable && taskItem.instance != null && taskItem.instance.progress >= taskItem.instance.needed) {return false;}
    return true;
  }

  survey(regionId: number) {
    const useSurveyTask = this.flagService.check('surveyRepaired');
    if (useSurveyTask) {
      this.taskService.beginSurvey(this.getSelectedPlanet().instanceId, regionId);
    }
    else {
      this.planetService.surveyRegion(10, regionId);
    }

    this.updateRegionList();
  }

  canAffordSurvey(regionId: number): boolean {
    return true; // TODO
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
      item.features.push(this.createFeatureListItem(region.instanceId, f, featureInteraction, item.outpostLevel, item.surveyLevel, hintLevel));
    });
    return item;
  }

  private createFeatureListItem(regionId: number, feature: Feature, featureInteraction: FeatureInteraction, outpostLevel: number, surveyLevel: number, hintLevel: number): FeatureListItem {
    const featureDef = this.planetService.getFeatureDefinition(feature.name);
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
    this.populateFeatureTasks(regionId, item);

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
  public tasks: TaskItem[] = [];
}

export class AbilityItem {
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
