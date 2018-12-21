import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanetSurveyComponent } from './planet-survey.component';

describe('PlanetSurveyComponent', () => {
  let component: PlanetSurveyComponent;
  let fixture: ComponentFixture<PlanetSurveyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanetSurveyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanetSurveyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
