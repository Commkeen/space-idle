import { Component, OnInit } from '@angular/core';
import { FlagsService } from '../../services/flags.service';

@Component({
  selector: 'app-planet-interaction',
  templateUrl: './planet-interaction.component.html',
  styleUrls: ['./planet-interaction.component.scss']
})
export class PlanetInteractionComponent implements OnInit {

  public showStructures = false;
  public showResearch = false;

  constructor(private flagsService: FlagsService) { }

  ngOnInit() {
    this.flagsService.onFlagsUpdated.subscribe(() => this.updateTabVisibility());
    this.updateTabVisibility();
  }

  updateTabVisibility() {
    this.showStructures = this.flagsService.check('showStructureTab');
    this.showResearch = this.flagsService.check('showResearchTab');
  }
}
