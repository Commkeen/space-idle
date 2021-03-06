import { Component, OnInit } from '@angular/core';
import { PlanetService } from '../../../services/planet.service';
import { Planet } from '../../../models/planet';
import { PlanetInteractionModel } from '../../../models/planetInteractionModel';
import { STRUCTURE_LIBRARY } from '../../../staticData/structureDefinitions';
import { isNullOrUndefined } from 'util';
import { Resource, ResourceCollection } from '../../../models/resource';
import { ResearchService } from 'src/app/services/research.service';
import { ResourceService } from 'src/app/services/resource.service';
import { TooltipViewModel } from 'src/app/models/tooltipViewModel';

@Component({
  selector: 'app-pi-structures',
  templateUrl: './pi-structures.component.html',
  styleUrls: ['./pi-structures.component.scss']
})
export class PiStructuresComponent implements OnInit {

  showBuildList = true;
  outpostBuildItem: BuildingListItem = new BuildingListItem();
  buildingList: BuildingListItem[] = [];

  constructor(private planetService: PlanetService, private researchService: ResearchService, private resourceService: ResourceService) {
    this.planetService.selectedPlanetChanged.subscribe(x => this.updateBuildingList());
  }

  ngOnInit() {
    this.updateBuildingList();
  }

  canBuild(building: BuildingListItem): boolean {
    return this.resourceService.canAfford(building.costs);
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
      const cost = this.planetService.getNextStructureCost(element.name);
      const canActivate = this.planetService.canActivateStructure(element.name);

      if (!isNullOrUndefined(listItem)) {
        listItem.canActivate = canActivate;
        listItem.builtNumber = element.amount;
        listItem.activeNumber = element.active;
        listItem.visible = visible;
        listItem.costs = cost;
        this.updateTooltip(listItem);
      } else if (visible) {
        dirtyList = true;
      }
      if (true) {
        listItem = {
          name: element.name,
          sortCategory: structureDef.sortCategory,
          costs: cost,
          production: structureDef.getProductionRates(),
          consumption: structureDef.getConsumptionRates(),
          builtNumber: element.amount,
          activeNumber: element.active,
          showActivateControls: structureDef.hasConsumption(),
          canActivate: canActivate,
          visible: visible,
          tooltip: null
        };
        this.updateTooltip(listItem);
        if (listItem.visible) {
          newBuildingList.push(listItem);
        }
      }
    });

    if (dirtyList) {
      this.buildingList = newBuildingList;
    }

  }

  getButtonName(building: BuildingListItem): string {
    let buttonName = building.name;
    if (building.activeNumber > 0) {
      buttonName = building.name + ' (' + building.activeNumber + ')';
    }
    if (building.builtNumber > building.activeNumber) {
      buttonName = building.name + ' (' + building.activeNumber + '/' + building.builtNumber + ')';
    }
    return buttonName;
  }

  updateTooltip(building: BuildingListItem) {
    if (building.tooltip == null) {building.tooltip = new TooltipViewModel();}
    building.tooltip.name = building.name;
    building.tooltip.desc = '';
    building.tooltip.costs = building.costs;
    building.tooltip.consumption = building.consumption;
    building.tooltip.production = building.production;
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
  public production: ResourceCollection;
  public consumption: ResourceCollection;
  public builtNumber: number;
  public activeNumber: number;
  public showActivateControls: boolean;
  public canActivate: boolean;
  public visible: boolean;
  public tooltip: TooltipViewModel;
}
