import { Injectable } from '@angular/core';
import { RESEARCH_LIBRARY, ResearchDiscipline } from '../staticData/researchDefinitions';
import { UPGRADE_LIBRARY, UpgradeDefinition } from '../staticData/upgradeDefinitions';
import { Subject } from 'rxjs';
import { ResourceService } from './resource.service';
import { ResearchProgress } from '../models/research';

@Injectable({
  providedIn: 'root'
})
export class ResearchService {

  researchProgress: ResearchProgress[] = [];
  completedUpgrades: string[] = [];

  public onResearchUpdated: Subject<void> = new Subject();

  constructor(private _resourceService: ResourceService) { }

  getDiscipline(discipline: string): ResearchDiscipline {
    return RESEARCH_LIBRARY.find(x => x.name === discipline);
  }

  getDisciplines(): ResearchDiscipline[] {
    return RESEARCH_LIBRARY;
  }

  hasProgress(discipline: string): boolean {
    return this.researchProgress.find(x => x.discipline === discipline) != null;
  }

  getProgress(discipline: string): ResearchProgress {
    let progress = this.researchProgress.find(x => x.discipline === discipline);
    if (progress != null) {return progress;}
    progress = new ResearchProgress();
    progress.discipline = discipline;
    this.researchProgress.push(progress);
    return progress;
  }

  addKnowledge(discipline: string, amount: number) {
    const progress = this.getProgress(discipline);
    const needed = this.knowledgeNeeded(discipline);
    progress.knowledgeProgress += amount;
    if (progress.knowledgeProgress >= needed) {
      progress.knowledgeProgress -= needed;
      progress.knowledgeLevel++;
    }
    this.onResearchUpdated.next();
  }

  addTheory(discipline: string, amount: number) {
    const progress = this.getProgress(discipline);
    const needed = this.theoryNeeded(discipline);
    progress.theoryProgress += amount;
    if (progress.theoryProgress >= needed) {
      progress.theoryProgress -= needed;
      progress.theoryLevel++;
    }
    this.onResearchUpdated.next();
  }

  knowledgeNeeded(disciplineName: string): number {
    const discipline = RESEARCH_LIBRARY.find(x => x.name === disciplineName);
    if (discipline == null) {return 0;}
    const progress = this.getProgress(disciplineName);
    const baseCost = ResearchDiscipline.baseKnowledgeCost * discipline.baseCostMultiplier;
    const costExponent = ResearchDiscipline.knowledgeExpCost * discipline.compoundingCostMultiplier;
    return baseCost * Math.pow(costExponent, progress.knowledgeLevel);
  }

  theoryNeeded(disciplineName: string): number {
    return ResearchDiscipline.baseTheoryCost;
  }

  theoryBonus(discipline: string): number {
    const progress = this.getProgress(discipline);
    return Math.pow(2, progress.theoryLevel);
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
