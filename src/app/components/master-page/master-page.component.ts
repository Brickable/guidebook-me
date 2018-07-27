import { Path } from './../../models/path';
import { OptionList } from './../../models/OptionList';
import { environment } from './../../../environments/environment';
import {
  Component,
  OnInit,
  OnDestroy,
  NgZone,
  ViewChild,
  Output,
  EventEmitter,
  Version
} from '@angular/core';

import { forkJoin } from 'rxjs';
import { Router } from '@angular/router';
import { MatSidenav } from '@angular/material';
import { DocumentationNode } from '../../models/documentation-node';
import { RepoService } from '../../services/repo.service';
import { Config } from '../../models/Config';
import { OptionItem } from '../../models/OptionItem';
import { TreeNode } from '../../models/TreeNode';

const SMALL_WIDTH_BREAKPOINT = 959;

@Component({
  selector: 'master-page',
  templateUrl: './master-page.component.html',
  styleUrls: ['./master-page.component.scss']
})
export class MasterPageComponent implements OnInit, OnDestroy {
  private mediaMatcher: MediaQueryList = matchMedia(
    `(max-width: ${SMALL_WIDTH_BREAKPOINT}px)`
  );
  @ViewChild(MatSidenav) sidenav: MatSidenav;

  private siteContent$;
  private config: Config;
  private tree: TreeNode;

  currentVersion: TreeNode;
  currentNode: TreeNode;
  currentTreeView: TreeNode[];

  showVersionOptions: boolean;
  showLanguageOptions: boolean;
  // isSidePanelOpen = false;
  versionOptions: OptionList = new OptionList();
  languageOptions: OptionList = new OptionList();
  tabIndex: number;

  constructor(
    private repoService: RepoService,
    private router: Router,
    zone: NgZone,
    ) {
    this.mediaMatcher.addListener(mql =>
      zone.run(() => (this.mediaMatcher = mql))
    );
  }

  ngOnInit() {
    this.siteContent$ = forkJoin(
      this.repoService.getConfigs(),
      this.repoService.getDocumentationTree(),
      (configFile, tree) => {
        return { configFile, tree };
      }
    );
    this.siteContent$.subscribe(response => {
      this.config = response.configFile.defaultStaticContent;
      this.tree = response.tree;
      this.showVersionOptions = this.config.enableVersioning;
      this.showLanguageOptions = this.config.enableMultiLanguage;
      this.setVersionOptions();
      this.setLanguageOptions();
      this.setCurrentVersion();
    });
    // this.versions =  environment.versions.map(x => new DocumentationNode(x.name, '', x.id, x.documents, x.nodes as DocumentationNode[]));
    // this.selectVersion(this.versions.find(x => x.id === environment.defaultStaticContent.version));
    this.router.events.subscribe(() => {
      if (this.isScreenSmall()) {
        this.sidenav.close();
      }
    });
  }

  ngOnDestroy() {
    this.siteContent$.unsubscribe();
  }

  onSelectingVersion(value) {
    this.versionOptions.selected = value;
    this.setCurrentVersion();
  }
  onSelectingPath(path: string) {
    this.currentNode = this.findNode(this.currentVersion, path);
    this.onSelectingTab();
    this.router.navigate([this.currentNode.path]);
  }

  // Commands

  onSelectingTab(index = 0): void {
    this.tabIndex = index;
  }

  private setVersionOptions() {
    if (this.config.enableVersioning) {
      this.config.versions.forEach(element => {
        this.versionOptions.selected = this.config.defaultVersion;
        const item = new OptionItem(element, this.spacingText(element));
        this.versionOptions.items.push(item);
      });
    }
  }
  private setSelectedVersionOption(option: string) {
    this.versionOptions.selected = option;
  }
  private setLanguageOptions() {
    if (this.config.enableMultiLanguage) {
      this.config.languages.forEach(element => {
        this.languageOptions.selected = this.config.defaultLanguage;
        const item = new OptionItem(element, this.spacingText(element));
        this.languageOptions.items.push(item);
      });
    }
  }
  private setSelectedLanguageOption(option) {
    this.languageOptions.selected = option;
  }

  private setCurrentVersion(path: string = '') {
    const hasVersioning = this.config.enableVersioning;
    const hasMultiLang = this.config.enableMultiLanguage;
    if (path !== '') {
    } else if (!hasVersioning && !hasMultiLang) {
        path = environment.markdownRoot;
    } else if (hasVersioning && !hasMultiLang) {
        path = `${environment.markdownRoot}/${this.versionOptions.selected}`;
    } else if (!hasVersioning && hasMultiLang) {
        path = `${environment.markdownRoot}/${this.languageOptions.selected}`;
    } else {
        path = `${environment.markdownRoot}/${this.versionOptions.selected}/${this.languageOptions.selected}`;
    }
    this.currentVersion = this.findNode(this.tree, path);
    this.currentNode = this.currentVersion;
    this.currentTreeView = this.getTreeView(this.currentVersion);
    console.log(this.currentVersion);
    console.log(this.currentNode);
    console.log(this.currentTreeView);
  }

  private findNode(node: TreeNode, path: string): TreeNode | null {
    if (node.path === path) {
      return node;
    } else if (node.nodes) {
      let i;
      let result = null;
      for (i = 0; i < node.nodes.length; i++) {
        result = this.findNode(node.nodes[i], path);
        if (result !== null) {
          return result;
        }
      }
      return result;
    }
    return null;
  }

  private getTreeView(node: TreeNode) {
    let treeView: TreeNode[] = [];
    treeView = node.folders;
    treeView.forEach(element => {
      element.nodes = this.getTreeView(element);
    });
    return treeView;
  }

  // selectVersion(node: DocumentationNode): void {
  //   this.currentVersion = this.versions.find(x => x.id === node.id);
  //   this.selectNodeById(node.id);
  // }
  // selectNodeById(id: string): void {
  //   this.selectedNode = this.searchTree(this.currentVersion, id);
  //   this.selectNodeDocument();
  //   this.router.navigate([this.selectedNode.resoursePath]);
  // }
  // selectNodeDocument(index = 0): void {
  //   this.selectedDocument = index;
  // }
  // Queries
  isScreenSmall(): boolean {
    return this.mediaMatcher.matches;
  }
  get getCurrentNodeDocuments() {
    return this.currentNode.nodes.filter(x => x.isFile);
  }

  // Helpers
  private spacingText(text: string, isPath = false): string {
    text = (isPath) ? text.substring(0, text.lastIndexOf('.')) : text;
    return text.split('_').join(' ');
  }

}
