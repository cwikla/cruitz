
import React from 'react';
import PropTypes from 'prop-types';

import Pyr, {
  Component
} from '../pyr/pyr';
const ClassNames = Pyr.ClassNames;

import ItemLoader from './item_loader';

import {
  SHOW_ACTION
} from './const';

class Page extends ItemLoader {
  constructor(...args) {
    super(...args);

    //console.log("PAGE PARAMS: ");
    //console.log(props);

    this.initState({
      fullDetail: false,
    });

    let jobs = this.props.jobs || [];
    this.jobMap = jobs.reduce((m, o) => {m[o.id] = o; return m;}, {});
  }

  name() {
    let fullName = this.constructor.name;
    let pos = fullName.search("Page");
    if (pos == -1) {
      alert("page.jsx: You need to define a name cuz you didn't name your subclass *Page");
      alert(this.constructor.name);
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
    let action = this.getAction();
    if (!action || (action.toLowerCase() == 'index')) {
      return false;
    }

    return true;
  }

///// END ////

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
