import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { OverlayModule } from '@angular/cdk/overlay';

import { AppComponent } from './app.component';
import { MaterialModule } from './shared/material.module';
import { SystemOverviewComponent } from './components/system-overview/system-overview.component';
import { PlanetInteractionComponent } from './components/planet-interaction/planet-interaction.component';
import { ResourceOverviewComponent } from './components/resource-overview/resource-overview.component';
import { ShipOverviewComponent } from './components/ship-overview/ship-overview.component';
import { ShipInteractionComponent } from './components/ship-interaction/ship-interaction.component';
import { PiStructuresComponent } from './components/planet-interaction/pi-structures/pi-structures.component';
import { PiTerrainComponent } from './components/planet-interaction/pi-terrain/pi-terrain.component';
import { SiResearchComponent } from './components/ship-interaction/si-research/si-research.component';
import { SiUpgradesComponent } from './components/ship-interaction/si-upgrades/si-upgrades.component';
import { SiSystemsComponent } from './components/ship-interaction/si-systems/si-systems.component';
import { PiCommandComponent } from './components/planet-interaction/pi-command/pi-command.component';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCog, faCompass, faCheck } from '@fortawesome/free-solid-svg-icons';
import { DisplayNumberPipe } from './pipes/display-number.pipe';
import { ActionsComponent } from './components/actions/actions.component';
import { GameTooltipDirective } from './directives/game-tooltip.directive';
import { GameTooltipComponent } from './components/game-tooltip/game-tooltip.component';
import { ProgressBarComponent } from './components/common/progress-bar/progress-bar.component';
import { ResourceBarComponent } from './components/common/resource-bar/resource-bar.component';
import { GameButtonComponent } from './components/common/game-button/game-button.component';
import { AbilityButtonComponent } from './components/common/ability-button/ability-button.component';
import { TaskButtonComponent } from './components/common/task-button/task-button.component';

library.add(faCog);
library.add(faCompass);
library.add(faCheck);

@NgModule({
  declarations: [
    AppComponent,
    SystemOverviewComponent,
    PlanetInteractionComponent,
    ResourceOverviewComponent,
    ShipOverviewComponent,
    ShipInteractionComponent,
    PiStructuresComponent,
    PiTerrainComponent,
    SiResearchComponent,
    SiUpgradesComponent,
    SiSystemsComponent,
    PiCommandComponent,
    DisplayNumberPipe,
    ActionsComponent,
    GameTooltipDirective,
    GameTooltipComponent,
    ProgressBarComponent,
    ResourceBarComponent,
    GameButtonComponent,
    AbilityButtonComponent,
    TaskButtonComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    FlexLayoutModule,
    FormsModule,
    FontAwesomeModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [GameTooltipComponent]
})
export class AppModule { }
