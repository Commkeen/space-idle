import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SiResearchComponent } from './si-research.component';

describe('SiResearchComponent', () => {
  let component: SiResearchComponent;
  let fixture: ComponentFixture<SiResearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SiResearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SiResearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
