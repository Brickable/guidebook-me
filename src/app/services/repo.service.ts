
import { Injectable } from '@angular/core';
import { HttpClient } from '../../../node_modules/@angular/common/http';

import { Observable, of, throwError } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators/';

import { environment } from '../../environments/environment';
import { TreeNode } from '../models/TreeNode';

@Injectable({
  providedIn: 'root'
})
export class RepoService {
  constructor(private http: HttpClient) {}

  private getSha(): Observable<string> {
    const serviceUrl = `${environment.repoUrl}/commits/${environment.branch}`;
    return this.http.get(serviceUrl).pipe(map(x => x.sha));
  }

  private getTree() {
    return this.getSha().pipe(
      mergeMap(repoSha =>  this.http.get(`${environment.repoUrl}/git/trees/${repoSha}?recursive=1`)),
      map(repo => repo.tree),
      catchError(error =>  throwError(error))
    );
  }

  private getHierarchizedRawTree(flatTree: TreeNode[]) {
    let folders = flatTree.filter(x => x.isFolder);
    folders.forEach(folder => {
      const subTree = flatTree.filter(x => (x.pathLevels === folder.pathLevels + 1) && x.path.includes(folder.path));
      folder.nodes = subTree;
    });
    return folders.find(x => x.pathLevels === 1);
  }


//  PUBLIC SERVICES
  getDocumentationTree() {
    return this.getTree().pipe(
      map(rawFlatTree => {
        const flatTree = rawFlatTree.filter(x => x.path.startsWith(environment.markdownRoot))
          .map(x => {
            return new TreeNode(x.path, x.type, x.sha, x.url);
          });
        return this.getHierarchizedRawTree(flatTree);
      }),
      catchError(error => throwError(error))
    );
  }

  getConfigs() {
    return this.getSha().pipe(
      mergeMap(repoSha => this.getTree()),
      mergeMap(tree => {
        const configFile = tree.find(x => x.path === 'config.json');
        return  this.http.get(configFile.url);
      }),
      map(file => JSON.parse(atob(file.content))),
      catchError(error =>  throwError(error))
    );
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
}
