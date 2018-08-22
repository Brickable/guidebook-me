import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'main-content',
  templateUrl: './main-content.component.html',
  styleUrls: ['./main-content.component.scss']
})
export class MainContentComponent {
  @Input() currentMarkdown: string;
  constructor() {}
}
