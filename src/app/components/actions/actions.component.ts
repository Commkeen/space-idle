import { Component, OnInit } from '@angular/core';
import { Resource } from 'src/app/models/resource';
import { ResourceService } from 'src/app/services/resource.service';

@Component({
  selector: 'app-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.scss']
})
export class ActionsComponent implements OnInit {

  constructor(public resourceService: ResourceService) { }

  ngOnInit() {

  }

}
