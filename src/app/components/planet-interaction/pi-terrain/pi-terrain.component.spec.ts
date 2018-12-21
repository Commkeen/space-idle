import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PiTerrainComponent } from './pi-terrain.component';

describe('PiTerrainComponent', () => {
  let component: PiTerrainComponent;
  let fixture: ComponentFixture<PiTerrainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PiTerrainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PiTerrainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
