import { Component, OnInit, ViewChild } from '@angular/core';
import {Planet} from '../../models/planet';
import {PlanetService} from '../../services/planet.service';

@Component({
  selector: 'app-system-overview',
  templateUrl: './system-overview.component.html',
  styleUrls: ['./system-overview.component.scss']
})
export class SystemOverviewComponent implements OnInit {

  planets: Planet[];

  selectedPlanet: Planet;

  constructor(private planetService: PlanetService) {
    this.planetService.selectedPlanetChanged.subscribe(x => this.updateSelectedPlanet());
  }

  ngOnInit() {
    this.getSystem();
    this.selectedPlanet = this.getSelectedPlanet();
  }

  updateSelectedPlanet() {
    this.selectedPlanet = this.getSelectedPlanet();
  }

  onSelectionChange(event: Planet) {
    this.planetService.selectPlanet(this.selectedPlanet.instanceId);
  }

  getSystem(): void {
    this.planets = this.planetService.getCurrentSystem();
  }

  getSelectedPlanet(): Planet {
    return this.planetService.getSelectedPlanet();
  }

}
