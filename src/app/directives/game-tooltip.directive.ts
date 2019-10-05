import { Directive, Input, HostListener, OnInit, ElementRef } from '@angular/core';
import { OverlayRef, Overlay, OverlayPositionBuilder } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { GameTooltipComponent } from '../components/game-tooltip/game-tooltip.component';

@Directive({
  selector: '[appGameTooltip]'
})
export class GameTooltipDirective implements OnInit {

  @Input('appGameTooltip') text = '';



  private overlayRef: OverlayRef;

  constructor(private overlayPositionBuilder: OverlayPositionBuilder,
              private elementRef: ElementRef,
              private overlay: Overlay) {}

  ngOnInit() {
    const positionStrategy = this.overlayPositionBuilder
      .flexibleConnectedTo(this.elementRef)
      .withPositions([{
        originX: 'end',
        originY: 'center',
        overlayX: 'start',
        overlayY: 'center'
      }]);

    this.overlayRef = this.overlay.create({ positionStrategy });
  }

  @HostListener('mouseenter')
  show() {
    const tooltipPortal = new ComponentPortal(GameTooltipComponent);

    const tooltipRef = this.overlayRef.attach(tooltipPortal);
  }

  @HostListener('mouseout')
  hide() {
    this.overlayRef.detach();
  }


}
