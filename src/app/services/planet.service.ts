import { Injectable, OnInit } from '@angular/core';
import {Planet, Feature} from '../models/planet';
import {PlanetInteractionModel, Structure} from '../models/planetInteractionModel';
import {MOCK_SYSTEM} from '../models/planet';
import { STRUCTURE_LIBRARY, StructureDefinition } from '../staticData/structureDefinitions';
import { ResourceCollection } from '../models/resource';
import { Subject } from 'rxjs';
// tslint:disable-next-line:max-line-length
import { FeatureDefinition, FEATURE_LIBRARY, UNSURVEYED_FEATURE_LIBRARY, UnsurveyedFeatureDefinition } from '../staticData/featureDefinitions';
import { EXPLOIT_LIBRARY, ExploitDefinition } from '../staticData/exploitDefinitions';
import { OutpostDefinition, OUTPOST_LIBRARY } from '../staticData/outpostDefinitions';
import { ResourceService } from './resource.service';

@Injectable({
  providedIn: 'root'
})
export class PlanetService {

  selectedPlanetChanged: Subject<number> = new Subject();
  onFeatureSurveyed: Subject<Feature> = new Subject();
  onOutpostUpgraded: Subject<PlanetInteractionModel> = new Subject();

  private _currentSystem: Planet[] = null;
  private _currentSystemInteractionModels: PlanetInteractionModel[] = null;
  private _selectedPlanet: Planet = null;
  private _selectedPlanetInteractionModel: PlanetInteractionModel = null;

  constructor(private _resourceService: ResourceService) { }

