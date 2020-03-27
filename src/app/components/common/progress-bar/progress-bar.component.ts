import { Component, OnInit, Input, ContentChild } from '@angular/core';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss']
})
export class ProgressBarComponent implements OnInit {

  @Input() value: number = 15;
  @Input() max: number = 100;

  constructor() { }

  ngOnInit() {
  }

  getWidth(): number {
    let result = this.value / this.max;
    result = result * 100;
    result = Math.min(result, 100);
    result = Math.max(0, result);
    return result;
  }

}
