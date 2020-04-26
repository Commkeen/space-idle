import { Component, OnInit, Input } from '@angular/core';
import { Task } from 'src/app/models/task';
import { TaskDefinition } from 'src/app/staticData/taskDefinitions';

@Component({
  selector: 'task-button',
  templateUrl: './task-button.component.html',
  styleUrls: ['./task-button.component.scss']
})
export class TaskButtonComponent implements OnInit {

  @Input() task: Task;
  @Input() taskDef: TaskDefinition;

  constructor() { }

  ngOnInit(): void {
  }

}
