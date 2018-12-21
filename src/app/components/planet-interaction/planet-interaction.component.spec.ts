import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanetInteractionComponent } from './planet-interaction.component';

describe('PlanetInteractionComponent', () => {
  let component: PlanetInteractionComponent;
  let fixture: ComponentFixture<PlanetInteractionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanetInteractionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanetInteractionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
