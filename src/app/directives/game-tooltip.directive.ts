import { Directive, Input, HostListener, OnInit, ElementRef } from '@angular/core';
import { OverlayRef, Overlay, OverlayPositionBuilder } from '@angular/cdk/overlay';
import { ComponentPortal, DomPortalHost } from '@angular/cdk/portal';
import { GameTooltipComponent } from '../components/game-tooltip/game-tooltip.component';
import { TooltipViewModel } from '../models/tooltipViewModel';

@Directive({
  selector: '[appGameTooltip]'
})
export class GameTooltipDirective implements OnInit {

  @Input('appGameTooltip') model: TooltipViewModel;

  private static currentTooltip: GameTooltipDirective = null;

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
    tooltipRef.instance.tooltipModel = this.model;

    if (GameTooltipDirective.currentTooltip != null) {
      GameTooltipDirective.currentTooltip.hide();
    }
    GameTooltipDirective.currentTooltip = this;
  }

  @HostListener('mouseout')
  hide() {
    this.overlayRef.detach();
    GameTooltipDirective.currentTooltip = null;
  }


}
