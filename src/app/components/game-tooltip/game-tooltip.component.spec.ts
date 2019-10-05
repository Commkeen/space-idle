import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameTooltipComponent } from './game-tooltip.component';

describe('GameTooltipComponent', () => {
  let component: GameTooltipComponent;
  let fixture: ComponentFixture<GameTooltipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameTooltipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameTooltipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
