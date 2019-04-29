import { Component, OnInit } from '@angular/core';
import { FlagsService } from '../../services/flags.service';

@Component({
  selector: 'app-planet-interaction',
  templateUrl: './planet-interaction.component.html',
  styleUrls: ['./planet-interaction.component.scss']
})
export class PlanetInteractionComponent implements OnInit {

  public showStructures = false;
  public showTerrain = false;
  public showUpgrades = false;

  constructor(private flagsService: FlagsService) { }

  ngOnInit() {
    this.flagsService.onFlagsUpdated.subscribe(() => this.updateTabVisibility());
  }

  updateTabVisibility() {
    this.showStructures = this.flagsService.showStructures;
    this.showTerrain = this.flagsService.showTerrain;
    this.showUpgrades = this.flagsService.showUpgrades;
  }
}
