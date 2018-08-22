import { TreeNode } from './../../models/TreeNode';
import { Component, Input, Output, EventEmitter  } from '@angular/core';
import { Router } from '../../../../node_modules/@angular/router';


@Component({
  selector: 'folder-tree',
  templateUrl: './folder-tree.component.html',
  styleUrls: ['./folder-tree.component.css']
})
export class FolderTreeComponent {
  constructor(private router: Router) {}
  @Input() items: TreeNode[] = [];
  @Input() treeLevel: number;
  @Input() baseRoot = '';
  @Input() queryParams: object;
  @Output() linkClick: EventEmitter<string> = new EventEmitter();

  public checkIfItemShouldBeOpen(iPath): boolean {
    const ar = this.router.url.substring(1).split('/');
    ar.pop();
    let path = this.baseRoot;
    ar.forEach((x, i) => {
      if (i >= this.treeLevel) {
        path += `/${x}`;
      }
    });
    return (path.includes(iPath));
  }
  public getFileIcon(relativePath: string): string {
    return (this.router.url.includes(relativePath)) ? 'visibility' : 'file_copy';
  }

  get folders(): TreeNode[] {
    return this.items.filter(x => x.nodes.length);
  }
  get links(): TreeNode[] {
    return this.items.filter(x => !x.nodes.length);
  }
  get getQueryParams(): object {
    return this.queryParams;
  }


}
