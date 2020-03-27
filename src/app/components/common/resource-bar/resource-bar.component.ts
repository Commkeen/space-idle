import { Component, OnInit, Input } from '@angular/core';
import { Resource } from 'src/app/models/resource';

@Component({
  selector: 'app-resource-bar',
  templateUrl: './resource-bar.component.html',
  styleUrls: ['./resource-bar.component.scss']
})
export class ResourceBarComponent implements OnInit {

  @Input() resource: Resource = new Resource('test', 5, 100);

  constructor() { }

  ngOnInit(): void {
  }

}
