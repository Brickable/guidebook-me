import { OptionList } from './../../models/OptionList';
import { environment } from './../../../environments/environment';
import {
  Component,
  OnInit,
  OnDestroy,
  ViewChildren,
  QueryList,
} from '@angular/core';

import { take } from 'rxjs/operators';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { MatSidenav } from '@angular/material';
import { RepoService } from '../../services/repo.service';
import { Config } from '../../models/Config';
import { OptionItem } from '../../models/OptionItem';
import { TreeNode } from '../../models/TreeNode';
import { ToastrService } from 'ngx-toastr';
import { Title } from '@angular/platform-browser';
import { BreakpointObserver, BreakpointState, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'master-page',
  templateUrl: './master-page.component.html',
  styleUrls: ['./master-page.component.scss']

})
export class MasterPageComponent implements OnInit, OnDestroy {
  @ViewChildren('sidenav') sNav: QueryList<MatSidenav>;
  private siteContent$;
  private pageSource$;
  private routeQueryParams$;
  private routeUrl$;
  private webBreakpoints$;

  private config: Config;
  private tree: TreeNode;
  private queryParamsObj = {};
  private currentUrl = '';
  private dictionaire = [];

  currentVersion: TreeNode;
  currentNode: TreeNode;
  currentTreeView: TreeNode[];
  currentDocumentContent: any;
  versionOptions: OptionList = new OptionList();
  languageOptions: OptionList = new OptionList();
  tabIndex = 0;
  isMobile = false;

  constructor(
    private repoService: RepoService,
    private router: Router,
    private route: ActivatedRoute,
    private toast: ToastrService,
    private titleService: Title,
    private breakpointObserver: BreakpointObserver ) {}

  ngOnInit(): void {
    this.subscribeWebBreakpointsObs();
    this.subscribeSiteContentObs();
  }
  ngOnDestroy(): void {
    this.siteContent$.unsubscribe();
    this.routeQueryParams$.unsubscribe();
    this.routeUrl$.unsubscribe();
    this.webBreakpoints$.unsubscribe();
  }

  // EVENTS
  public onSelectingTab(tabIndex = 0): void {
    this.selectTab(tabIndex);
  }
  public onSelectingVersion(value): void {
    this.updateQueryParams(environment.queryParamValueVersion, value);
    this.router.navigate([`${this.currentUrl}`], { queryParams: this.queryParamsObj });
  }
  public onSelectingLanguage(value): void {
    this.updateQueryParams(environment.queryParamValueLanguage, value);
    this.router.navigate([`${this.currentUrl}`], { queryParams: this.queryParamsObj });
  }

