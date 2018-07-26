import { OptionItem } from './OptionItem';


export class OptionList {
  items: OptionItem[] = [];
  selected: string;
  get show() {
    return this.items.length > 0;
  }
}
