import { Component, OnInit } from '@angular/core';
import { ResearchService } from '../../../services/research.service';
import { ResearchProgress } from 'src/app/models/research';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-si-research',
  templateUrl: './si-research.component.html',
  styleUrls: ['./si-research.component.scss']
})
export class SiResearchComponent implements OnInit {

  researchList: ResearchListItem[] = [];

  constructor(private _researchService: ResearchService, private _taskService: TaskService) { }

  ngOnInit() {
    this._researchService.onResearchUpdated.subscribe(() => {this.updateResearchList();});
    this.updateResearchList();
  }

  research(item: ResearchListItem) {
    this._taskService.beginResearch(item.name);
  }

  updateResearchList() {
    while (this.researchList.length > 0) { this.researchList.pop(); }

    this._researchService.getDisciplines().forEach(discipline => {
      if (!this._researchService.hasProgress(discipline.name)) {return;}
      const progress = this._researchService.getProgress(discipline.name);
      if (progress.theoryLevel < 1) {return;}
      const item: ResearchListItem = {
        name: discipline.name,
        progress: progress
      };
      this.researchList.push(item);
    });
  }

  getKnowledgeNeeded(research: ResearchListItem): number {
    return this._researchService.knowledgeNeeded(research.name);
  }

  getTheoryNeeded(research: ResearchListItem): number {
    return this._researchService.theoryNeeded(research.name);
  }
}

export class ResearchListItem {
  public name: string;
  public progress: ResearchProgress;
}
