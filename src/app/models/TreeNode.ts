

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
  relativeLink = '';


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
  get isLinkable() {
    return this.relativeLink.length > 0;
  }

  private generateRelativeLinks(node: TreeNode, versionEnabled = false, languageEnabled = false) {
    if (!node.hasSubFolders || node.isFile) {
      let level = 1;
      let rLink = '';
      if (versionEnabled) {
        level++;
      }
      if (languageEnabled) {
        level++;
      }
      node.splitPath.forEach(
        (el, index, array) => {
          if (node.isFile && index === array.length - 1) {
            rLink = `${rLink}/`;
          }
          else if (index >= level) {
            rLink = `${rLink}/${el}`;
          }
        }
      );
      node.relativeLink = rLink;

    }
  }

  generateRelativeLinksRecursive(versionEnabled = false, languageEnabled = false) {
    this.generateRelativeLinks(this, versionEnabled, languageEnabled);
    this.nodes.forEach((element, index) => {
      element.generateRelativeLinksRecursive(versionEnabled, languageEnabled);
    });
  }



}
