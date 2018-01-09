
import React, {
  Component
} from 'react';

import PropTypes from 'prop-types';

import Pyr from '../pyr/pyr';
const ClassNames = Pyr.ClassNames;

import {
  SHOW_ACTION
} from './const';

class Page extends Pyr.UserReceiver {
  mergeState(inState) {
    this.state = Object.assign({}, this.state, inState);
  }

  constructor(...args) {
    super(...args);

    //console.log("PAGE PARAMS: ");
    //console.log(props);

    this.state = {
      items: null,
      selected: null,
      fullDetail: false,
    };

    let jobs = this.props.jobs || [];
    this.jobMap = jobs.reduce((m, o) => {m[o.id] = o; return m;}, {});

    this.onSelect = this.setSelected.bind(this);
    this.onUnselect = this.setSelected.bind(this, null);

    this.onSetItems = this.setItems.bind(this);

    this.onLoadItems = this.loadItems.bind(this);
    this.onAddItem = this.addItem.bind(this);

    this.onLoadSelected = this.loadSelected.bind(this);

  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.itemId != this.props.itemId) {
      console.log("PAGE GOT NEW ID: " + nextProps.itemId);
      this.setState({
        selected: null
      });
    }
  }

  name() {
    let fullName = this.constructor.name;
    let pos = fullName.search("Page");
    if (pos == -1) {
      alert("page.jsx: You need to define a name cuz you didn't name your subclass *Page");
      alert(fullName);
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
    return items.sort((x, y) => new Date(y.created_at).getTime() - new Date(x.created_at).getTime());
  }


  setItems(items) {
   // console.log("ITEMS NO LONGER NULL");
    if (items) {
      items = this.sortItems(items);
    }

    this.setState({ 
      items
    });
  }

  loadItems() {
    alert("Page:loadItems needs to be implemented");
  }

  loadSelected(hid) {
    alert("Page:loadSelected needs to be implemented");
  }

////// COPY ME INTO SUBCLASS //////

  indexSheet() {
    alert("page.jsx: IF YOU ARE SEEING THIS, COPY indexSheet() INTO SUBCLASS");

    return (
      <IndexSheet 
        {...this.props} 
        onSelect={this.onSelect}
        onUnselect={this.onUnselect}
        onLoadSelected ={this.onLoadSelected}
        loading={this.state.loading}
      />
    );
  }

  actionSheet(action) {
    alert("page.jsx: IF YOU ARE SEEING THIS, COPY actionSheet() INTO SUBCLASS");

    let sheet = Sheet.sheetComponent(action || SHOW_ACTION);
    let ActionSheet = eval(sheet);

    let item = null;
    let sid = this.getItemId();

    if (sid) {
      item = items.find((x) => x.id == sid);
    }
  
    return (
      <ActionSheet 
        {...this.props}
        item={item}
        onSelect={this.onSelect} 
        onAddItem={this.onAddItem}
        onLoadSelected={this.onLoadSelected}

        loading={this.state.loading}
      />
    );
   
  }

  showActionSheet() {
    return !!this.props.action;
  }

///// END ////

  setSelected(selected) {
    console.log("SELECTED " + JSON.stringify(selected));

    this.setState({
      selected
    });
    //this.props.onSetAction(SHOW_ACTION);
  }

  getItemId() {
    return this.props.itemId;
  }

  getItems() {
    return this.state.items;
  }

  getSelected() {
    if (this.state.selected) {
      return this.state.selected;
    }

    let sid = this.getItemId();
    return this.getItem(sid);
  }

  getItem(sid) {
    let items = this.getItems();
    if (sid && items) {
      return items.find((x) => x.id == sid);
    }
    return null;
  }

  defaultAction() {
    return SHOW_ACTION;
  }

  getAction() {
    return this.props.action;
  }

  renderIndexSheet() {
    let extraClass = ClassNames("index flx-col flx-1");

    if (this.showActionSheet()) {
      return this.renderNoSheet(); // extraClass.push("hidden");
    }

    return (
      <div className={extraClass}>
        {this.indexSheet()}
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

    let extraClass = ClassNames("action flx-col flx-1").push(action.toLowerCase());

    return (
      <div className={extraClass}>
        {this.actionSheet(action)}
      </div>
    );
  }

  renderHeader() {
    return null;
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
        {this.renderHeader()}
        {this.renderIndexSheet()}
        {this.renderActionSheet()}
      </div>
    );
  }

}
Page.key = (item) => {
  return item.id;
}

export default Page;
