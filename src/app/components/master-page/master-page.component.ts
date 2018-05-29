import { environment } from './../../../environments/environment';
import {
  Component,
  OnInit,
  NgZone,
  ViewChild,
  Output,
  EventEmitter,
  Version
} from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { MatSidenav } from '@angular/material';
import { Path } from '../../models/path';
import { DocumentationNode } from '../../models/documentation-node';

const SMALL_WIDTH_BREAKPOINT = 959;

@Component({
  selector: 'app-master-page',
  templateUrl: './master-page.component.html',
  styleUrls: ['./master-page.component.scss']
})
export class MasterPageComponent implements OnInit {
  private mediaMatcher: MediaQueryList = matchMedia(
    `(max-width: ${SMALL_WIDTH_BREAKPOINT}px)`
  );
  @ViewChild(MatSidenav) sidenav: MatSidenav;

  selectedNode: DocumentationNode;
  selectedDocument: number;
  currentVersion: DocumentationNode;
  versions: DocumentationNode[] = [];
  panelOpenState = false;

  constructor(zone: NgZone, private router: Router) {
    this.mediaMatcher.addListener(mql =>
      zone.run(() => (this.mediaMatcher = mql))
    );
  }

  ngOnInit() {
    this.versions = environment.versions.map(x => new DocumentationNode(x.name, '', x.id, x.documents, x.nodes as DocumentationNode[]));
    this.selectVersion(this.versions.find(x => x.id === environment.defaultStaticContent.version));
    this.router.events.subscribe(() => {
      if (this.isScreenSmall()) {
        this.sidenav.close();
      }
    });
  }
  // Commands
  selectVersion(node: DocumentationNode): void {
    this.currentVersion = this.versions.find(x => x.id === node.id);
    this.selectNodeById(node.id);
  }
  selectNodeById(id: string): void {
    this.selectedNode = this.searchTree(this.currentVersion, id);
    this.selectNodeDocument();
    this.router.navigate([this.selectedNode.resoursePath]);
  }
  selectNodeDocument(index = 0): void {
    this.selectedDocument = index;
  }
  // Queries
  isScreenSmall(): boolean {
    return this.mediaMatcher.matches;
  }
  searchTree(element: DocumentationNode, id: string): DocumentationNode | null {
    if (element.id === id) {
      return element;
    } else if (element.nodes) {
      let i;
      let result = null;
      for (i = 0; i < element.nodes.length; i++) {
        result = this.searchTree(element.nodes[i], id);
        if (result !== null) {
          return result;
        }
      }
      return result;
    }
    return null;
  }
  // Helpers
  humanizeFileName(fileName: string): string {
    const lastDot = fileName.lastIndexOf('.');
    return fileName
      .substring(0, lastDot)
      .split('_')
      .join(' ');
  }
}
