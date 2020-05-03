import { Injectable } from '@angular/core';
import { RESEARCH_LIBRARY, ResearchDiscipline } from '../staticData/researchDefinitions';
import { UPGRADE_LIBRARY, UpgradeDefinition } from '../staticData/upgradeDefinitions';
import { Subject } from 'rxjs';
import { ResourceService } from './resource.service';
import { ResearchProgress } from '../models/research';
import { FlagsService } from './flags.service';
import { ActionService } from './action.service';

@Injectable({
  providedIn: 'root'
})
export class ResearchService {

  researchProgress: ResearchProgress[] = [];
  unlockedUpgrades: string[] = [];
  completedUpgrades: string[] = [];

  public onResearchUpdated: Subject<void> = new Subject();

  constructor(private _flagService: FlagsService, private _resourceService: ResourceService) { }

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
    const def = this.getDiscipline(discipline);
    const progress = this.getProgress(discipline);
    const needed = this.knowledgeNeeded(discipline);
    progress.knowledgeProgress += amount;
    while (progress.knowledgeProgress >= needed) {
      progress.knowledgeProgress -= needed;
      progress.knowledgeLevel++;
      if (def.upgradeUnlocks.has(progress.knowledgeLevel)) {
        this.unlockedUpgrades.push(def.upgradeUnlocks.get(progress.knowledgeLevel));
      }
      if (def.flagUnlocks.has(progress.knowledgeLevel)) {
        this._flagService.set(def.upgradeUnlocks.get(progress.knowledgeLevel));
      }

      this.onResearchUpdated.next();
    }

  }

  addTheory(discipline: string, amount: number) {
    const progress = this.getProgress(discipline);
    const needed = this.theoryNeeded(discipline);
    progress.theoryProgress += amount;
    while (progress.theoryProgress >= needed) {
      progress.theoryProgress -= needed;
      progress.theoryLevel++;
      this.onResearchUpdated.next();
    }
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
    return this.unlockedUpgrades;
  }

  getCompletedUpgrades(): string[] {
    return this.completedUpgrades;
  }

  getUpgradeDefinition(upgrade: string): UpgradeDefinition {
    let def = UPGRADE_LIBRARY.find(x => x.name === upgrade);
    if (def == null) {
      def = new UpgradeDefinition(upgrade, 'MISSING');
      UPGRADE_LIBRARY.push(def);
    }
    return def;
  }

  getNextLevelWithAdvancement(discipline: string): number {
    const disc = this.getDiscipline(discipline);
    const currLevel = this.getProgress(discipline).knowledgeLevel;
    let nextLv = 0;
    disc.upgradeUnlocks.forEach((name, lv) => {
      if (lv <= currLevel) {return;}
      if (nextLv == 0 || lv < nextLv) {
        nextLv = lv;
      }
    });
    disc.flagUnlocks.forEach((name, lv) => {
      if (lv <= currLevel) {return;}
      if (nextLv == 0 || lv < nextLv) {
        nextLv = lv;
      }
    });
    return nextLv;
  }

  buyUpgrade(upgrade: string): boolean {
    const def = this.getUpgradeDefinition(upgrade);
    const upgradeCost = def.cost;
    let result = false;
    if (!this.completedUpgrades.some(x => x === upgrade)) {
      const spentResourcesSuccessfully = this._resourceService.spend(upgradeCost);
      if (spentResourcesSuccessfully) {
        result = true;
        const unlockIndex = this.unlockedUpgrades.indexOf(upgrade);
        if (unlockIndex > -1) {this.unlockedUpgrades.splice(unlockIndex, 1);}
        this.completedUpgrades.push(upgrade);
      }
    }
    this.onResearchUpdated.next();
    return result;
  }
}
