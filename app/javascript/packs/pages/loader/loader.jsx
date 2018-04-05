
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
  CANDIDATES_URL,
} from '../const';

class LoaderBase {
  constructor(props) {
    this.props = props;
    this.network = new Network.Network();
  }

  name() {
    return this.constructor.name.toLowerCase(); // override if need be
  }

  singular() {
    return this.name().slice(0,-1); // override me if need be
  }

  items() {
    let name = this.name();
    return this.props.onGetState(name);
  }

  itemsMap() {
    let name = this.name() + 'Map';
    return this.props.onGetState(name);
  }

  url(props) {
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


  load(props={}) {
    if (this.items()) {
      console.log("Items already loaded for " + this.name);
      return null; // already loaded, use reset
    }

    let url = Pyr.URL(this.url(props));

    return this.network.getJSON({
      type: this.props.method || Pyr.Method.GET,
      url: url,
      context: this,
      onLoading: props.onLoading,

    }).done((data, textStatus, jqXHR) => {
        console.log("SETTING ITEMS");
        console.log(data);
        this.setData(data);
    });
  }

  loadItemInner(mid, props={}) {
    let url = Pyr.URL(this.url(props));
    url.push(mid);

    return this.network.getJSON({
      type: Pyr.Method.GET,
      url: url,
      context: this,
      onLoading: props.onLoading,
    });
  }

  loadItem(mid, props={}) {
    let itemName = this.singular();

    return this.loadItemInner(mid, props).done((data, textStatus, jaXHR) => {
      return data[itemName];
    });
  }

  abort() {
    this.network.abortJSON();
  }

  same(a, b) {
    return a.id == b.id;
  }

  add(item) {
    let newItems = (this.items() || []).slice();
    newItems.push(item);
    
    this.setItems(newItems);
  }

  remove(item) {
    let items = this.items() || [];

    let pos = items.findIndex((other) => {
       return this.same(item, other);
    });

    if (pos) {
      let newItems = items.slice(0, pos) + items.slice(pos+1);
      this.setItems(newItems);
    }
  }

  replace(item) {
    let items = this.items() || [];

    let newItems = items.map((other) => {
      if (this.same(item, other)) {
        return item;
      }
      return other;
    });
    this.setItems(newItems);
  }

  reset() {
    this.setItems(null);
  }
}

class Jobs extends LoaderBase {
  url() {
    return JOBS_URL;
  }
}

class Recruiters extends LoaderBase {
  url() {
    return RECRUITERS_URL;
  }
}

class Candidates extends LoaderBase {
  url(props) {
    return Pyr.URL(JOBS_URL).push(props.jobId).push(CANDIDATES_URL);
  }
}


class Positions extends LoaderBase {
  url() {
    return POSITIONS_URL;
  }

  setData(data) {
    console.log("POSITIONS LOADER");
    console.log(this.props);
    this.setItems(data.jobs);
  }

}

class Heads extends LoaderBase {
  url() {
    return HEADS_URL;
  }

}

const Loader = {
  Jobs,
  Recruiters,
  Positions,
  Heads,
  Candidates,
};

export default Loader;
