import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipInteractionComponent } from './ship-interaction.component';

describe('ShipInteractionComponent', () => {
  let component: ShipInteractionComponent;
  let fixture: ComponentFixture<ShipInteractionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShipInteractionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShipInteractionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
