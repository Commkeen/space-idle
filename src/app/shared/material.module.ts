import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatListModule } from '@angular/material/list';
import { MatRadioModule } from '@angular/material/radio';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  imports: [
    MatButtonModule,
    MatButtonToggleModule,
    MatCheckboxModule,
    MatCardModule,
    MatListModule,
    MatGridListModule,
    MatRadioModule,
    MatTabsModule,
    MatTooltipModule
  ],
  exports: [
    MatButtonModule,
    MatButtonToggleModule,
    MatCheckboxModule,
    MatCardModule,
    MatListModule,
    MatGridListModule,
    MatRadioModule,
    MatTabsModule,
    MatTooltipModule
  ]
})
export class MaterialModule { }
