export class Path {
  constructor(
   public path: string,
   public type: string,
   public sha: string,
   public apiUrl: string) {
    this.isFile = (type === 'blob');
    this.isFolder = (type === 'tree');
    this.splitPath = path.split('/');
    this.pathLevels = this.splitPath.length;
  }
  splitPath: string[];
  pathLevels: number;
  isFile: boolean;
  isFolder: boolean;
  paths?: Path[];

 }
