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

  constructor(private planetService: PlanetService) { }

  ngOnInit() { }

  getSelectedPlanet(): Planet {
    return this.planetService.getSelectedPlanet();
  }

  getSelectedPlanetInteractionModel(): PlanetInteractionModel {
    return this.planetService.getSelectedPlanetInteractionModel();
  }
}
