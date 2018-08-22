

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
  pathLevels: number;
  nodes: TreeNode[] = [];
  relativeLink = '';
  parentRelativeLink = '';
  tabIndex = 0;


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
  get hasSubFolders() {
    return (this.nodes && this.nodes.filter(x => x.isFolder).length > 0);
  }
  // get isLinkable() {
  //   return this.relativeLink.length > 0;
  // }

  private generateRelativeLinks(node: TreeNode, versionEnabled = false, languageEnabled = false): void {
    let level = 0;
    let rLink = '';
    let prLink = '';
    if (versionEnabled) {
      level++;
    }
    if (languageEnabled) {
      level++;
    }
    node.splitPath.forEach(
      (el, index, array) => {
        if (index > level) {
          if (index === array.length - 1) {
            prLink = rLink;
          }
          rLink = `${rLink}/${el}`;
        }
      }
    );
    node.relativeLink = rLink;
    node.parentRelativeLink = prLink;
  }

  generateRelativeLinksRecursive(versionEnabled = false, languageEnabled = false, contextIndex = 0): void {
    this.generateRelativeLinks(this, versionEnabled, languageEnabled);
    this.tabIndex = contextIndex;
    this.folders.forEach((element) => {
      element.generateRelativeLinksRecursive(versionEnabled, languageEnabled);
    });
    this.files.forEach((element, index) => {
      element.generateRelativeLinksRecursive(versionEnabled, languageEnabled, index);
    });
  }

  getIndexByRawName(name: string): number {
     const i = this.files.findIndex(x => x.rawName.toLocaleLowerCase() === name.toLocaleLowerCase());
     return (i === -1) ? 0 : i;
  }
}
