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
  @Output() click = new EventEmitter<void>();

  smoothCooldown: boolean = false;
  private _cooldown: number;
  get cooldown() {return this._cooldown;}
  @Input()
  set cooldown(val: number) {
    if (val > this._cooldown || val == 0) {
      this.smoothCooldown = false;
    }
    else {
      this.smoothCooldown = true;
    }
    this._cooldown = val;
  }

  constructor() { }

  ngOnInit(): void {
  }

  onClick(event: MouseEvent) {
    event.stopPropagation();
    if (this.disabled) {return false;}
    if (this.cooldown > 0) {return false;}
    this.click.emit();
  }

}
