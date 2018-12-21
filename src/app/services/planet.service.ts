import { Injectable, OnInit } from '@angular/core';
import {Planet, Feature} from '../models/planet';
import {PlanetInteractionModel, Structure} from '../models/planetInteractionModel';
import {MOCK_SYSTEM} from '../models/planet';
import { STRUCTURE_LIBRARY, StructureDefinition } from '../staticData/structureDefinitions';
import { ResourceCollection } from '../models/resource';
import { Subject } from 'rxjs';
import { FeatureDefinition, FEATURE_LIBRARY } from '../staticData/featureDefinitions';
import { EXPLOIT_LIBRARY, ExploitDefinition } from '../staticData/exploitDefinitions';

@Injectable({
  providedIn: 'root'
})
export class PlanetService implements OnInit {

  selectedPlanetChanged: Subject<number> = new Subject();

  private _currentSystem: Planet[] = null;
  private _currentSystemInteractionModels: PlanetInteractionModel[] = null;
  private _selectedPlanet: Planet = null;
  private _selectedPlanetInteractionModel: PlanetInteractionModel = null;

  constructor() { }

  ngOnInit() {
    this.initializeSystem();
  }

  initializeSystem(): void {
    this._currentSystem = MOCK_SYSTEM;
    this._currentSystemInteractionModels = [];

    // Init interaction models in the system
    this._currentSystem.forEach(element => {
      const interactionModel = new PlanetInteractionModel();
      interactionModel.planetInstanceId = element.instanceId;
      interactionModel.structures = [];
      interactionModel.localResources = new ResourceCollection();
      STRUCTURE_LIBRARY.forEach(structureDef => {
        const structure = {name: structureDef.name, amount: 0, canBuild: false};
        interactionModel.structures.push(structure);
      });
      this.updateInteractionModel(interactionModel);
      this._currentSystemInteractionModels.push(interactionModel);
    });

    // Init starting outpost
    this.buildStructure(1, 'Temperate Outpost');

    this.selectPlanet(1);
  }

  getCurrentSystem(): Planet[] {
    return this._currentSystem;
  }

  getSelectedPlanet(): Planet {
    return this._selectedPlanet;
  }

  getSelectedPlanetInteractionModel(): PlanetInteractionModel {
    return this._selectedPlanetInteractionModel;
  }

  getPlanet(planetInstanceId: number): Planet {
    return this._currentSystem.find(x => x.instanceId === planetInstanceId);
  }

  getPlanetInteractionModel(planetInstanceId: number): PlanetInteractionModel {
    const model = this._currentSystemInteractionModels.find(x => x.planetInstanceId === planetInstanceId);
    // this.updateInteractionModel(model);
    return model;
  }

  getFeature(featureInstanceId: number): Feature {
    return this._selectedPlanet.features.find(x => x.instanceId === featureInstanceId);
  }

  getFeatureDefinition(name: string): FeatureDefinition {
    return FEATURE_LIBRARY.find(def => def.name === name);
  }

  getExploitDefinitionForFeature(feature: string): ExploitDefinition {
    const featureDef = this.getFeatureDefinition(feature);
    return EXPLOIT_LIBRARY.find(def => def.name === featureDef.exploitName);
  }

  getStructureDefinition(name: string): StructureDefinition {
    return STRUCTURE_LIBRARY.find(def => def.name === name);
  }

  getOutpostForPlanet(planetInstanceId: number): StructureDefinition {
    return STRUCTURE_LIBRARY.find(def => def.slotType === 'outpost');
  }

  selectPlanet(instanceId: number): void {
    this._selectedPlanet = this.getPlanet(instanceId);
    this._selectedPlanetInteractionModel = this.getPlanetInteractionModel(instanceId);
    this.selectedPlanetChanged.next(instanceId);
  }

  buildStructure(planetId: number, structureName: string): void {
    const interactionModel = this.getPlanetInteractionModel(planetId);
    const structure = interactionModel.structures.find(x => x.name === structureName);
    structure.amount += 1;
    this.updateInteractionModel(interactionModel);
  }

  buyExploit(planetId: number, featureId: number): void {

  }

  updateInteractionModel(interactionModel: PlanetInteractionModel) {
    interactionModel.structures.forEach(element => {
      element.canBuild = element.amount < 5;
    });
  }
}
