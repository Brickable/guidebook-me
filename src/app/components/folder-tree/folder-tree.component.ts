import { TreeNode } from './../../models/TreeNode';
import { Component, Input } from '@angular/core';
import { Router } from '../../../../node_modules/@angular/router';


@Component({
  selector: 'folder-tree',
  templateUrl: './folder-tree.component.html',
  styleUrls: ['./folder-tree.component.css']
})
export class FolderTreeComponent {
  constructor(private router: Router) {}
  @Input() items: TreeNode[] = [];
  @Input() treeLevel: Number;
  @Input() baseRoot = '';

  checkIfItemShouldBeOpen(iPath) {
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

  get folders() {
    return this.items.filter(x => x.nodes.length);
  }
  get links() {
    return this.items.filter(x => !x.nodes.length);
  }



  navigate($event, item: TreeNode) {
    $event.stopPropagation();
    this.router.navigate([item.relativeLink + '/0']);
  }
}
