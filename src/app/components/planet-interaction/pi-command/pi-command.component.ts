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
  outpostUpgradeCosts: ResourceCollection;

  shipParts: ShipPart[] = [];
  showLaunchBtn: boolean;
  shipLaunched: boolean;

  constructor(private planetService: PlanetService, private resourceService: ResourceService, private flagsService: FlagsService) {


    this.initShip();
  }

  initShip() {
    this.shipParts.push(new ShipPart('Superstructure', 'silksteel', 75));
    this.shipParts.push(new ShipPart('Stardrive Module', 'hyperlattice', 50));
    this.shipParts.push(new ShipPart('Navigation Computer', 'cogitex', 50));
    this.shipParts.push(new ShipPart('Gravity Plating', 'gravalloy', 50));
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

  canAffordDrone(): boolean {
    return this.resourceService.canAfford(this.droneCost);
  }

  canAffordOutpostUpgrade(): boolean {
    return this.resourceService.canAfford(this.outpostUpgradeCosts);
  }


  onFlagsUpdated(): void {
    if (this.flagsService.showOutpostPanel) {this.showOutpostPanel = true; }
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
