import { Injectable } from '@angular/core';
import { RESEARCH_LIBRARY, ResearchDefinition } from '../staticData/researchDefinitions';

@Injectable({
  providedIn: 'root'
})
export class ResearchService {

  completedResearch: string[] = [];
  completedUpgrades: string[] = [];

  constructor() { }

  isResearchCompleted(research: string) {
    return this.completedResearch.some(x => x === research);
  }

  getAvailableResearch(): string[] {
    const availableResearch: string[] = [];
    RESEARCH_LIBRARY.forEach(def => {
      if ( !this.isResearchCompleted(def.name) &&
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
  }
}
