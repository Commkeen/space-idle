import { Injectable } from '@angular/core';
import { ResearchService } from './research.service';
import { Task, SurveyTask, ResearchTask } from '../models/task';
import { TimeService } from './time.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  _currentTask: Task = null;

  constructor(private _researchService: ResearchService, private _timeService: TimeService) { }

  init() {
    this._timeService.tick.subscribe(x => this.update(x));
  }

  public getCurrentTask(): Task {
    return this._currentTask;
  }

  public beginTask(task: Task) {
    this._currentTask = task;
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
  }

  tickSurveyTask(task: SurveyTask, dT: number) {
    const planetId = task.planetId;
    const regionId = task.regionId;
  }

  tickResearchTask(task: ResearchTask, dT: number) {
    const discipline = task.discipline;
    const theoryBonus = this._researchService.theoryBonus(discipline);
    this._researchService.addKnowledge(discipline, 0.01*theoryBonus*dT);
    task.needed = this._researchService.knowledgeNeeded(discipline);
    task.progress = this._researchService.getProgress(discipline).knowledgeProgress;
  }
}
