
import { OptionList } from './../../models/OptionList';
import { environment } from './../../../environments/environment';
import {
  Component,
  OnInit,
  OnDestroy,
  NgZone,
  ViewChildren,
  QueryList,
} from '@angular/core';

import { forkJoin } from 'rxjs';
import { take, map } from 'rxjs/operators';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { MatSidenav } from '@angular/material';
import { RepoService } from '../../services/repo.service';
import { Config } from '../../models/Config';
import { OptionItem } from '../../models/OptionItem';
import { TreeNode } from '../../models/TreeNode';
import { ToastrService } from 'ngx-toastr';


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
  @ViewChildren('sidenav') sNav: QueryList<MatSidenav>;
  private siteContent$;
  private pageSource$;
  private routerListener$;
  private routeQueryParams$;
  private routeUrl$;

  private config: Config;
  private tree: TreeNode;
  private queryParamsObj = {};
  private versionQueryParamKey = 'v';
  private languageQueryParamKey = 'lang';
  private currentUrl = '';

  currentVersion: TreeNode;
  currentNode: TreeNode;
  currentTreeView: TreeNode[];
  currentDocumentContent: any;
  versionOptions: OptionList = new OptionList();
  languageOptions: OptionList = new OptionList();
  tabIndex = 0;

  constructor(private repoService: RepoService, private router: Router, private route: ActivatedRoute,
    zone: NgZone, private toast: ToastrService) {
      this.mediaMatcher.addListener(mql => zone.run(() => (this.mediaMatcher = mql)));
  }

  ngOnInit(): void {
    this.setSiteContentObs();
    this.subscribeSiteContentObs();
  }
  ngOnDestroy(): void {
    this.siteContent$.unsubscribe();
    this.routerListener$.unsubscribe();
    this.routeQueryParams$.unsubscribe();
    this.routeUrl$.unsubscribe();
  }

  // EVENTS
  public onSelectingTab(tabIndex = 0): void {
    this.selectTab(tabIndex);
  }
  public onSelectingVersion(value): void {
    this.updateQueryParams(this.versionQueryParamKey, value);
    this.router.navigate([`${this.currentUrl}`], { queryParams: this.queryParamsObj });
  }
  public onSelectingLanguage(value): void {
    this.updateQueryParams(this.languageQueryParamKey, value);
    this.router.navigate([`${this.currentUrl}`], { queryParams: this.queryParamsObj });
  }

  ////  Setup Observables
  private setPageSourceObs(): void {
    this.pageSource$ = this.repoService.getFile(this.currentNode.files[this.tabIndex].apiUrl).pipe(take(1));
  }
  private setSiteContentObs(): void {
    this.siteContent$ = forkJoin(
      this.repoService.getConfigs(),
      this.repoService.getTreeNodes(),
      (configFile, tree) => {
        return { configFile, tree };
      }
    );
  }
  ////  Subscribe observables
  private subscribeRouteQueryParamsObs(): void {
    const _this = this;
    this.routeQueryParams$ = this.route.queryParams.subscribe(x => {
      _this.queryParamsObj = x;
      const version = (x[_this.versionQueryParamKey]) ? x[_this.versionQueryParamKey] : _this.config.defaultVersion;
      const language = (x[_this.languageQueryParamKey]) ? x[_this.languageQueryParamKey] : _this.config.defaultLanguage;
      _this.setVersionOptions(version);
      _this.setLanguageOptions(language);
      _this.setCurrentVersion();
      _this.load();
    });
  }
  private subscribeRouteUrlObs(): void {
    const _this = this;
    this.routeUrl$ = this.route.url.subscribe(
      x => {
        _this.currentUrl = x.join('/');
        this.load();
      });
  }
  private subscribePageSourceObs(): void {
    this.pageSource$.subscribe(res => {
      this.currentDocumentContent = res;
    });
  }
  private subscribeSiteContentObs(): void {
    this.siteContent$.subscribe(response => {
      this.config = response.configFile.defaultStaticContent;
      this.setMainTree(response.tree);
      this.subscribeRouteUrlObs();
      this.subscribeRouteQueryParamsObs();
    });
  }

  // COMMANDS
  private load(): void {
    try {
      if (this.currentVersion !== undefined) {
        this.setCurrentNode(this.currentVersion, this.getRelativePathByUrl(), true);
        this.refreshPageSource();
        this.currentTreeView = this.getTreeView();
      }
    }  catch (e) {
      this.toast.warning(this.invalidUrlMessage, undefined, environment.toastSettings );
      this.router.navigate(['/'], { queryParams: this.queryParamsObj });
    }
  }
  private refreshPageSource(): void {
    this.setPageSourceObs();
    this.subscribePageSourceObs();
    this.setPageSourceObs();
    this.subscribePageSourceObs();
  }
  private setMainTree(rawTree: TreeNode): void {
    rawTree.generateRelativeLinksRecursive(this.config.enableVersioning, this.config.enableMultiLanguage);
    this.tree = rawTree;
  }
  private setCurrentNode(baseNode: TreeNode, path: string, byRelativePath): void {
      this.currentNode = this.findNode(baseNode, path, byRelativePath);
      this.selectTab(this.currentNode.getIndexByRawName(this.getFileNameByUrl()));
  }
  private selectTab(tabIndex = 0): void {
    this.tabIndex = (tabIndex === 0) ? this.currentNode.tabIndex : tabIndex;
    this.currentUrl = `${this.currentNode.relativeLink}/${this.currentNode.files[this.tabIndex].rawName}`;
    this.router.navigate([this.currentUrl], { queryParams: this.queryParamsObj });
  }
  private setCurrentVersion(path: string = ''): void {
    if (path === '') {
      path = this.getDocumentsBaseRoot();
    }
    this.currentVersion = this.findNode(this.tree, path);
    if (!this.currentVersion) {
      this.toast.warning(this.invalidUrlMessage, undefined, environment.toastSettings );
      this.router.navigate(['/']);
    }
  }
  private setVersionOptions(version = this.config.defaultVersion): void {
    this.versionOptions.items = [];
    if (this.config.enableVersioning) {
      this.versionOptions.selected = version;
      this.config.versions.forEach(element => {
        const item = new OptionItem(element, this.spacingText(element));
        this.versionOptions.items.push(item);
      });
    }
  }
  private setLanguageOptions(language = this.config.defaultLanguage): void {
    this.languageOptions.items = [];
    if (this.config.enableMultiLanguage) {
      this.languageOptions.selected = language;
      this.config.languages.forEach(element => {
        const item = new OptionItem(element, this.spacingText(element));
        this.languageOptions.items.push(item);
      });
    }
  }
  private updateQueryParams(key, value): void {
    let clone = Object.assign({}, this.queryParamsObj);
    clone[key] = value;
    this.queryParamsObj = clone;
  }

  // QUERIES
  private getTreeView(node: TreeNode = this.currentVersion): TreeNode[] {
    const treeView: TreeNode[] = [];
    node.folders.forEach(element => {
      const item = new TreeNode(element.path, element.type, element.sha, element.apiUrl);
      item.relativeLink = element.relativeLink;
      item.nodes = this.getTreeView(element);
      treeView.push(item);
    });
    return treeView;
  }
  private findNode(node: TreeNode, path: string, byRelativePath = false): TreeNode | null {
    const pathToCompare = (byRelativePath) ? node.relativeLink : node.path;
    if (pathToCompare === path || pathToCompare === `/${path}`) {
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
  private getRelativePathByUrl(): string {
    return (this.currentUrl.toLowerCase().endsWith('.md')) ?
      this.currentUrl.substring(0, this.currentUrl.lastIndexOf('/')) : this.currentUrl;
  }
  private getFileNameByUrl(): string {
    return (this.currentUrl.toLowerCase().endsWith('.md')) ?
      this.currentUrl.substring(this.currentUrl.lastIndexOf('/') + 1) : '';
  }
  public  getDocumentsBaseRoot(): string {
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
  public isTabActive(index: number): boolean {
    return index === this.tabIndex;
  }
  private get invalidUrlMessage() {
    return ((this.config) && (this.config['invalidUrl'])) ? this.config['invalidUrl'] : environment.defaultToastMessages.invalidUrl;
  }

  get isScreenSmall(): boolean {
    return this.mediaMatcher.matches;
  }
  get getCurrentNodeDocuments(): TreeNode[] {
    return this.currentNode.nodes.filter(x => x.isFile);
  }
  get getURL(): string {
    return this.router.url;
  }
  get showVersionOptions(): boolean {
    return (this.config !== undefined
      && this.config.enableVersioning
      && this.versionOptions.items
      && this.versionOptions.items.length !== 0
      && this.currentVersion !== undefined
      && this.currentVersion !== null
    );
  }
  get showLanguageOptions(): boolean {
    return (this.config !== undefined
      && this.config.enableMultiLanguage
      && this.languageOptions.items
      && this.languageOptions.items.length !== 0);
  }

  get showOptionsBar(): boolean {
    return this.showLanguageOptions || this.showVersionOptions;
  }
  get getQueryParams(): object  {
    return this.queryParamsObj;
  }

  // Helpers
  private spacingText(text: string, isPath = false): string {
    text = (isPath) ? text.substring(0, text.lastIndexOf('.')) : text;
    return text.split('_').join(' ');
  }
}
