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
   nodes?: TreeNode[];


   get isFile(): boolean {
    return (this.type === 'blob');
   }
   get isFolder(): boolean {
    return (this.type === 'tree');
   }
   get folders() {
     return this.isFolder ? this.nodes.filter(x => x.isFolder) : null;
   }
   get files() {
    return this.isFolder ? this.nodes.filter(x => x.isFile) : null;
   }

}
