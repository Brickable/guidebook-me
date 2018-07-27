import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'main-content',
  templateUrl: './main-content.component.html',
  styleUrls: ['./main-content.component.scss']
})
export class MainContentComponent implements OnInit {
  @Input() currentPath: string;
  constructor() {}

  ngOnInit() {}
}
