import { Component, OnInit } from '@angular/core';
import { PlanetService } from 'src/app/services/planet.service';
import { Planet } from 'src/app/models/planet';
import { PlanetInteractionModel } from 'src/app/models/planetInteractionModel';

@Component({
  selector: 'app-pi-command',
  templateUrl: './pi-command.component.html',
  styleUrls: ['./pi-command.component.scss']
})
export class PiCommandComponent implements OnInit {

  currentDrones: number;
  maxDrones: number;
  idleDrones: number;
  droneTasks: DroneTaskItem[] = [];

  constructor(private planetService: PlanetService) {
    this.droneTasks.push(new DroneTaskItem('Survey'));
    this.droneTasks.push(new DroneTaskItem('Mining'));
    this.droneTasks.push(new DroneTaskItem('Logging'));

    this.planetService.selectedPlanetChanged.subscribe(x => this.updateDrones());
  }

  ngOnInit() {

  }

  getSelectedPlanet(): Planet {
    return this.planetService.getSelectedPlanet();
  }

  getSelectedPlanetInteractionModel(): PlanetInteractionModel {
    return this.planetService.getSelectedPlanetInteractionModel();
  }

  updateDrones(): void {
    const drones = this.getSelectedPlanetInteractionModel().drones;
    this.maxDrones = drones.droneCapacity;
    this.currentDrones = drones.getTotal();
    this.idleDrones = drones.getIdle();
    this.droneTasks.forEach(element => {
      element.assigned = drones.get(element.name);
    });
  }

  onBuildDrone(): void {
    if (this.currentDrones < this.maxDrones) {
      this.getSelectedPlanetInteractionModel().drones.createDrone();
      this.updateDrones();
    }
  }

  onAssignDrone(task: string): void {
    this.getSelectedPlanetInteractionModel().drones.assign(task);
    this.updateDrones();
  }

  onUnassignDrone(task: string): void {
    this.getSelectedPlanetInteractionModel().drones.unassign(task);
    this.updateDrones();
  }

}

class DroneTaskItem {
  constructor(public name: string) {
    this.assigned = 0;
  }
  public assigned: number;
}
