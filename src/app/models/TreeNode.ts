
export class TreeNode {
  constructor(
    public path: string,
    public type: string,
    public sha: string,
    public apiUrl: string) {
     this.splitPath = (path.indexOf('/') !== -1) ? path.split('/') : [path];
     this.pathLevels = this.splitPath.length;
     this.rawName = this.splitPath[this.splitPath.length - 1];
     this.name = this.isFolder ? this.rawName.replace('_', ' ') : this.rawName.replace('_', ' ').replace('.md', '');
   }
   rawName: string;
   name: string;
   splitPath: string[];
   pathLevels: Number;
   nodes: TreeNode[] = [];
   relativeLink: string;
   relativeBackLink: string;


   get isFile(): boolean {
    return (this.type === 'blob');
   }
   get isFolder(): boolean {
    return (this.type === 'tree');
   }
   get folders() {
     return this.isFolder ? this.nodes.filter(x => x.isFolder) : [];
   }
   get files() {
    return this.isFolder ? this.nodes.filter(x => x.isFile) : [];
   }

  generateRelativeLinks(versionEnabled = false, languageEnabled = false) {
    let level = 1;
    let rLink = '';
    if (versionEnabled) {
     level++;
    }
    if (languageEnabled) {
      level++;
    }

    this.splitPath.forEach(
      (el, index) => {
        if (index >= level) {
          rLink = rLink + '/' + el;
        }
      }
    );
    this.relativeLink = rLink;
    this.relativeBackLink = rLink.substring(0, rLink.lastIndexOf('/'));
  }
}
