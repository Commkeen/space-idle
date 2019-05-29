import { Component, OnInit } from '@angular/core';
import { PlanetService } from '../../../services/planet.service';
import { Planet } from '../../../models/planet';
import { PlanetInteractionModel } from '../../../models/planetInteractionModel';
import { STRUCTURE_LIBRARY } from '../../../staticData/structureDefinitions';
import { isNullOrUndefined } from 'util';
import { Resource, ResourceCollection } from '../../../models/resource';
import { ResearchService } from 'src/app/services/research.service';

@Component({
  selector: 'app-pi-structures',
  templateUrl: './pi-structures.component.html',
  styleUrls: ['./pi-structures.component.scss']
})
export class PiStructuresComponent implements OnInit {

  showBuildList = true;
  outpostBuildItem: BuildingListItem = new BuildingListItem();
  buildingList: BuildingListItem[] = [];

  constructor(private planetService: PlanetService, private researchService: ResearchService) {
    this.planetService.selectedPlanetChanged.subscribe(x => this.updateBuildingList());
  }

  ngOnInit() {
    this.updateBuildingList();
  }

  getSelectedPlanet(): Planet {
    return this.planetService.getSelectedPlanet();
  }

  getSelectedPlanetInteractionModel(): PlanetInteractionModel {
    return this.planetService.getSelectedPlanetInteractionModel();
  }

  getFilteredBuildingList(filter: string): BuildingListItem[] {
    this.updateBuildingList();
    const results = this.buildingList.filter(value => filter === 'all' || value.sortCategory === filter);
    return results;
  }

  updateBuildingList(): void {
    const newBuildingList: BuildingListItem[] = [];
    const interactionModel = this.getSelectedPlanetInteractionModel();
    if (interactionModel == null) {
      this.buildingList = newBuildingList;
      return;
    }

    let dirtyList = false;
    interactionModel.structures.forEach(element => {
      const structureDef = STRUCTURE_LIBRARY.find(x => x.name === element.name);
      const visible = this.researchService.areUpgradesCompleted(structureDef.prereqs);
      let listItem = this.buildingList.find(x => x.name === element.name);

      if (!isNullOrUndefined(listItem)) {
        listItem.canBuild = element.canBuild;
        listItem.canActivate = element.active < element.amount;
        listItem.builtNumber = element.amount;
        listItem.activeNumber = element.active;
        listItem.visible = visible;
      } else if (visible) {
        dirtyList = true;
      }
      if (true) {
        listItem = {
          name: element.name,
          sortCategory: structureDef.sortCategory,
          costs: structureDef.baseBuildCost,
          builtNumber: element.amount,
          activeNumber: element.active,
          canBuild: element.canBuild,
          canActivate: element.active < element.amount,
          visible: visible
        };
        if (listItem.visible) {
          newBuildingList.push(listItem);
        }
      }
    });

    if (dirtyList) {
      this.buildingList = newBuildingList;
    }

  }

  onBuildItemClicked(buildItemName: string) {
    this.planetService.buildStructure(this.planetService.getSelectedPlanet().instanceId, buildItemName);
    this.updateBuildingList();
  }

  onActivateItemClicked(buildItemName: string) {
    const building = this.buildingList.find(x => x.name === buildItemName);
    this.planetService.setStructureActiveAmount(
      this.planetService.getSelectedPlanet().instanceId, buildItemName, building.activeNumber + 1);
    this.updateBuildingList();
  }

  onDeactivateItemClicked(buildItemName: string) {
    const building = this.buildingList.find(x => x.name === buildItemName);
    this.planetService.setStructureActiveAmount(
      this.planetService.getSelectedPlanet().instanceId, buildItemName, building.activeNumber - 1);
    this.updateBuildingList();
  }

  private hasOutpost(interactionModel: PlanetInteractionModel): boolean {
    // TODO: Could this work just by seeing if any structures are present?
    return interactionModel.structures.some(structure =>
      structure.amount > 0 &&
      this.planetService.getStructureDefinition(structure.name).sortCategory === 'outpost'
    );
  }

}

class BuildingListItem {
  public name: string;
  public sortCategory: string;
  public costs: ResourceCollection;
  public builtNumber: number;
  public activeNumber: number;
  public canActivate: boolean;
  public canBuild: boolean;
  public visible: boolean;
}
