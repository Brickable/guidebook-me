
import { OptionList } from './../../models/OptionList';
import { environment } from './../../../environments/environment';
import {
  Component,
  OnInit,
  OnDestroy,
  NgZone,
  ViewChild,
  OnChanges,
  ViewChildren,
  QueryList,
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
  // @ViewChild(MatSidenav) drawer: MatSidenav;
  @ViewChildren('sidenav') sNav: QueryList<MatSidenav>;

  config: Config;
  private siteContent$;
  private pageSource$;
  private routerListener$;
  private repoServiceSubscription;
  private tree: TreeNode;

  currentVersion: TreeNode;
  currentNode: TreeNode;
  currentTreeView: TreeNode[];
  currentDocumentContent: any;

  showVersionOptions: boolean;
  showLanguageOptions: boolean;
  versionOptions: OptionList = new OptionList();
  languageOptions: OptionList = new OptionList();
  tabIndex = 0;

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
    this.setSiteContentObs();
    this.subscribeSiteContentObs();
    this.subscribeRouterListenerObs();
  }

  ngOnDestroy() {
    this.siteContent$.unsubscribe();
  }

  onSelectingVersion(value) {
    this.versionOptions.selected = value;
    this.setCurrentVersion();
  }

  // Commands

  private setPageSourceObs() {
    this.pageSource$ = this.repoService.getFile(
      this.currentNode.files[this.tabIndex].apiUrl).pipe(take(1)
      );
  }
  private subscribePageSourceObs() {
    this.pageSource$.subscribe(res => {
      this.currentDocumentContent = res;
    });
  }
  private refreshPageSource() {
    this.setPageSourceObs();
    this.subscribePageSourceObs();
  }

  private subscribeRouterListenerObs() {
    this.routerListener$ = this.router.events.subscribe(
      (e) => {
        if (this.isScreenSmall()) {
          // this.sidenav.close();
        }
        if (e instanceof NavigationEnd) {
          this.setCurrentNode();
          this.refreshPageSource();
        }
      }
    );
  }
  private setSiteContentObs() {
    this.siteContent$ = forkJoin(
      this.repoService.getConfigs(),
      this.repoService.getTreeNodes(),
      (configFile, tree) => {
        return { configFile, tree };
      }
    );
  }
  private subscribeSiteContentObs() {
    this.siteContent$.subscribe(response => {
      this.setConfig(response.configFile.defaultStaticContent);
      this.setMainTree(response.tree);
      this.setVersionOptions();
      this.setLanguageOptions();
      this.setCurrentVersion();
      this.setPageSourceObs();
      this.refreshPageSource();
    });
  }

  selectingTab(index = 0): void {
    this.tabIndex = index;
    this.router.navigate([`${this.currentNode.relativeLink}/${this.tabIndex}`]);
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

  private setLanguageOptions() {
    if (this.config.enableMultiLanguage) {
      this.config.languages.forEach(element => {
        this.languageOptions.selected = this.config.defaultLanguage;
        const item = new OptionItem(element, this.spacingText(element));
        this.languageOptions.items.push(item);
      });
    }
  }

  private setCurrentVersion(path: string = '') {
    const hasVersioning = this.config.enableVersioning;
    const hasMultiLang = this.config.enableMultiLanguage;
    if (path === '') {
      path = this.getDocumentsBaseRoot();
    }
    this.currentVersion = this.findNode(this.tree, path);
    this.setCurrentNode();
    this.currentTreeView = this.setTreeView();
  }
  private getDocumentsBaseRoot(): string {
    let path = '';
    const hasVersioning = this.config.enableVersioning;
    const hasMultiLang = this.config.enableMultiLanguage;

    if (!hasVersioning && !hasMultiLang) {
      path = environment.markdownRoot;
    } else if (hasVersioning && !hasMultiLang) {
      path = `${environment.markdownRoot}/${this.versionOptions.selected}`;
    } else if (!hasVersioning && hasMultiLang) {
      path = `${environment.markdownRoot}/${this.languageOptions.selected}`;
    } else {
      path = `${environment.markdownRoot}/${this.versionOptions.selected}/${this.languageOptions.selected}`;
    }
    return path;
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

  private setTreeView(node: TreeNode = this.currentVersion): TreeNode[] {
    const treeView: TreeNode[] = [];
    node.folders.forEach(element => {
      const item = new TreeNode(element.path, element.type, element.sha, element.apiUrl);
      item.relativeLink = element.relativeLink;
      item.nodes = this.setTreeView(element);
      treeView.push(item);
    });
    return treeView;
  }

  private setSelectedLanguageOption(option) {
    this.languageOptions.selected = option;
  }
  private setSelectedVersionOption(option: string) {
    this.versionOptions.selected = option;
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

  isTabActive(index: number) {
    return index === this.tabIndex;
  }

  // Helpers
  private spacingText(text: string, isPath = false): string {
    text = (isPath) ? text.substring(0, text.lastIndexOf('.')) : text;
    return text.split('_').join(' ');
  }
}
