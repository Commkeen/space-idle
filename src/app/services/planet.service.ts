import { Injectable, OnInit } from '@angular/core';
import {Planet, Feature, Region} from '../models/planet';
import {PlanetInteractionModel, Structure} from '../models/planetInteractionModel';
import {MOCK_SYSTEM} from '../models/planet';
import { STRUCTURE_LIBRARY, StructureDefinition } from '../staticData/structureDefinitions';
import { ResourceCollection, Resource } from '../models/resource';
import { Subject } from 'rxjs';
import { FeatureDefinition, FEATURE_LIBRARY } from '../staticData/featureDefinitions';
import { EXPLOIT_LIBRARY, ExploitDefinition } from '../staticData/exploitDefinitions';
import { REGION_LIBRARY, RegionDefinition } from '../staticData/regionDefinitions';
import { OutpostDefinition, OUTPOST_LIBRARY } from '../staticData/outpostDefinitions';
import { ResourceService } from './resource.service';
import { ResearchService } from './research.service';

@Injectable({
  providedIn: 'root'
})
export class PlanetService {

  selectedPlanetChanged: Subject<number> = new Subject();
  regionChanged: Subject<Region> = new Subject();
  onFeatureSurveyed: Subject<Feature> = new Subject();
  onOutpostUpgraded: Subject<PlanetInteractionModel> = new Subject();

  private _currentSystem: Planet[] = null;
  private _currentSystemInteractionModels: PlanetInteractionModel[] = null;
  private _selectedPlanet: Planet = null;
  private _selectedPlanetInteractionModel: PlanetInteractionModel = null;

  constructor(private _resourceService: ResourceService, private _researchService: ResearchService) { }

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
        const structure = {name: structureDef.name, amount: 0, active: 0, canBuild: false};
        interactionModel.structures.push(structure);
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

  getRegion(regionId: number, planetInstanceId?: number): Region {
    if (!planetInstanceId) {
      planetInstanceId = this.getSelectedPlanet().instanceId;
    }
    return this.getPlanet(planetInstanceId).regions.find(x => x.instanceId === regionId);
  }

  getFeature(regionId: number, featureId: number, planetInstanceId?: number): Feature {
    if (!planetInstanceId) {
      planetInstanceId = this.getSelectedPlanet().instanceId;
    }
    const region = this.getPlanet(planetInstanceId).regions.find(x => x.instanceId === regionId);
    return region.features.find(x => x.instanceId === featureId);
  }

