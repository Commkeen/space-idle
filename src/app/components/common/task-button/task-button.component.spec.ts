import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskButtonComponent } from './task-button.component';

describe('TaskButtonComponent', () => {
  let component: TaskButtonComponent;
  let fixture: ComponentFixture<TaskButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
