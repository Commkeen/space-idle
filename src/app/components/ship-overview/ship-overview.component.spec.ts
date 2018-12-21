import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipOverviewComponent } from './ship-overview.component';

describe('ShipOverviewComponent', () => {
  let component: ShipOverviewComponent;
  let fixture: ComponentFixture<ShipOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShipOverviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShipOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
