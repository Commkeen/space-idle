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
  public showOutpostPanel = false;
  public showTerrain = true;
  public showStructures = false;
  public showUpgrades = false;
  public showPower = false;

  public flags: Set<string> = new Set<string>();

  public onFlagsUpdated: Subject<void> = new Subject();

  constructor(private _planetService: PlanetService, private _timeService: TimeService,
              private _resourceService: ResourceService, private _researchService: ResearchService) {}

  init(): void {
    this._planetService.onOutpostUpgraded.subscribe(x =>
      this.onOutpostUpgraded()
    );
    this._researchService.onResearchUpdated.subscribe(x =>
      this.onResearchUpdated()
    );
    this._timeService.tick.subscribe(x => this.update(x));
    this.onFlagsUpdated.next();
  }

  update(dT: number) {
    if (!this.showTerrain) { this.checkForTerrainTabUnlock(); }
    if (!this.showOutpostPanel) { this.checkForOutpostPanelUnlock(); }
  }

  check(flag: string): boolean {
    return this.flags.has(flag);
  }

  set(flag: string) {
    this.flags.add(flag);
  }

  clear(flag: string) {
    this.flags.delete(flag);
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

  checkForOutpostPanelUnlock(): void {
    if (this._resourceService.globalResources.has('metal')) {
      this.showOutpostPanel = true;
      this.onFlagsUpdated.next();
    }
  }
}
