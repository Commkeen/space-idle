import { Component, OnInit } from '@angular/core';
import { PlanetService } from './services/planet.service';
import { TimeService } from './services/time.service';
import { SimulationService } from './services/simulation.service';
import { FlagsService } from './services/flags.service';
import { ResourceService } from './services/resource.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  currentTime:number = 0;
  showShipPanel:boolean = false;
  title = 'space-idle';


  constructor(private planetService:PlanetService,
              private timeService:TimeService,
              private simulationService:SimulationService,
              private flagsService:FlagsService,
              private resourceService:ResourceService){}

  ngOnInit(): void {
    this.timeService.startGame();
    this.flagsService.init();
    this.planetService.initializeSystem();
    this.timeService.tick.subscribe(x => this.currentTime = x);
    this.resourceService.init();
    this.simulationService.init();
    this.simulationService.reset();
  }

  onShipSelected(value: boolean){
    this.showShipPanel = value;
  }

  onResetButtonClicked(){
    this.timeService.startGame();
  }
}
