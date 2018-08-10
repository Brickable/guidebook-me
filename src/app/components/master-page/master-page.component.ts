
import { OptionList } from './../../models/OptionList';
import { environment } from './../../../environments/environment';
import {
  Component,
  OnInit,
  OnDestroy,
  NgZone,
  ViewChild,
  OnChanges,
} from '@angular/core';

import { forkJoin } from 'rxjs';
import { take } from 'rxjs/operators';
import { Router, NavigationEnd } from '@angular/router';
import { MatSidenav } from '@angular/material';
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
  config: Config;
  private siteContent$;
  private routerListener$;
  private repoServiceSubscription;
  private tree: TreeNode;

  currentVersion: TreeNode;
  currentNode: TreeNode;
  currentTreeView: TreeNode[];
  currentDocumentContent: any;

  showVersionOptions: boolean;
  showLanguageOptions: boolean;
  // isSidePanelOpen = false;
  versionOptions: OptionList = new OptionList();
  languageOptions: OptionList = new OptionList();
  tabIndex = 0;
  differ: any;


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
      this.repoService.getTreeNodes(),
      (configFile, tree) => {
        return { configFile, tree };
      }
    );
    this.routerListener$ = this.router.events.subscribe(
      (e) => {
        if (e instanceof NavigationEnd) {
          this.setCurrentNode();
        }
      }
    );

    this.repoServiceSubscription = this.siteContent$.subscribe(response => {
      this.setConfig(response.configFile.defaultStaticContent);
      this.setMainTree(response.tree);
      this.setVersionOptions();
      this.setLanguageOptions();
      this.setCurrentVersion();
      this.selectingTab();
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
    this.repoServiceSubscription.unsubscribe();
  }

  onSelectingVersion(value) {
    this.versionOptions.selected = value;
    this.setCurrentVersion();
  }

  // Commands
  selectingTab(index = 0): void {
    this.tabIndex = index;
    this.refreshCurrentDocument();
    // this.router.navigate([`${this.currentNode.relativeLink}/${this.tabIndex}`]);
  }
  refreshCurrentDocument() {

    console.log(this.currentNode.files[this.tabIndex].apiUrl);
    const src =  this.repoService.getFile(
      this.currentNode.files[this.tabIndex].apiUrl).pipe(take(1)
    );
    src.subscribe(res => {
      this.currentDocumentContent = res;
    });
  }

  private setConfig(config: Config) {
    this.config = config;
    this.showVersionOptions = config.enableVersioning;
    this.showLanguageOptions = config.enableMultiLanguage;
  }

  private setMainTree(rawTree: TreeNode) {
    rawTree.generateRelativeLinksRecursive(this.config.enableVersioning, this.config.enableMultiLanguage);
    this.tree = rawTree;
  }

  private setCurrentNode() {
    let possibleTabIndex = Number(this.router.url.substring(this.router.url.lastIndexOf('/') + 1));
    const path = this.router.url.substring(0, this.router.url.lastIndexOf('/'));
    this.currentNode = this.findNode(this.currentVersion, path, true);
    possibleTabIndex = isNaN(possibleTabIndex) ? 0 : possibleTabIndex;
    this.selectingTab(possibleTabIndex);
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
    console.log(this.tree.nodes[1].nodes[2].nodes[0].nodes);
    this.currentTreeView = this.generateTreeView();
  }

  private findNode(node: TreeNode, path: string, byRelativePath = false): TreeNode | null {
    const pathToCompare = (byRelativePath) ? node.relativeLink : node.path;
    if (pathToCompare === path) {
      return node;
    } else if (node.nodes) {
      let i;
      let result = null;
      for (i = 0; i < node.nodes.length; i++) {
        result = this.findNode(node.nodes[i], path, byRelativePath);
        if (result !== null) {
          return result;
        }
      }
      return result;
    }
    return null;
  }
  private generateTreeView(node: TreeNode = this.currentVersion): TreeNode[] {
    let treeView: TreeNode[] = [];
    node.folders.forEach(element => {
      const item = new TreeNode(element.path, element.type, element.sha, element.apiUrl);
      item.relativeLink = element.relativeLink;
      item.nodes = this.generateTreeView(element);
      treeView.push(item);
    });
    return treeView;
  }

  // Queries
  isScreenSmall(): boolean {
    return this.mediaMatcher.matches;
  }
  get getCurrentNodeDocuments() {
    return this.currentNode.nodes.filter(x => x.isFile);
  }
  get getURL() {
    return this.router.url;
  }

  // Helpers
  private spacingText(text: string, isPath = false): string {
    text = (isPath) ? text.substring(0, text.lastIndexOf('.')) : text;
    return text.split('_').join(' ');
  }
}
