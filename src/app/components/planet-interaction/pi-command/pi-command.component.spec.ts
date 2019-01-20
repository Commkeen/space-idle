import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PiCommandComponent } from './pi-command.component';

describe('PiCommandComponent', () => {
  let component: PiCommandComponent;
  let fixture: ComponentFixture<PiCommandComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PiCommandComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PiCommandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
