
import { Injectable } from '@angular/core';
import { HttpClient } from '../../../node_modules/@angular/common/http';

import { Observable, throwError, forkJoin } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { TreeNode } from '../models/TreeNode';
import { Base64 } from 'js-base64';




@Injectable({
  providedIn: 'root'
})
export class RepoService {
  constructor(private http: HttpClient) { }

  private getSha(): Observable<string> {
    const serviceUrl = `${environment.repoUrl}/commits/${environment.branch}`;
    return this.http.get(serviceUrl).pipe(map(x => x['sha']));
  }
  private getTree() {
    return this.getSha().pipe(
      mergeMap(repoSha => this.http.get(`${environment.repoUrl}/git/trees/${repoSha}?recursive=1`)),
      map(repo => repo['tree']),
      catchError(error => throwError(error))
    );
  }
  private getHierarchizedRawTree(flatTree: TreeNode[]) {
    flatTree.forEach(node => {
      const subTree = flatTree.filter(x => (x.pathLevels === (node['pathLevels'] as number + 1)) && x.path.includes(node.path));
      node.nodes = subTree;
    });
    return flatTree.find(x => x.pathLevels === 1);
  }
  private generateSiteContent(tree, config, dic) {
    const flatTree = tree
      .filter(x => x.path.startsWith(environment.markdownRoot))
      .map(x => new TreeNode(x.path, x.type, x.sha, x.url));
    const configFile = JSON.parse(Base64.decode(config['content']));
    const dictionaire = (dic) ? this.csvToJson(Base64.decode(dic['content'])) : undefined;
    return {
      configFile: configFile,
      dictionaire: dictionaire,
      tree: this.getHierarchizedRawTree(flatTree)
    };
  }

  //  PUBLIC SERVICES
  public getSiteContent() {
    return this.getSha().pipe(
      mergeMap(repoSha => this.getTree()),
      mergeMap(tree => {
        const configFile = tree.find(x => x.path === environment.configFileRoot);
        const dictionaire = tree.find(x => x.path === environment.dictionaireRoot);
        const configFileObs = this.http.get(configFile.url);
        const dictionaireObs = (dictionaire) ? this.http.get(dictionaire.url) : undefined;

        return (dictionaireObs) ?
          forkJoin(configFileObs, dictionaireObs, (config, dic) => this.generateSiteContent(tree, config, dic)) :
          forkJoin(configFileObs, config => this.generateSiteContent(tree, config, undefined));
      }),
    );
  }

  public getFile(url: string) {
    return this.http.get(url).pipe(
      map(file => Base64.decode(file['content']))
    );
  }

  // HELPERS
  private csvToJson(csv: string) {
    const lines = csv.split('\n');
    let result = [];
    let headers = lines[0].split(environment.csvColumnSeperator);
    lines.shift();
    lines.pop();

    for (let i = 0; i < lines.length; i++) {
      let obj = new Object();
      const delimiter = ',';
      const currentline = lines[i].split(delimiter);
      for (let j = 0; j < headers.length; j++) {
        obj[headers[j]] = currentline[j];
      }
      result.push(obj);
    }
    return result;
  }
}
