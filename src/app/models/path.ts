export class Path {
  constructor(
   public path: string,
   public type: string,
   public sha: string,
   public apiUrl: string) {
    this.isBlob = (type === 'blob');
    this.isTree = (type === 'tree');
    this.splitPath = path.split('/');
    this.pathLevels = this.splitPath.length;
  }
  splitPath: string[];
  pathLevels: Number;
  isBlob: boolean;
  isTree: boolean;
  paths?: Path[];

 }
