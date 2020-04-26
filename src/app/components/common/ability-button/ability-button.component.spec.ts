import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AbilityButtonComponent } from './ability-button.component';

describe('AbilityButtonComponent', () => {
  let component: AbilityButtonComponent;
  let fixture: ComponentFixture<AbilityButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AbilityButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AbilityButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
