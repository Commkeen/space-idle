import { Injectable } from '@angular/core';
import { RESEARCH_LIBRARY, ResearchDefinition } from '../staticData/researchDefinitions';
import { UPGRADE_LIBRARY, UpgradeDefinition } from '../staticData/upgradeDefinitions';
import { Subject } from 'rxjs';
import { ResourceService } from './resource.service';

@Injectable({
  providedIn: 'root'
})
export class ResearchService {

  completedResearch: string[] = [];
  completedUpgrades: string[] = [];

  public onResearchUpdated: Subject<void> = new Subject();

  constructor(private _resourceService: ResourceService) { }

  isResearchCompleted(research: string) {
    return this.completedResearch.some(x => x === research);
  }

  getAvailableResearch(): string[] {
    const availableResearch: string[] = [];
    RESEARCH_LIBRARY.forEach(def => {
      if (!this.isResearchCompleted(def.name) &&
        (def.prerequisite == null || this.isResearchCompleted(def.prerequisite))
      ) {
        availableResearch.push(def.name);
      }
    });
    return availableResearch;
  }

  getCompletedResearch(): string[] {
    return this.completedResearch;
  }

  getResearchDefinition(research: string): ResearchDefinition {
    return RESEARCH_LIBRARY.find(x => x.name === research);
  }

  buyResearch(research: string) {
    if (!this.completedResearch.some(x => x === research)) {
      this.completedResearch.push(research);
    }
    this.onResearchUpdated.next();
  }

  isUpgradeCompleted(upgrade: string) {
    return this.completedUpgrades.some(x => x === upgrade);
  }

  areUpgradesCompleted(upgrades: string[]) {
    let completed = true;
    upgrades.forEach(upgrade => {
      completed = completed && this.isUpgradeCompleted(upgrade);
    });
    return completed;
  }

  getAvailableUpgrades(): string[] {
    // TODO: Uses upgrades as prereqs for now, switch to using research
    const availableUpgrades: string[] = [];
    UPGRADE_LIBRARY.forEach(def => {
      if (!this.isUpgradeCompleted(def.name) &&
        (def.researchNeeded == null || def.researchNeeded === '' || this.isUpgradeCompleted(def.researchNeeded))) {
        availableUpgrades.push(def.name);
      }
    });
    return availableUpgrades;
  }

  getCompletedUpgrades(): string[] {
    return this.completedUpgrades;
  }

  getUpgradeDefinition(upgrade: string): UpgradeDefinition {
    return UPGRADE_LIBRARY.find(x => x.name === upgrade);
  }

  buyUpgrade(upgrade: string) {
    const upgradeCost = this.getUpgradeDefinition(upgrade).cost;
    if (!this.completedUpgrades.some(x => x === upgrade)) {
      const spentResourcesSuccessfully = this._resourceService.spend(upgradeCost);
      if (spentResourcesSuccessfully) {
        this.completedUpgrades.push(upgrade);
      }
    }
    this.onResearchUpdated.next();
  }
}
