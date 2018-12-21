import { Component, OnInit } from '@angular/core';
import { ResearchService } from '../../../services/research.service';

@Component({
  selector: 'app-si-research',
  templateUrl: './si-research.component.html',
  styleUrls: ['./si-research.component.scss']
})
export class SiResearchComponent implements OnInit {

  researchList: ResearchListItem[] = [];

  constructor(private _researchService: ResearchService) { }

  ngOnInit() {
    this.updateResearchList();
  }

  updateResearchList() {
    while (this.researchList.length > 0) { this.researchList.pop(); }

    this._researchService.getCompletedResearch().forEach(x => {
      const researchDef = this._researchService.getResearchDefinition(x);
      const item: ResearchListItem = {
        name: x,
        researched: true,
        cost: researchDef.cost
      };
      this.researchList.push(item);
    });

    this._researchService.getAvailableResearch().forEach(x => {
      const researchDef = this._researchService.getResearchDefinition(x);
      const item: ResearchListItem = {
        name: x,
        researched: false,
        cost: researchDef.cost
      };
      this.researchList.push(item);
    });
  }

  onClickResearchItem(item: ResearchListItem) {
    if (item.researched) { return; }
    this._researchService.buyResearch(item.name);
    this.updateResearchList();
  }
}

export class ResearchListItem {
  public name: string;
  public researched: boolean;
  public cost: number;
}
