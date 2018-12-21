import { Component, OnInit } from '@angular/core';
import { Planet } from '../../models/planet';
import { PlanetInteractionModel } from '../../models/planetInteractionModel';
import { PlanetService } from '../../services/planet.service';
import { Resource } from '../../models/resource';
import { STRUCTURE_LIBRARY } from '../../staticData/structureDefinitions';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-planet-interaction',
  templateUrl: './planet-interaction.component.html',
  styleUrls: ['./planet-interaction.component.scss']
})
export class PlanetInteractionComponent implements OnInit {

  showBuildList = false;
  outpostBuildItem: BuildingListItem = new BuildingListItem();

  constructor(private planetService: PlanetService) {
    this.planetService.selectedPlanetChanged.subscribe(x => this.updateOutpostBuildItem());
  }

  ngOnInit() { }

  getSelectedPlanet(): Planet {
    return this.planetService.getSelectedPlanet();
  }

  getSelectedPlanetInteractionModel(): PlanetInteractionModel {
    return this.planetService.getSelectedPlanetInteractionModel();
  }

  updateOutpostBuildItem(): void {
    const outpostDef = this.planetService.getOutpostForPlanet(this.getSelectedPlanet().instanceId);
    const outpostInstance = this.getSelectedPlanetInteractionModel().structures.find(x => x.name === outpostDef.name);
    this.outpostBuildItem.name = outpostDef.name;
    this.outpostBuildItem.canBuild = outpostInstance.canBuild;
    this.outpostBuildItem.currentNumber = outpostInstance.amount;
    this.outpostBuildItem.costs = this.outpostBuildItem.costs;
  }
}

class BuildingListItem {
  public name: string;
  public sortCategory: string;
  public slotType: string;
  public costs: Resource[];
  public currentNumber: number;
  public canBuild: boolean;
}
