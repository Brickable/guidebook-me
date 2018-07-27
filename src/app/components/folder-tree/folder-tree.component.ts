import { TreeNode } from './../../models/TreeNode';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'folder-tree',
  templateUrl: './folder-tree.component.html',
  styleUrls: ['./folder-tree.component.css']
})
export class FolderTreeComponent {
  @Input() items: TreeNode[] = [];
  isSidePanelOpen = false;

  get folders() {
    return this.items.filter(x => x.nodes.length);
  }
  get links() {
    return this.items.filter(x => !x.nodes.length);
  }

}
