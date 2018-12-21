import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-ship-overview',
  templateUrl: './ship-overview.component.html',
  styleUrls: ['./ship-overview.component.scss']
})
export class ShipOverviewComponent implements OnInit {

  @Output() researchButtonClicked = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  onResearchButtonClicked() {
    this.researchButtonClicked.emit();
  }

}
