import { Injectable } from '@angular/core';
import { ResearchService } from './research.service';
import { Task, SurveyTask, ResearchTask, FeatureTask } from '../models/task';
import { TimeService } from './time.service';
import { PlanetService } from './planet.service';
import { FeatureAction } from '../staticData/actionDefinitions';
import { ActionService } from './action.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  _currentTask: Task = null;

  constructor(private _actionService: ActionService, private _planetService: PlanetService, private _researchService: ResearchService, private _timeService: TimeService) { }

  init() {
    this._timeService.tick.subscribe(x => this.update(x));
  }

  public getCurrentTask(): Task {
    return this._currentTask;
  }

  public clearTask() {
    this._currentTask = null;
  }

  public beginTask(task: Task) {
    this._currentTask = task;
  }

  public beginFeatureTask(planetId: number, regionId: number, featureId: number, taskName: string) {
    const feature = this._planetService.getFeature(regionId, featureId, planetId);
    const featureDef = this._planetService.getFeatureDefinition(feature.name);
    const featureInteraction = this._planetService.getPlanetInteractionModel(planetId)
                                    .regions.getFeature(regionId, featureId);
    const taskDef = featureDef.tasks.find(x => x.name === taskName);
    let taskInstance = featureInteraction.tasks.find(x => x.name === taskName);
    if (taskInstance == null) {
      taskInstance = new FeatureTask();
      taskInstance.name = taskDef.name;
      taskInstance.needed = taskDef.needed;
      taskInstance.definition = taskDef;
      taskInstance.planetId = planetId;
      taskInstance.regionId = regionId;
      taskInstance.featureId = featureId;
      taskInstance.progress = 0;
      featureInteraction.tasks.push(taskInstance);
    }
    this.beginTask(taskInstance);
  }

  public beginSurvey(planetId: number, regionId: number) {
    const surveyTask = new SurveyTask();
    surveyTask.name = "Surveying"; //TODO: Region name
    surveyTask.planetId = planetId;
    surveyTask.regionId = regionId;
    surveyTask.progress = 0;
    surveyTask.needed = 100;
    this._currentTask = surveyTask;
  }

  public beginResearch(discipline: string) {
    const researchTask = new ResearchTask();
    researchTask.name = "Researching " + discipline;
    researchTask.discipline = discipline;
    researchTask.progress = 0;
    researchTask.needed = 100;
    this._currentTask = researchTask;
  }

  public update(dT: number) {
    if (this._currentTask == null) {return;}

    if (this._currentTask instanceof SurveyTask) {
      const surveyTask = this._currentTask as SurveyTask;
      this.tickSurveyTask(surveyTask, dT);
    }

    if (this._currentTask instanceof ResearchTask) {
      const researchTask = this._currentTask as ResearchTask;
      this.tickResearchTask(researchTask, dT);
    }

    if (this._currentTask instanceof FeatureTask) {
      const featureTask = this._currentTask as FeatureTask;
      this.tickFeatureTask(featureTask, dT);
    }
  }

  tickSurveyTask(task: SurveyTask, dT: number) {
    const planetId = task.planetId;
    const regionId = task.regionId;

    this._planetService.surveyRegion(0.01*dT, regionId, planetId);
    task.needed = this._planetService.getSurveyProgressNeeded(regionId, planetId);
    task.progress = this._planetService.getPlanetInteractionModel(planetId).regions.getRegion(regionId).surveyProgress;
  }

  tickResearchTask(task: ResearchTask, dT: number) {
    const discipline = task.discipline;
    const theoryBonus = this._researchService.theoryBonus(discipline);
    this._researchService.addKnowledge(discipline, 0.01*theoryBonus*dT);
    task.needed = this._researchService.knowledgeNeeded(discipline);
    task.progress = this._researchService.getProgress(discipline).knowledgeProgress;
  }

  tickFeatureTask(task: FeatureTask, dT: number) {
    const planetId = task.planetId;
    const regionId = task.regionId;
    const featureId = task.featureId;
    task.progress += task.definition.baseRate*dT;
    if (task.progress >= task.needed) {
      this.completeFeatureTask(task);
    }
  }

  completeFeatureTask(task: FeatureTask) {
    task.definition.resultsOnComplete.forEach(action => {
      if (action instanceof FeatureAction) {
        (action as FeatureAction).doFeatureAction(this._actionService, this._planetService.getFeature(task.regionId, task.featureId, task.planetId));
      }
      else {
        action.doAction(this._actionService);
      }
    });
    if (task.definition.repeatable) {
      task.progress = 0;
    }
    else {
      this.clearTask();
    }
  }
}
