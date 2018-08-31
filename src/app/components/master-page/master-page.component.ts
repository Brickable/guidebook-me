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

import { take, map } from 'rxjs/operators';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { MatSidenav } from '@angular/material';
import { RepoService } from '../../services/repo.service';
import { Config } from '../../models/Config';
import { OptionItem } from '../../models/OptionItem';
import { TreeNode } from '../../models/TreeNode';
import { ToastrService } from 'ngx-toastr';
<<<<<<< HEAD
=======
import { Title } from '@angular/platform-browser';
>>>>>>> develop


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
  private dictionaire = [];

  currentVersion: TreeNode;
  currentNode: TreeNode;
  currentTreeView: TreeNode[];
  currentDocumentContent: any;
  versionOptions: OptionList = new OptionList();
  languageOptions: OptionList = new OptionList();
  tabIndex = 0;

  constructor(private repoService: RepoService, private router: Router, private route: ActivatedRoute,
<<<<<<< HEAD
    zone: NgZone, private toast: ToastrService) {
=======
    zone: NgZone, private toast: ToastrService, private titleService: Title ) {
>>>>>>> develop
      this.mediaMatcher.addListener(mql => zone.run(() => (this.mediaMatcher = mql)));
  }

  ngOnInit(): void {
    this.subscribeSiteContentObs();
<<<<<<< HEAD
=======
    this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        console.log(val);
      }
  });
>>>>>>> develop
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

  ////  Subscribe observables
  private subscribeRouteQueryParamsObs(): void {
    const _this = this;
    this.routeQueryParams$ = this.route.queryParams.subscribe(x => {
      _this.queryParamsObj = x;
      const version = (x[_this.versionQueryParamKey]) ? x[_this.versionQueryParamKey] : _this.config.defaultVersion;
      const language = (x[_this.languageQueryParamKey]) ? x[_this.languageQueryParamKey] : _this.config.defaultLanguage;
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

  // COMMANDS
  private load(): void {
    try {
      if (this.currentVersion !== undefined) {
        this.setCurrentNode(this.currentVersion, this.getRelativePathByUrl(), true);
        this.refreshPageSource();
        this.currentTreeView = this.getTreeView();
<<<<<<< HEAD
      }
    }  catch (e) {
      this.toast.warning(this.invalidUrlMessage, undefined, environment.toastSettings );
      this.router.navigate(['/'], { queryParams: this.queryParamsObj });
    }
=======
        this.setTitle();
      }
    }  catch (e) {
      this.toast.warning(this.getTranslation(environment.keyForInvalidUrlMessageDictionaire), undefined, environment.toastSettings );
      this.router.navigate(['/'], { queryParams: this.queryParamsObj });
    }
  }
  private setTitle() {
    this.titleService.setTitle(this.currentNode.files[this.tabIndex].name);
>>>>>>> develop
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
<<<<<<< HEAD
      this.toast.warning(this.invalidUrlMessage, undefined, environment.toastSettings );
=======
      this.toast.warning(this.getTranslation(environment.keyForInvalidUrlMessageDictionaire), undefined, environment.toastSettings );
>>>>>>> develop
      this.router.navigate(['/']);
    }
  }
  private setVersionOptions(version = this.config.defaultVersion): void {
    this.versionOptions.items = [];
    if (this.config.enableVersioning) {
      this.versionOptions.selected = version;
      this.config.versions.forEach(element => {
        const item = new OptionItem(element, this.getNameByusedConventions(element));
        this.versionOptions.items.push(item);
      });
    }
  }
  private setLanguageOptions(language = this.config.defaultLanguage): void {
    this.languageOptions.items = [];
    if (this.config.enableMultiLanguage) {
      this.languageOptions.selected = language;
      this.config.languages.forEach(element => {
        const item = new OptionItem(element, this.getNameByusedConventions(element));
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
<<<<<<< HEAD
  private getTranslation(keyVal: string) {
    const dicItem = this.dictionaire.find(x => x[environment.dictionaireKeyName].toLocaleLowerCase() === keyVal.toLocaleLowerCase());
    return (dicItem) ? dicItem[this.languageOptions.selected] : '';
  }
  private getNameByusedConventions(text: string): string {
    if (environment.useDictionaire) {
=======
  private getNameByusedConventions(text: string): string {
    if (this.config[environment.keyForEnableDictionaires]) {
>>>>>>> develop
      const match = this.dictionaire.find(x => x[environment.dictionaireKeyName].toLowerCase() === text.toLowerCase());
      if (match) {
        return match[this.languageOptions.selected];
      }
    }
<<<<<<< HEAD
    return (environment.useUnderscoreToSpaceConvention) ?
      text.split('_').join(' ').replace ('.md', '') : text;
=======
    return (environment.useUnderscoreToSpaceConvention) ? text.split('_').join(' ').replace ('.md', '') : text;
>>>>>>> develop
  }
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
  public getTranslation(keyVal: string) {
    let translation = '';
    if ((this.dictionaire || this.config)) {
      const dicItem = this.dictionaire.find(x => x[environment.dictionaireKeyName].toLocaleLowerCase() === keyVal.toLocaleLowerCase());
      translation = (dicItem) ? dicItem[this.languageOptions.selected] : translation;
    } else {
      translation = (environment.defaultTranslations[keyVal]) ? environment.defaultTranslations[keyVal] : translation;
    }
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
  private get invalidUrlMessage() {
    return ((this.config) && (this.config['invalidUrl'])) ? this.config['invalidUrl'] : environment.defaultToastMessages.invalidUrl;
  }

  get isScreenSmall(): boolean {
    return this.mediaMatcher.matches;
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
<<<<<<< HEAD
=======
  get languageTranslation() {
    return this.getTranslation(environment.KeyForLanguageDictionaire);
  }
  get versionTranslation() {
    return this.getTranslation(environment.keyForVersionDictionaire);
  }
>>>>>>> develop
}
