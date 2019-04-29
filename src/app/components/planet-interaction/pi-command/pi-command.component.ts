import { Component, OnInit } from '@angular/core';
import { PlanetService } from 'src/app/services/planet.service';
import { Planet } from 'src/app/models/planet';
import { PlanetInteractionModel } from 'src/app/models/planetInteractionModel';
import { FlagsService } from 'src/app/services/flags.service';
import { isNullOrUndefined } from 'util';

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

  showBuildDrone: boolean;
  showOutpostPanel: boolean;

  outpostLevel: number;
  outpostName: string;
  outpostUpgradeVisible: boolean;
  outpostUpgradeEnabled: boolean;
  outpostUpgradeText: string;

  constructor(private planetService: PlanetService, private flagsService: FlagsService) {
    this.droneTasks.push(new DroneTaskItem('Survey'));
    this.droneTasks.push(new DroneTaskItem('Mining'));
    this.droneTasks.push(new DroneTaskItem('Logging'));
    this.droneTasks.push(new DroneTaskItem('Sifting'));
    this.revealDroneTask('Survey');

    this.planetService.selectedPlanetChanged.subscribe(x => this.updateDrones());
    this.planetService.selectedPlanetChanged.subscribe(x => this.updateOutpost());
  }

  ngOnInit() {
    this.flagsService.onFlagsUpdated.subscribe(() => this.onFlagsUpdated());
  }

  getSelectedPlanet(): Planet {
    return this.planetService.getSelectedPlanet();
  }

  getSelectedPlanetInteractionModel(): PlanetInteractionModel {
    return this.planetService.getSelectedPlanetInteractionModel();
  }

  updateOutpost(): void {
    const outpostDef = this.planetService.getOutpostTypeForPlanet();
    this.outpostLevel = this.getSelectedPlanetInteractionModel().outpostLevel;
    if (this.outpostLevel === 0) {
      this.outpostName = '';
      this.outpostUpgradeText = 'Build Outpost';
      this.outpostUpgradeVisible = true;
      this.outpostUpgradeEnabled = true;
      return;
    }

    const outpostLevelDef = outpostDef.levels.find(x => x.level === this.outpostLevel);
    const outpostNextLevelDef = outpostDef.levels.find(x => x.level === this.outpostLevel + 1);
    this.outpostName = outpostLevelDef.name;
    if (isNullOrUndefined(outpostNextLevelDef)) {
      this.outpostUpgradeVisible = false;
      this.outpostUpgradeEnabled = false;
      return;
    }

    this.outpostUpgradeText = 'Upgrade Outpost';
    this.outpostUpgradeVisible = true;
    this.outpostUpgradeEnabled = true;
  }

  onUpgradeOutpost(): void {
    this.planetService.upgradeOutpost();
    this.updateOutpost();
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

  onFlagsUpdated(): void {
    if (this.flagsService.showOutpostPanel) {this.showOutpostPanel = true; }
    if (this.flagsService.showDroneBuild) {this.showBuildDrone = true; }
    if (this.flagsService.showDroneHarvest) { this.revealDroneTask('Logging'); }
    if (this.flagsService.showDroneMine) { this.revealDroneTask('Mining'); }
    if (this.flagsService.showDroneSift) { this.revealDroneTask('Sifting'); }
  }

  revealDroneTask(task: string): void {
    this.droneTasks.find(x => x.name === task).visible = true;
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
    this.visible = false;
  }
  public assigned: number;
  public visible: boolean;
}
