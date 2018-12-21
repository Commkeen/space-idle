import { Component, OnInit } from '@angular/core';
import { PlanetService } from './services/planet.service';
import { TimeService } from './services/time.service';
import { SimulationService } from './services/simulation.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  
  currentTime:number = 0;
  showResearchScreen:boolean = false;
  title = 'space-idle';


  constructor(private planetService:PlanetService,
              private timeService:TimeService,
              private simulationService:SimulationService){}

  ngOnInit(): void {
    this.timeService.startGame();
    this.planetService.initializeSystem();
    this.timeService.tick.subscribe(x => this.currentTime = x);
    this.simulationService.init();
    this.simulationService.reset();
  }

  onResearchButtonClicked(){
    this.showResearchScreen = !this.showResearchScreen;
  }

  onResetButtonClicked(){
    this.timeService.startGame();
  }
}