  // SUBSCRIPTIONS
  private subscribeRouteQueryParamsObs(): void {
    const _this = this;
    this.routeQueryParams$ = this.route.queryParams.subscribe(x => {
      _this.queryParamsObj = x;
      const version = (this.checkIfVersionQueryParamIsValid()) ? x[environment.queryParamValueVersion] : _this.config.defaultVersion;
      const language = (this.checkIfLanguageQueryParamIsValid()) ? x[environment.queryParamValueLanguage] : _this.config.defaultLanguage;
      _this.setLanguageOptions(language);
      _this.setVersionOptions(version);
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
    this.pageSource$ = this.repoService
      .getFile(this.currentNode.files[this.tabIndex].apiUrl)
      .pipe(take(1)).subscribe(res => {
        this.currentDocumentContent = res;
      });
  }
  private subscribeSiteContentObs(): void {
    this.siteContent$ = this.repoService.getSiteContent()
      .subscribe(response => {
        this.config = response.configFile.defaultStaticContent;
        this.setMainTree(response.tree);
        this.dictionaire = response.dictionaire;
        this.subscribeRouteUrlObs();
        this.subscribeRouteQueryParamsObs();
      });
  }
  private subscribeWebBreakpointsObs(): void {
    this.webBreakpoints$ = this.breakpointObserver.observe([Breakpoints.Web])
    .subscribe(
      (result: BreakpointState) => {
        this.isMobile = !result.matches;
    });
  }

  // COMMANDS
  private load(): void {
    try {
      if (this.currentVersion !== undefined) {
        this.setCurrentNode(this.currentVersion, this.getRelativePathByUrl(), true);
        this.refreshPageSource();
        this.currentTreeView = this.getTreeView();
        this.setTitle();
      }
    }  catch (e) {
      this.toast.warning(this.getTranslation(environment.keyForInvalidUrlMessageDictionaire), undefined, environment.toastSettings );
      this.router.navigate(['/'], { queryParams: this.queryParamsObj });
    }
  }
  private setTitle(): void {
    this.titleService.setTitle(this.currentNode.files[this.tabIndex].name);
  }
  private refreshPageSource(): void {
    this.subscribePageSourceObs();
  }
  private setMainTree(rawTree: TreeNode): void {
    rawTree.generateRelativeLinksRecursive(
      this.config.enableVersioning,
      this.config.enableMultiLanguage
    );
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
      this.toast.warning(this.getTranslation(environment.keyForInvalidUrlMessageDictionaire), undefined, environment.toastSettings );
      this.router.navigate(['/']);
    }
  }
  private setVersionOptions(version = this.config.defaultVersion): void {
    this.versionOptions.items = [];
    if (this.config.enableVersioning) {
      this.versionOptions.selected = version;
      this.config.versions.forEach(element => {
        const item = new OptionItem(element, this.getTranslation(element));
        this.versionOptions.items.push(item);
      });
    }
  }
  private setLanguageOptions(language = this.config.defaultLanguage): void {
    this.languageOptions.items = [];
    this.languageOptions.selected = this.getSelectedLanguage(language);
    if (this.config.enableMultiLanguage) {
      this.config.languages.forEach(element => {
        const item = new OptionItem(element, this.getTranslation(element));
        this.languageOptions.items.push(item);
      });
    }
  }
  private getSelectedLanguage(language) {
    if (language) {
      return language;
    } else if (this.config.defaultLanguage) {
      return this.config.defaultLanguage;
    } else if (this.config.enableDictionaires) {
      return Object.keys(this.dictionaire[0])[1]; // return property name of 2 column;
    }
    return '';
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
      const item = new TreeNode(element.path, element.type, element.sha,
        element.apiUrl, this.getTranslation(element.rawNameWithoutFileExtension));
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
  private checkIfVersionQueryParamIsValid(): boolean {
    if (this.queryParamsObj === {} || this.queryParamsObj[environment.queryParamValueVersion] === undefined ) {
      return true;
    }
    return (this.config.versions.find(x => x.toLowerCase() ===  this.queryParamsObj[environment.queryParamValueVersion].toLowerCase())) ?
      true : false;
  }
  private checkIfLanguageQueryParamIsValid(): boolean {
    if (this.queryParamsObj === {} || this.queryParamsObj[environment.queryParamValueLanguage] === undefined ) {
      return true;
    }
    return (this.config.languages.find(x => x.toLowerCase() ===  this.queryParamsObj[environment.queryParamValueLanguage].toLowerCase())) ?
    true : false;
  }
  public getTranslation(keyVal: string) {
    let translation = keyVal;
    if (this.dictionaire) {
      const dicItem = this.dictionaire.find(x => x[environment.dictionaireKeyName].toLocaleLowerCase() === keyVal.toLocaleLowerCase());
      translation = (dicItem) ? dicItem[this.languageOptions.selected] : translation;
    } else {
      translation = (environment.defaultTranslations[keyVal]) ? environment.defaultTranslations[keyVal] : translation;
    }
    translation = (environment.useUnderscoreToSpaceConvention && translation) ?
      translation.split('_').join(' ').replace ('.md', '') : translation;
    return translation;
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

  get getCurrentNodeDocuments(): TreeNode[] {
    return this.currentNode.nodes.filter(x => x.isFile);
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
  get languageTranslation() {
    return this.getTranslation(environment.KeyForLanguageDictionaire);
  }
  get versionTranslation() {
    return this.getTranslation(environment.keyForVersionDictionaire);
  }
}