  initializeSystem(): void {
    this._currentSystem = MOCK_SYSTEM;
    this._currentSystemInteractionModels = [];

    // Init interaction models in the system
    this._currentSystem.forEach(element => {
      const interactionModel = new PlanetInteractionModel();
      interactionModel.planetInstanceId = element.instanceId;
      interactionModel.outpostLevel = 0;
      interactionModel.structures = [];
      interactionModel.localResources = new ResourceCollection();
      interactionModel.drones.droneCapacity = 3;
      interactionModel.drones.createDrone();
      STRUCTURE_LIBRARY.forEach(structureDef => {
        const structure = {name: structureDef.name, amount: 0, active: 0, canBuild: false};
        interactionModel.structures.push(structure);
      });
      element.features.forEach(feature => {
        if (!feature.hiddenBehindSurvey) {
          interactionModel.features.discover(feature.instanceId);
        }
      });
      this.updateInteractionModel(interactionModel);
      this._currentSystemInteractionModels.push(interactionModel);
    });

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

  getPlanetInteractionModel(planetInstanceId?: number): PlanetInteractionModel {
    if (!planetInstanceId) {
      planetInstanceId = this.getSelectedPlanet().instanceId;
    }
    const model = this._currentSystemInteractionModels.find(x => x.planetInstanceId === planetInstanceId);
    // this.updateInteractionModel(model);
    return model;
  }

  getFeature(featureInstanceId: number, planetInstanceId?: number): Feature {
    if (!planetInstanceId) {
      planetInstanceId = this.getSelectedPlanet().instanceId;
    }
    return this.getPlanet(planetInstanceId).features.find(x => x.instanceId === featureInstanceId);
  }

  getUnsurveyedFeatureDefinition(name: string): UnsurveyedFeatureDefinition {
    return UNSURVEYED_FEATURE_LIBRARY.find(def => def.name === name);
  }

  getSurveyedFeatureDefinition(name: string): FeatureDefinition {
    return FEATURE_LIBRARY.find(def => def.name === name);
  }

  getExploitDefinitionForFeature(feature: string): ExploitDefinition {
    const featureDef = this.getSurveyedFeatureDefinition(feature);
    return EXPLOIT_LIBRARY.find(def => def.name === featureDef.exploitName);
  }

  getStructureDefinition(name: string): StructureDefinition {
    return STRUCTURE_LIBRARY.find(def => def.name === name);
  }

  getOutpostTypeForPlanet(planetInstanceId?: number): OutpostDefinition {
    return OUTPOST_LIBRARY.find(def => def.planetType === 'temperate');
  }

  getNextDroneCost(planetInstanceId?: number): ResourceCollection {
    const resources = new ResourceCollection();
    if (!planetInstanceId) {
      planetInstanceId = this.getSelectedPlanet().instanceId;
    }
    const interactionModel = this.getPlanetInteractionModel(planetInstanceId);
    const currentDrones = interactionModel.drones.getTotal();
    if (currentDrones < 10) {
      resources.add('nanochips', 5 * currentDrones);
    } else {
      resources.add('optronics', 3 * currentDrones);
    }
    return resources;
  }

  canBuildStructure(structureName: string, planetInstanceId?: number): boolean {
    if (!planetInstanceId) {
      planetInstanceId = this.getSelectedPlanet().instanceId;
    }
    const interactionModel = this.getPlanetInteractionModel(planetInstanceId);
    const structure = interactionModel.structures.find(x => x.name === structureName);
    const def = this.getStructureDefinition(structureName);
    return this._resourceService.canAfford(def.baseBuildCost);
  }

  canActivateStructure(structureName: string, planetInstanceId?: number): boolean {
    if (!planetInstanceId) {
      planetInstanceId = this.getSelectedPlanet().instanceId;
    }
    const interactionModel = this.getPlanetInteractionModel(planetInstanceId);
    const structure = interactionModel.structures.find(x => x.name === structureName);
    if (structure.active >= structure.amount) { return false; }
    const def = this.getStructureDefinition(structureName);
    return def.getConsumptionRates().resources.every(element => {
      const newConsumption = element.amount;
      let netProduction = interactionModel.localResources.getNetProduction(element.resource);
      netProduction += this._resourceService.globalResources.getAmount(element.resource);
      return newConsumption <= netProduction;
    });
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
    if (this.canActivateStructure(structureName)) {
      structure.active += 1;
    }
    this.updateInteractionModel(interactionModel);
  }

  setStructureActiveAmount(planetId: number, structureName: string, amount: number): void {
    const interactionModel = this.getPlanetInteractionModel(planetId);
    const structure = interactionModel.structures.find(x => x.name === structureName);
    structure.active = Math.min(amount, structure.amount);
    this.updateInteractionModel(interactionModel);
  }

  upgradeOutpost(planetInstanceId?: number): void {
    if (!planetInstanceId) {
      planetInstanceId = this.getSelectedPlanet().instanceId;
    }
    const interactionModel = this.getPlanetInteractionModel(planetInstanceId);
    const outpostDef = this.getOutpostTypeForPlanet(planetInstanceId);
    interactionModel.outpostLevel += 1;
    const newLevel = outpostDef.getLevel(interactionModel.outpostLevel);
    const newDroneCap = newLevel.droneCapacity;
    if (newDroneCap > interactionModel.drones.droneCapacity) {
         interactionModel.drones.droneCapacity = newDroneCap;
       }
    this.onOutpostUpgraded.next(interactionModel);
  }

  discoverFeature(planetId: number, featureId: number): void {
    const interactionModel = this.getPlanetInteractionModel(planetId);
    interactionModel.features.discover(featureId);
  }

  surveyFeature(planetId: number, featureId: number): void {
    const planet = this.getPlanet(planetId);
    const interactionModel = this.getPlanetInteractionModel(planetId);
    interactionModel.features.survey(featureId);
    const surveyedFeature = planet.features.find(x => x.instanceId === featureId);
    this._resourceService.globalResources.addCollection(surveyedFeature.resourcesOnSurvey);
    this.onFeatureSurveyed.next(surveyedFeature);
    planet.features.forEach(feature => {
      if (feature.hiddenBehindSurvey === featureId) {
        interactionModel.features.discover(feature.instanceId);
      }
    });
  }

  exploitFeature(planetId: number, featureId: number): void {
    const interactionModel = this.getPlanetInteractionModel(planetId);
    interactionModel.features.exploit(featureId);
  }

  updateInteractionModel(interactionModel: PlanetInteractionModel): void {
    interactionModel.structures.forEach(element => {
      element.canBuild = true;
    });
  }
}
