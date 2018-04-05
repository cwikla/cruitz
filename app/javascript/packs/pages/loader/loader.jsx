
import React from 'react';
import PropTypes from 'prop-types';

import Pyr, {
} from '../../pyr/pyr';

import Network, {
} from '../../pyr/network';

import {
  JOBS_URL,
  RECRUITERS_URL,
} from '../const';

class LoaderBase {
  constructor(props) {
    this.props = props;
    this.network = new Network.Network();
  }

  name() {
    alert("Loader::name needs to be implemented");
  }

  items() {
    let name = this.name();
    return this.props.onGetState(name);
  }

  url() {
    alert("Loader::url needs to be implemented");
  }

  sortItems(items) {
    //console.log("SORTING ITEMS");
    if (!items || (items.length == 0)) {
      return items;
    }
    if (items[0].id) {
      return items.sort((x, y) => y.id - x.id);
    }
    if (items[0].created_at) {
      return items.sort((x, y) => new Date(y.created_at).getTime() - new Date(x.created_at).getTime());
    }
    return items;
  }

  setItems(newItems) {
    let name = this.name();
    let stuff = {};
    let itemMap = null;

    if (newItems) {
      newItems = this.sortItems(newItems);
      itemMap = newItems.reduce((m, o) => {m[o.id] = o; return m;}, {});
    }


    stuff[name] = newItems;
    stuff[name + 'Map'] = itemMap;

    console.log("STUFFF");
    console.log(stuff);
    this.props.onSetState(stuff);
  }

  setData(data) {
    let name = this.name();

    this.setItems(data[name]);
  }

  loadItems(onLoading) {
    let url = Pyr.URL(this.url());

    return this.network.getJSON({
      type: this.props.method || Pyr.Method.GET,
      url: url,
      context: this,
      onLoading: onLoading,

    }).done((data, textStatus, jqXHR) => {
        console.log("SETTING ITEMS");
        console.log(data);
        this.setData(data);
    });
  }

  loadItem(mid, onLoading) {
    let url = Pyr.URL(this.url());
    url.push(mid);

    return this.network.getJSON({
      type: Pyr.Method.GET,
      url: url,
      context: this,
      onLoading: onLoading,
    });
  }

  abort() {
    this.network.abortJSON();
  }

  same(a, b) {
    return a.id == b.id;
  }

  addItem(item) {
    let newItems = (this.items() || []).slice();
    newItems.push(item);
    
    this.setItems(newItems);
  }

  removeItem(item) {
    let items = this.items() || [];

    let pos = items.findIndex((other) => {
       return this.same(item, other);
    });

    if (pos) {
      let newItems = items.slice(0, pos) + items.slice(pos+1);
      this.setItems(newItems);
    }
  }

  replaceItem(item) {
    let items = this.items() || [];

    let newItems = items.map((other) => {
      if (this.same(item, other)) {
        return item;
      }
      return other;
    });
    this.setItems(newItems);
  }

  resetItems() {
    this.setItems(null);
  }
}

class Jobs extends LoaderBase {
  name() {
    return 'jobs';
  }

  url() {
    return JOBS_URL;
  }
}

class Recruiters extends LoaderBase {
  name() {
    return 'recruiters';
  }

  url() {
    return RECRUITERS_URL;
  }
}

const Loader = {
  Jobs,
  Recruiters
};

export default Loader;
