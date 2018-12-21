import { Component, OnInit } from '@angular/core';
import { ResearchService } from '../../../services/research.service';

@Component({
  selector: 'app-si-upgrades',
  templateUrl: './si-upgrades.component.html',
  styleUrls: ['./si-upgrades.component.scss']
})
export class SiUpgradesComponent implements OnInit {

  upgradeList: UpgradeListItem[] = [];

  constructor(private _researchService: ResearchService) { }

  ngOnInit() {
    this.updateUpgradeList();
  }

  updateUpgradeList() {
    while (this.upgradeList.length > 0) { this.upgradeList.pop(); }

    this._researchService.getCompletedResearch().forEach(x => {
      const researchDef = this._researchService.getResearchDefinition(x);
      const item: UpgradeListItem = {
        name: x,
        researched: true,
        cost: researchDef.cost
      };
      this.upgradeList.push(item);
    });

    this._researchService.getAvailableResearch().forEach(x => {
      const researchDef = this._researchService.getResearchDefinition(x);
      const item: UpgradeListItem = {
        name: x,
        researched: false,
        cost: researchDef.cost
      };
      this.upgradeList.push(item);
    });
  }

  onClickUpgradeItem(item: UpgradeListItem) {
    if (item.researched) { return; }
    this._researchService.buyResearch(item.name);
    this.updateUpgradeList();
  }
}

class UpgradeListItem {
  public name: string;
  public researched: boolean;
  public cost: number;
}
