import { Component, OnInit, ViewChild, EventEmitter, Output } from '@angular/core';
import {Planet} from '../../models/planet';
import {PlanetService} from '../../services/planet.service';

@Component({
  selector: 'app-system-overview',
  templateUrl: './system-overview.component.html',
  styleUrls: ['./system-overview.component.scss']
})
export class SystemOverviewComponent implements OnInit {

  planets: Planet[] = [];

  selectedPlanet: Planet;

  @Output() shipSelected = new EventEmitter<boolean>();

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
    if (event.name === "Ship") {
      this.shipSelected.next(true);
    }
    else {
      this.planetService.selectPlanet(this.selectedPlanet.instanceId);
      this.shipSelected.next(false);
    }
  }

  getSystem(): void {
    this.planets = [];
    const ship = new Planet();
    ship.name = "Ship";
    this.planets.push(ship);
    this.planets = this.planets.concat(this.planetService.getCurrentSystem());
  }

  getSelectedPlanet(): Planet {
    return this.planetService.getSelectedPlanet();
  }

}
