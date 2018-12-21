import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SiUpgradesComponent } from './si-upgrades.component';

describe('SiUpgradesComponent', () => {
  let component: SiUpgradesComponent;
  let fixture: ComponentFixture<SiUpgradesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SiUpgradesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SiUpgradesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
