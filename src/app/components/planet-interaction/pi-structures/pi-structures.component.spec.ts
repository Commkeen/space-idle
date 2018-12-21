import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PiStructuresComponent } from './pi-structures.component';

describe('PiStructuresComponent', () => {
  let component: PiStructuresComponent;
  let fixture: ComponentFixture<PiStructuresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PiStructuresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PiStructuresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
