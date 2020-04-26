import { Component, OnInit, Input, Output, EventEmitter, HostBinding } from '@angular/core';
import { CanDisable } from '@angular/material/core';

@Component({
  selector: 'game-button',
  templateUrl: './game-button.component.html',
  styleUrls: ['./game-button.component.scss']
})
export class GameButtonComponent implements OnInit, CanDisable {

  @Input() name: string;
  @Input() disabled: boolean = false;
  @Input() cooldown: number = 0;
  @Output() click = new EventEmitter<void>();

  constructor() { }

  ngOnInit(): void {
  }

  onClick(event: MouseEvent) {
    event.stopPropagation();
    if (this.disabled) {return false;}
    this.click.emit();
  }

}
