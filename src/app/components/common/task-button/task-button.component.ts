import { Component, OnInit, Input } from '@angular/core';
import { Task } from 'src/app/models/task';
import { TaskDefinition } from 'src/app/staticData/taskDefinitions';
import { TaskService } from 'src/app/services/task.service';
import { TooltipViewModel } from 'src/app/models/tooltipViewModel';
import { ResourceService } from 'src/app/services/resource.service';
import { Feature } from 'src/app/models/planet';

@Component({
  selector: 'task-button',
  templateUrl: './task-button.component.html',
  styleUrls: ['./task-button.component.scss']
})
export class TaskButtonComponent implements OnInit {

  @Input() task: Task;
  @Input() taskDef: TaskDefinition;
  @Input() feature: Feature;

  constructor(private _resourceService: ResourceService, private _taskService: TaskService) { }

  ngOnInit(): void {
  }

  isRunning(): boolean {
    return this.task != null && this._taskService.getCurrentTask() === this.task;
  }

  getTooltip(): TooltipViewModel {
    const tooltip = new TooltipViewModel();
    tooltip.name = this.taskDef.name;
    tooltip.desc = this.taskDef.desc;
    tooltip.costs = this.taskDef.startCost;
    return tooltip;
  }

  canAfford() {
    return this._resourceService.canAfford(this.taskDef.startCost);
  }

  onClick() {
    if (this.taskDef == null) {return;}
    if (!this.canAfford()) {return;}
    if (this.isRunning()) {return;}
    this._resourceService.spend(this.taskDef.startCost);
    if (this.feature != null) {
      this._taskService.beginFeatureTask(this.feature, this.taskDef.name);
    };
  }

}
