import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  MatButtonModule,
  MatButtonToggleModule,
  MatCheckboxModule,
  MatCardModule,
  MatListModule,
  MatGridListModule,
  MatRadioModule,
  MatTabsModule,
  MatTooltipModule
} from '@angular/material';

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
