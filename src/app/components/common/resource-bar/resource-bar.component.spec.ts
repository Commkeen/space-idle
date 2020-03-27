import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceBarComponent } from './resource-bar.component';

describe('ResourceBarComponent', () => {
  let component: ResourceBarComponent;
  let fixture: ComponentFixture<ResourceBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResourceBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
