import { Injectable, OnInit } from '@angular/core';
import { PlanetService } from './planet.service';
import { Feature } from '../models/planet';
import { Subject } from 'rxjs';
import { TimeService } from './time.service';
import { ResourceService } from './resource.service';
import { ResearchService } from './research.service';

@Injectable({
  providedIn: 'root'
})
export class FlagsService {
  public showDroneBuild = false;
  public showDroneMine = false;
  public showDroneHarvest = false;
  public showDroneSift = false;
  public showTerrain = false;
  public showStructures = false;
  public showUpgrades = false;

  public onFlagsUpdated: Subject<void> = new Subject();

  constructor(private _planetService: PlanetService, private _timeService: TimeService,
              private _resourceService: ResourceService, private _researchService: ResearchService) {}

  init(): void {
    this._planetService.onFeatureSurveyed.subscribe(x =>
      this.onFeatureSurveyed(x)
    );
    this._planetService.onOutpostUpgraded.subscribe(x =>
      this.onOutpostUpgraded()
    );
    this._researchService.onResearchUpdated.subscribe(x =>
      this.onResearchUpdated()
    );
    this._timeService.tick.subscribe(x => this.update(x));
  }

  update(dT: number) {
    if (!this.showTerrain) { this.checkForTerrainTabUnlock(); }
  }

  onFeatureSurveyed(feature: Feature): void {
    if (feature.genericName === 'crash site') {
      this.showDroneBuild = true;
    }
    if (feature.genericName === 'hills') {
      this.showDroneMine = true;
    }
    if (feature.genericName === 'forest') {
      this.showDroneHarvest = true;
    }
    if (feature.genericName === 'coast') {
      this.showDroneSift = true;
    }
    this.onFlagsUpdated.next();
  }

  onOutpostUpgraded(): void {
    this.showUpgrades = true;
    this.onFlagsUpdated.next();
  }

  onResearchUpdated(): void {
    if (!this.showStructures && this._researchService.isUpgradeCompleted('Construction'))
    {
      this.showStructures = true;
      this.onFlagsUpdated.next();
    }
  }

  checkForTerrainTabUnlock(): void {
    if (this._resourceService.globalResources.has('survey', 5)) {
      this.showTerrain = true;
      this.onFlagsUpdated.next();
    }
  }
}
