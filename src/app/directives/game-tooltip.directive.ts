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

  private static overlayRef: OverlayRef = null;

  constructor(private overlayPositionBuilder: OverlayPositionBuilder,
              private elementRef: ElementRef,
              private overlay: Overlay) {}

  ngOnInit() {

  }

  @HostListener('mouseenter')
  show() {

    const positionStrategy = this.overlayPositionBuilder
      .flexibleConnectedTo(this.elementRef)
      .withPositions([{
        originX: 'end',
        originY: 'center',
        overlayX: 'start',
        overlayY: 'center'
      }]);

    if (GameTooltipDirective.currentTooltip != null) {
      GameTooltipDirective.currentTooltip.hide();
    }
    GameTooltipDirective.currentTooltip = this;
    if (GameTooltipDirective.overlayRef == null) {
      GameTooltipDirective.overlayRef = this.overlay.create();
    }

    GameTooltipDirective.overlayRef.updatePositionStrategy(positionStrategy);
    const tooltipPortal = new ComponentPortal(GameTooltipComponent);
    const tooltipRef = GameTooltipDirective.overlayRef.attach(tooltipPortal);
    tooltipRef.instance.tooltipModel = this.model;


  }

  @HostListener('mouseleave')
  hide() {
    GameTooltipDirective.overlayRef.detach();
    GameTooltipDirective.currentTooltip = null;
  }


}
