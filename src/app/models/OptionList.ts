import { OptionItem } from './OptionItem';


export class OptionList {
  items: OptionItem[] = [];
  selected: string;
  get show() {
    return this.items.length > 0;
  }
  get selectedName() {
    return this.items.find(x => x.value === this.selected).text;
  }
}
