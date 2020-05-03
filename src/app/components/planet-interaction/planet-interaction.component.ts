import { Component, OnInit } from '@angular/core';
import { FlagsService } from '../../services/flags.service';
import { ResourceService } from 'src/app/services/resource.service';
import { PlanetService } from 'src/app/services/planet.service';

@Component({
  selector: 'app-planet-interaction',
  templateUrl: './planet-interaction.component.html',
  styleUrls: ['./planet-interaction.component.scss']
})
export class PlanetInteractionComponent implements OnInit {

  public showStructures = false;
  public showResearch = false;

  constructor(private planetService: PlanetService, private resourceService: ResourceService, private flagsService: FlagsService) { }

  ngOnInit() {
    this.flagsService.onFlagsUpdated.subscribe(() => this.updateTabVisibility());
    this.updateTabVisibility();
  }

  updateTabVisibility() {
    this.showStructures = this.flagsService.check('showStructureTab');
    this.showResearch = this.flagsService.check('showResearchTab');
  }

  droneCount(): number {
    return this.resourceService.get('drones');
  }

  droneCap(): number {
    return this.resourceService.getMax('drones');
  }

  dronesIdle(): number {
    const interaction = this.planetService.getPlanetInteractionModel();
    return this.droneCount() - interaction.regions.getTotalAssignedDrones();
  }

  powerUsed(): number {
    const interaction = this.planetService.getPlanetInteractionModel();
    return interaction.localResources.getConsumption('power');
  }

  powerAvailable(): number {
    const interaction = this.planetService.getPlanetInteractionModel();
    return interaction.localResources.getProduction('power');
  }
}
