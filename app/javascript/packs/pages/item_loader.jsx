
import React from 'react';
import PropTypes from 'prop-types';

import Pyr, {
  Component
} from '../pyr/pyr';
const ClassNames = Pyr.ClassNames;

class ItemLoader extends Component {
  constructor(...args) {
    super(...args);

    this.initState({
      items: null,
      selected: null,
    });

    this.onSelect = this.setSelected.bind(this);
    this.onUnselect = this.setSelected.bind(this, null);

    this.onSetItems = this.setItems.bind(this);
    this.onNoItems = this.setItems.bind(this, null);

    this.onLoadItems = this.loadItems.bind(this);
    this.onAddItem = this.addItem.bind(this);

    this.onLoadSelected = this.loadSelected.bind(this);

  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.itemId != this.props.itemId) {
      //console.log("PAGE GOT NEW ID: " + nextProps.itemId);
      this.setState({
        selected: null
      });
    }
  }

  addItemCompare(a, b) {
    return a.id == b.id;
  }

  addItem(item) {
    //console.log("ITEM: " + item);
    //console.log(this.state.items);

    if (!item) {
      return;
    }

    let items = this.state.items || [];
    let found = false;

    let copy = items.map((val, pos) => {
      if (this.addItemCompare(val, item)) {
        found = true;
        return item;
      }
      return val;
    });

    //console.log(copy);
    //console.log("ITEM FOUND: " + found);

    if (!found) {
      copy.push(item);
    }
    this.setItems(copy);
  }

  sortItems(items) {
    //console.log("SORTING ITEMS");
    return items.sort((x, y) => new Date(y.created_at).getTime() - new Date(x.created_at).getTime());
  }


  setItems(items) {
    //console.log("SET ITEMS");
    //console.log(items);
    if (items) {
      items = this.sortItems(items);
    }

    this.setState({ 
      items
    });
  }

  loadItems(onLoading) {
    alert("Page:loadItems needs to be implemented");
  }

  loadSelected(hid) {
    alert("Page:loadSelected needs to be implemented");
  }

///// END ////

  setSelected(selected) {
    //console.log("SELECTED " + JSON.stringify(selected));

    this.setState({
      selected
    });
  }

  getItemId() {
    return this.props.itemId;
  }

  getItems() {
    return this.state.items;
  }

  getSelected() {
    return this.state.selected;
  }

  getSubItemId() {
    return this.props.subItemId;
  }

}

ItemLoader.key = (item) => {
  return item.id;
}

export default ItemLoader;
