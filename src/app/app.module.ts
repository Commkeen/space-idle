import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { MaterialModule } from './shared/material.module';
import { SystemOverviewComponent } from './components/system-overview/system-overview.component';
import { PlanetInteractionComponent } from './components/planet-interaction/planet-interaction.component';
import { PlanetSurveyComponent } from './components/planet-survey/planet-survey.component';
import { ResourceOverviewComponent } from './components/resource-overview/resource-overview.component';
import { ShipOverviewComponent } from './components/ship-overview/ship-overview.component';
import { ShipInteractionComponent } from './components/ship-interaction/ship-interaction.component';
import { PiStructuresComponent } from './components/planet-interaction/pi-structures/pi-structures.component';
import { PiTerrainComponent } from './components/planet-interaction/pi-terrain/pi-terrain.component';
import { SiResearchComponent } from './components/ship-interaction/si-research/si-research.component';
import { SiUpgradesComponent } from './components/ship-interaction/si-upgrades/si-upgrades.component';
import { SiSystemsComponent } from './components/ship-interaction/si-systems/si-systems.component';

@NgModule({
  declarations: [
    AppComponent,
    SystemOverviewComponent,
    PlanetInteractionComponent,
    PlanetSurveyComponent,
    ResourceOverviewComponent,
    ShipOverviewComponent,
    ShipInteractionComponent,
    PiStructuresComponent,
    PiTerrainComponent,
    SiResearchComponent,
    SiUpgradesComponent,
    SiSystemsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    FlexLayoutModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
