import { Injectable } from '@angular/core';
import { HttpClient } from '../../../node_modules/@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators/';
import 'rxjs/add/observable/throw';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RepoService {
  constructor(private http: HttpClient) {}

  private getDocRepoSha(): Observable<string> {
    const serviceUrl = `${environment.repoUrl}/commits/${environment.branch}`;
    return this.http.get<string>(serviceUrl);
  }

  async getRepoTree() {
    const repoSha = await this.getDocRepoSha();
    const serviceUrl = `${environment.repoUrl}/git/trees/${repoSha}?recursive=1`;
    return this.http.get(serviceUrl).pipe(
      map(response => {
        console.log(response);
      })
    );
  }

  async getConfigs() {
    const tree = []; // await this.getRepoTree().tree;
    const configFile = tree.find(x => x.path === 'config.json');
    const encoded = await this.http.get(configFile.url);
    const configObj = JSON.parse(atob(encoded.content));
    return;
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
