
import React from 'react';
import PropTypes from 'prop-types';

import Pyr, {
  Component
} from '../pyr/pyr';
const ClassNames = Pyr.ClassNames;

import {
  SHOW_ACTION
} from './const';

class Page extends Component {
  constructor(...args) {
    super(...args);

    //console.log("PAGE PARAMS: ");
    //console.log(props);

    this.initState({
      nextId: null,
      previd: null,
      selected: null,
    });

    this.onLoadItems = this.loadItems.bind(this);
    this.onLoadItem = this.loadItem.bind(this);
    this.onAddItem = this.addItem.bind(this);
    this.onSetSelected = this.setSelected.bind(this);
    this.onSetItems = this.setItems.bind(this);
    this.onReplaceItem = this.replaceItem.bind(this);
  }

/// OVERRIDE THESE IN SUBLCASS

  getIndexSheet() {
    alert("Missing override Page::getIndexSheet");
  }

  getActionSheet(action) {
    alert("Missing override Page::getActionSheet");
  }

///// END

  setSelected(selected) {
    //console.log("SETTING SELECTED TO");
    //console.log(selected);

    this.setState({
      selected
    });
  }


  name() {
    let fullName = this.constructor.name;
    let pos = fullName.search("Page");
    if (pos == -1) {
      alert("page.jsx: You need to define a name cuz you didn't name your subclass *Page");
    }
    let name = fullName.substring(0, pos);
    return name;
  }

  setRoute(item) {
    let fullUrl = Pyr.URL(this.props.url);
    if (item) {
      fullUrl.push(item.id);
    }
    this.context.router.history.push(fullUrl.toString());
  }

  loader() {
    alert("You need to override Page::loader");
  }

  loadItems(onLoading, extra={}) {
    //console.log("LOAD ITEMS FOR " + this.loader().name());
    return this.loader().load(Object.assign({}, {onLoading}, extra));
  }

  loadItem(itemId, onLoading) {
    let me = this;

    return this.loader().loadItem(itemId, {onLoading});
  }

  addItem(item) {
    this.loader().add(item);
  }

  setItems(items) {
    this.loader().setItems(items);
  }

  getItemId() {
    return this.props.itemId;
  }

  getSubItemId() {
    return this.props.subItemId;
  }

  getItems() {
    return this.props[this.loader().name()];
    //return this.loader().items();
  }

  getItemsMap() {
    return this.props[this.loader().name() + "Map"];
    //return this.loader().itemsMap();
  }

  replaceItem(item) {
    this.loader().replace(item);
  }

  indexSheet() {
    alert("page.jsx: IF YOU ARE SEEING THIS, COPY indexSheet() INTO SUBCLASS");

    return (
      <IndexSheet 
        {...this.props} 
        {...this.pageProps()}
        loading={this.state.loading}
      />
    );
  }

  actionSheet(action) {
    alert("page.jsx: IF YOU ARE SEEING THIS, COPY actionSheet() INTO SUBCLASS");

    let sheet = Sheet.sheetComponent(action || this.defaultAction());
    let ActionSheet = eval(sheet);

    let item = null;
    let sid = this.getItemId();

    if (sid) {
      item = items.find((x) => x.id == sid);
    }
  
    return (
      <ActionSheet 
        {...this.props}
        {...this.pageProps()}
        item={item}
        loading={this.state.loading}
      />
    );
   
  }

  showActionSheet() {
    let action = this.getAction();
    if (!action || (action.toLowerCase() == 'index')) {
      return false;
    }

    return true;
  }


  defaultAction() {
    return SHOW_ACTION;
  }

  getAction() {
    return this.props.action;
  }

  renderIndexSheet() {
    let extraClass = ClassNames("flx-col flx-1");

    if (this.showActionSheet()) {
      return this.renderNoSheet(); // extraClass.push("hidden");
    }

    let IndexSheet = this.getIndexSheet();

    //console.log("INNER SHEET for " + this.name());
    //console.log(this.props);
    return (
      <div className={extraClass}>
        <IndexSheet
          {...this.props}
          {...this.pageProps()}
        />
      </div>
    );
  }

  renderNoSheet() {
    return null;
  }

  renderActionSheet() {
    if (!this.showActionSheet()) {
      return this.renderNoSheet();
    }

    let action = this.getAction();
    let ActionSheet = this.getActionSheet(action);

    let extraClass = ClassNames("flx-col flx-1"); // .push(action.toLowerCase());

    return (
      <div className={extraClass}>
        <ActionSheet
          {...this.props}
          {...this.pageProps()}
        />
      </div>
    );
  }

  renderHeader() {
    return null;
  }

  // override to return this.state.selected to autoload

  getSelected() {
    let items = this.getItems();

    if (!items || (items.length == 0)) {
      return null;
    }

    let imap = this.getItemsMap();

    let itemId = this.getItemId();

    if (itemId) {
      return imap[itemId];
    }

    return items[0];
  }

  getNext(item) {
    if (item == null) {
      return null;
    }

    let allItems = this.getItems();

    if (!allItems || (allItems.length == 1)) {
      return null;
    }

    for(let i=0;i<allItems.length-1;i++) {
      if (allItems[i].id == item.id) {
        return allItems[i+1].id;
      }
    }
    return null;
  }

  getPrevious(item) {
    if (item == null) {
      return null;
    }

    let allItems = this.getItems();

    if (!allItems || (allItems.length == 1)) {
      return null;
    }

    for(let i=1;i<allItems.length;i++) {
      if (allItems[i].id == item.id) {
        return allItems[i-1].id;
      }
    }
    return null;
  }

  pageProps() {
    let selected = this.getSelected();

    return({
      itemId: this.getItemId(),
      subItemId: this.getSubItemId(),
      items: this.getItems(),
      itemsMap: this.getItemsMap(),
      selected: selected,
      nextId: this.getNext(selected),
      prevId: this.getPrevious(selected),
      onLoadItems: this.onLoadItems,
      onLoadItem: this.onLoadItem,
      onAddItem: this.onAddItem,
      onSetItems: this.onSetItems,
      onSetSelected: this.onSetSelected,
      onReplaceItem: this.onReplaceItem,
    });
  }

  renderInner() {
    return (
      <div className="page-inner flx-1 flx-col">
        {this.renderHeader()}
        {this.renderIndexSheet()}
        {this.renderActionSheet()}
      </div>
    );
  }


  render() {
    if (this.props.showing == undefined) {
      alert("If you don't send in showing you won't see shit!");
    }
    if (!this.props.showing) {
      return null;
    }

    let id = this.name().toLowerCase() + "-page";

    //console.log("PAGE props");
    //console.log(this.props);

    let cname = ClassNames("d-flex flx-1 page flx-col").push(this.props.page.toLowerCase());

    return (
      <div className={cname}>
        { this.renderInner() }
      </div>
    );
  }

}
Page.key = (item) => {
  return item.id;
}

export default Page;
