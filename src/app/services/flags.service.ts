import { Injectable, OnInit } from '@angular/core';
import { PlanetService } from './planet.service';
import { Feature } from '../models/planet';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FlagsService {

  public showDroneBuild = false;
  public showDroneMine = false;
  public showDroneHarvest = false;
  public showDroneSift = false;
  public showUpgrades = false;

  public onFlagsUpdated: Subject<void> = new Subject();

  constructor(private _planetService: PlanetService) { }

  init(): void {
    this._planetService.onFeatureSurveyed.subscribe(x => this.onFeatureSurveyed(x));
  }

  onFeatureSurveyed(feature: Feature): void {
    if (feature.genericName === 'crash site')
    {
      this.showDroneBuild = true;
    }
    if (feature.genericName === 'hills')
    {
      this.showDroneMine = true;
    }
    if (feature.genericName === 'forest')
    {
      this.showDroneHarvest = true;
    }
    if (feature.genericName === 'coast')
    {
      this.showDroneSift = true;
    }
    this.onFlagsUpdated.next();
  }
}
