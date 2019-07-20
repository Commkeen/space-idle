import { Component, OnInit } from '@angular/core';
import { PlanetService } from 'src/app/services/planet.service';
import { Planet } from 'src/app/models/planet';
import { PlanetInteractionModel } from 'src/app/models/planetInteractionModel';
import { FlagsService } from 'src/app/services/flags.service';
import { isNullOrUndefined } from 'util';
import { Resource, ResourceCollection } from 'src/app/models/resource';
import { ResourceService } from 'src/app/services/resource.service';

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
  droneCost: ResourceCollection;

  showBuildDrone: boolean;
  showOutpostPanel: boolean;

  outpostLevel: number;
  outpostName: string;
  outpostUpgradeVisible: boolean;
  outpostUpgradeEnabled: boolean;
  outpostUpgradeText: string;
  outpostUpgradeCosts: Resource[];

  shipParts: ShipPart[] = [];
  showLaunchBtn: boolean;
  shipLaunched: boolean;

  constructor(private planetService: PlanetService, private resourceService: ResourceService, private flagsService: FlagsService) {
    this.droneTasks.push(new DroneTaskItem('Survey'));
    this.droneTasks.push(new DroneTaskItem('Mining'));
    this.droneTasks.push(new DroneTaskItem('Logging'));
    this.droneTasks.push(new DroneTaskItem('Sifting'));
    this.revealDroneTask('Survey');

    this.planetService.selectedPlanetChanged.subscribe(x => this.updateDrones());
    this.planetService.selectedPlanetChanged.subscribe(x => this.updateOutpost());

    this.initShip();
  }

  initShip() {
    this.shipParts.push(new ShipPart('Superstructure', 'metal', 15));
    this.shipParts.push(new ShipPart('Stardrive Module', 'hyperlattice', 5));
    this.shipParts.push(new ShipPart('Navigation Computer', 'cogitex', 5));
    this.shipParts.push(new ShipPart('Gravity Plating', 'gravalloy', 5));
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

  canAffordShipPart(part: ShipPart): boolean {
    return this.resourceService.canAfford(part.cost);
  }

  updateOutpost(): void {
    const outpostDef = this.planetService.getOutpostTypeForPlanet();
    this.outpostLevel = this.getSelectedPlanetInteractionModel().outpostLevel;
    if (this.outpostLevel === 0) {
      this.outpostName = '';
      this.outpostUpgradeText = 'Build Outpost';
      this.outpostUpgradeVisible = true;
      this.outpostUpgradeEnabled = true;
      this.outpostUpgradeCosts = outpostDef.levels.find(x => x.level === 1).cost;
      return;
    }

    const outpostLevelDef = outpostDef.getLevel(this.outpostLevel);
    const outpostNextLevelDef = outpostDef.getLevel(this.outpostLevel + 1);
    this.outpostName = outpostLevelDef.name;
    if (isNullOrUndefined(outpostNextLevelDef)) {
      this.outpostUpgradeVisible = false;
      this.outpostUpgradeEnabled = false;
      this.outpostUpgradeCosts = [];
      return;
    }

    this.outpostUpgradeText = 'Upgrade Outpost';
    this.outpostUpgradeVisible = true;
    this.outpostUpgradeEnabled = true;
    this.outpostUpgradeCosts = outpostNextLevelDef.cost;
  }

  onUpgradeOutpost(): void {
    this.planetService.upgradeOutpost();
    this.updateOutpost();
    this.updateDrones();
  }

  updateDrones(): void {
    const drones = this.getSelectedPlanetInteractionModel().drones;
    this.droneCost = this.planetService.getNextDroneCost();
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

  onBuildShipComponent(part: ShipPart): void {
    part.built = this.resourceService.spend(part.cost);
    if (this.shipParts.every(x => x.built)) {
      this.showLaunchBtn = true;
    }
  }

  onLaunchShip(): void {
    this.shipLaunched = true;
    this.showLaunchBtn = false;
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

class ShipPart {
  constructor(public name: string, resource: string, amount: number) {
    this.cost = new ResourceCollection();
    this.cost.add(resource, amount);
    this.built = false;
  }
  public cost: ResourceCollection;
  public built: boolean;
}