  getRegionDefinition(name: string): RegionDefinition {
    return REGION_LIBRARY.find(def => def.name === name);
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

  getOutpostTypeForPlanet(planetInstanceId?: number): OutpostDefinition {
    return OUTPOST_LIBRARY.find(def => def.planetType === 'temperate');
  }

  isRegionVisible(regionId: number, planetInstanceId?: number): boolean {
    if (!planetInstanceId) {
      planetInstanceId = this.getSelectedPlanet().instanceId;
    }
    const region = this.getRegion(regionId, planetInstanceId);
    if (region.hiddenBehindRegion != 0)
    {
      const otherRegionSurvey = this.getPlanetInteractionModel(planetInstanceId).regions.getSurveyLevel(region.hiddenBehindRegion);
      return otherRegionSurvey >= region.hiddenBehindSurvey;
    }
    return true;
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
    const structureDef = this.getStructureDefinition(structureName);
    if (!this._resourceService.spend(structureDef.baseBuildCost)) { return; }
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

  surveyRegion(amount: number, regionId: number, planetInstanceId?: number) {
    if (!planetInstanceId) {
      planetInstanceId = this.getSelectedPlanet().instanceId;
    }
    const regionInteraction = this.getPlanetInteractionModel(planetInstanceId).regions.getRegion(regionId);
    const surveyProgressNeeded = this.getSurveyProgressNeeded(regionId, planetInstanceId);
    const surveyResearch = this._researchService.getProgress('Planetary Survey');
    regionInteraction.surveyProgress += amount + (amount*surveyResearch.knowledgeLevel*0.2); //TODO: calc survey speed
    if (regionInteraction.surveyProgress >= surveyProgressNeeded) {
      regionInteraction.surveyProgress -= surveyProgressNeeded;
      regionInteraction.surveyLevel++;
      this._researchService.addTheory('Planetary Survey', 10);
      this.regionChanged.next(this.getRegion(regionId, planetInstanceId));
    }
  }

  getSurveyProgress(regionId: number, planetInstanceId?: number) {
    if (!planetInstanceId) {
      planetInstanceId = this.getSelectedPlanet().instanceId;
    }

    return this.getPlanetInteractionModel(planetInstanceId).regions.getRegion(regionId).surveyProgress;
  }

  getSurveyProgressNeeded(regionId: number, planetInstanceId?: number) {
    if (!planetInstanceId) {
      planetInstanceId = this.getSelectedPlanet().instanceId;
    }

    const region = this.getRegion(regionId, planetInstanceId);
    return this.getRegionDefinition(region.name).surveyBaseCost;
  }

  replaceFeature(regionId: number, featureId: number, newFeatureName: string, planetInstanceId?: number): void {
    if (!planetInstanceId) {
      planetInstanceId = this.getSelectedPlanet().instanceId;
    }
    const planet = this.getPlanet(planetInstanceId);
    const region = planet.regions.find(x => x.instanceId === regionId);
    region.replaceFeature(featureId, newFeatureName);
    this.regionChanged.next(region);
  }

  gatherRegion(regionId: number, planetInstanceId?: number) {
    if (!planetInstanceId) {
      planetInstanceId = this.getSelectedPlanet().instanceId;
    }

    const planet = this.getPlanet(planetInstanceId);
    const region = planet.regions.find(x => x.instanceId === regionId);
    const regionSurvey = this.getPlanetInteractionModel(planetInstanceId).regions.getSurveyLevel(regionId);
    region.features.forEach(feature => {
      const featureDefinition = this.getFeatureDefinition(feature.name);
      if (feature.hiddenBehindSurvey <= regionSurvey) {
        this._resourceService.globalResources.addCollection(featureDefinition.gatherRates);
      }
    });

  }

  gatherFeature(regionId: number, featureId: number, planetInstanceId?: number) {
    if (!planetInstanceId) {
      planetInstanceId = this.getSelectedPlanet().instanceId;
    }

    const planet = this.getPlanet(planetInstanceId);
    const region = planet.regions.find(x => x.instanceId === regionId);
    const feature = region.features.find(x => x.instanceId === featureId);
    const featureDefinition = this.getFeatureDefinition(feature.name);

    this._resourceService.globalResources.addCollection(featureDefinition.gatherRates);
  }

  buildDroneHub(regionId: number, planetInstanceId?: number) {
    if (!planetInstanceId) {
      planetInstanceId = this.getSelectedPlanet().instanceId;
    }
    const regionInteraction = this.getPlanetInteractionModel(planetInstanceId).regions.getRegion(regionId);
    const cost = this.getDroneHubCost(regionId, planetInstanceId);
    if (!this._resourceService.canAfford(cost)) {return;}
    if (!this._resourceService.spend(cost)) {return;}

    regionInteraction.outpostLevel++;
    regionInteraction.droneSlots++;
  }

  getDroneHubCost(regionId: number, planetInstanceId?: number): ResourceCollection {
    if (!planetInstanceId) {
      planetInstanceId = this.getSelectedPlanet().instanceId;
    }

    const region = this.getRegion(regionId, planetInstanceId);
    const regionDef = this.getRegionDefinition(region.name);
    const regionInteraction = this.getPlanetInteractionModel(planetInstanceId).regions.getRegion(regionId);
    let cost = regionInteraction.nextOutpostLevelCost;
    if (cost == null) {
      cost = regionDef.infrastructure[1].cost;
      regionInteraction.nextOutpostLevelCost = cost;
    }

    return cost;
  }

  getFeatureDroneSlots(feature: Feature) {
    const featureDef = this.getFeatureDefinition(feature.name);
    return featureDef.droneSlots;
  }

  assignDrone(feature: Feature) {
    const regionId = feature.regionId;
    const featureId = feature.instanceId;
    const regions = this.getPlanetInteractionModel(feature.planetId).regions;
    if (regions.getRegionAssignedDrones(regionId) >= regions.getRegionDroneSlots(regionId)) {return;}
    if (regions.getFeatureAssignedDrones(regionId, featureId) >= this.getFeatureDroneSlots(feature)) {return;}
    regions.assignDrone(regionId, featureId);
    this.regionChanged.next(this.getRegion(regionId));
  }

  unassignDrone(feature: Feature) {
    const regionId = feature.regionId;
    const featureId = feature.instanceId;
    const regions = this.getPlanetInteractionModel(feature.planetId).regions;
    if (regions.getRegionAssignedDrones(regionId) <= 0) {return;}
    if (regions.getFeatureAssignedDrones(regionId, featureId) <= 0) {return;}
    regions.unassignDrone(regionId, featureId);
    this.regionChanged.next(this.getRegion(regionId));
  }

  updateInteractionModel(interactionModel: PlanetInteractionModel): void {
    interactionModel.structures.forEach(element => {
      element.canBuild = true;
    });
  }
}
