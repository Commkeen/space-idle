import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SiSystemsComponent } from './si-systems.component';

describe('SiSystemsComponent', () => {
  let component: SiSystemsComponent;
  let fixture: ComponentFixture<SiSystemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SiSystemsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SiSystemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
