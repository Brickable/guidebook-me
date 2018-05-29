import { environment } from './../../environments/environment';
import { UUID } from 'angular2-uuid';
export class DocumentationNode {
  constructor(
    public name: string,
    public resoursePath: string,
    public id?: string,
    public documents?: string[],
    public nodes?: DocumentationNode[]
  ) {
    if (!id) {
      this.id = UUID.UUID();
    }
    this.resoursePath = (resoursePath) ? resoursePath : `${resoursePath}/${name}`;
    this.nodes = this.methodifyDocumentationNode(nodes, this.resoursePath);
    // this.resoursePath = (resoursePath) ? `${resoursePath}/${name}` : name;
  }
  path(index= 0): string {
    return `${environment.documentationRoot}${this.resoursePath}/${this.documents[index]}`;
  }

  methodifyDocumentationNode(rawTree: DocumentationNode[], previousRoute: string): DocumentationNode[] {
    let arr: DocumentationNode[] = [];
    if (rawTree) {
      arr = rawTree.map(x => {
        const route = `${previousRoute}/${x.name}`;
        return new DocumentationNode(x.name, route, x.id, x.documents, x.nodes);
      });
      return arr;
    }
  }
}
