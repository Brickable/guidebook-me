
import { Injectable } from '@angular/core';
import { HttpClient } from '../../../node_modules/@angular/common/http';

import { Observable, of, throwError, forkJoin } from 'rxjs';
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
<<<<<<< HEAD

  public getSiteContent() {
    return this.getSha().pipe(
      mergeMap(repoSha => this.getTree()),
      mergeMap(tree => {
        const configFile = tree.find(x => x.path === environment.configFileRoot);
        const dictionaire = tree.find(x => x.path === environment.dictionaireRoot);
        return forkJoin(
          this.http.get(configFile.url),
          this.http.get(dictionaire.url),
          (config, dic) => {
            const flatTree = tree
              .filter(x => x.path.startsWith(environment.markdownRoot))
              .map(x => new TreeNode(x.path, x.type, x.sha, x.url));
            return {
              configFile: JSON.parse(Base64.decode(config['content'])),
              dictionaire: this.csvToJson(Base64.decode(dic['content'])),
              tree: this.getHierarchizedRawTree(flatTree) };
          });
      }));
  }

=======
>>>>>>> develop
  private getHierarchizedRawTree(flatTree: TreeNode[]) {
    flatTree.forEach(node => {
      const subTree = flatTree.filter(x => (x.pathLevels === (node['pathLevels'] as number + 1)) && x.path.includes(node.path));
      node.nodes = subTree;
    });
    return flatTree.find(x => x.pathLevels === 1);
  }

  //  PUBLIC SERVICES
  public getSiteContent() {
    return this.getSha().pipe(
      mergeMap(repoSha => this.getTree()),
      mergeMap(tree => {
        const configFile = tree.find(x => x.path === environment.configFileRoot);
<<<<<<< HEAD
        return  this.http.get(configFile.url);
      }),
      map(file => JSON.parse(atob(file['content']))),
      catchError(error =>  throwError(error))
    );
  }



  getFile(url: string) {
=======
        const dictionaire = tree.find(x => x.path === environment.dictionaireRoot);
        return forkJoin(
          this.http.get(configFile.url),
          this.http.get(dictionaire.url),
          (config, dic) => {
            const flatTree = tree
              .filter(x => x.path.startsWith(environment.markdownRoot))
              .map(x => new TreeNode(x.path, x.type, x.sha, x.url));
            return {
              configFile: JSON.parse(Base64.decode(config['content'])),
              dictionaire: this.csvToJson(Base64.decode(dic['content'])),
              tree: this.getHierarchizedRawTree(flatTree)
            };
          });
      }));
  }
  public getFile(url: string) {
>>>>>>> develop
    return this.http.get(url).pipe(
      map(file => Base64.decode(file['content']))
    );
  }

<<<<<<< HEAD
  private csvToJson(csv: string ) {
    const lines = csv.split('\n');
    let result = [];
    let headers = lines[0].split(',');
=======
  // HELPERS
  private csvToJson(csv: string) {
    const lines = csv.split('\n');
    let result = [];
    let headers = lines[0].split(environment.csvColumnSeperator);
>>>>>>> develop
    lines.shift();
    lines.pop();

    for (let i = 0; i < lines.length; i++) {
      let obj = new Object();
<<<<<<< HEAD
      const currentline = lines[i].split(',');
=======
      const delimiter = ',';
      const currentline = lines[i].split(delimiter);
>>>>>>> develop
      for (let j = 0; j < headers.length; j++) {
        obj[headers[j]] = currentline[j];
      }
      result.push(obj);
    }
<<<<<<< HEAD
    console.log(result);
    return result;
  }

  // public handleError(error: Response) {
  //   if (error.status === 400) {
  //     return Observable.throw(new BadInput(error.json()));
  //   }
  //   if (error.status === 404) {
  //     return Observable.throw(new NotFoundError());
  //   }
  //   return Observable.throw(new AppError(error));
  // }
=======
    return result;
  }
>>>>>>> develop
}
