
import React from 'react';
import PropTypes from 'prop-types';

import Pyr, {
} from '../../pyr/pyr';

import Network, {
} from '../../pyr/network';

import {
  JOBS_URL,
  RECRUITERS_URL,
  POSITIONS_URL,
  HEADS_URL,
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

  setItems(newItems) {
    let name = this.name();

    this.props.onSetItems(name, newItems);
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

class Positions extends LoaderBase {
  name() {
    return 'positions';
  }

  url() {
    return POSITIONS_URL;
  }

  setData(data) {
    let field = 'jobs';

    console.log("POSITIONS LOADER");
    console.log(this.props);
    this.setItems(data[field]);
  }

}

class Heads extends LoaderBase {
  name() {
    return 'heads';
  }

  url() {
    return HEADS_URL;
  }

}

const Loader = {
  Jobs,
  Recruiters,
  Positions,
  Heads,
};

export default Loader;
