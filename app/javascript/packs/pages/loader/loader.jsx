
import React from 'react';
import PropTypes from 'prop-types';

import Pyr, {
  Component
} from '../../pyr/pyr';

import Network, {
} from '../../pyr/network';

import {
  JOBS_URL,
  RECRUITERS_URL,
  POSITIONS_URL,
  HEADS_URL,
  CANDIDATES_URL,
  MESSAGES_URL,
} from '../const';

class LoaderComponent extends Component {
  constructor(props) {
    super(props);

    this.initState({
      loading: false,
      pageItemsCount: {},
    });

    this.onLoading = this.setLoading.bind(this);
    this.onSetItems = this.setItems.bind(this);
    this.onSetPageItemsCount = this.setPageItemsCount.bind(this);
    this.onGetPageItemsCount = this.getPageItemsCount.bind(this);

    this.onSetState = this.setState.bind(this);
    this.onGetState = this.getState.bind(this);


    this.loaderProps = {
      onSetState: this.onSetState,
      onGetState: this.onGetState,
      onLoading: this.onLoading,
      onSetItems: this.onSetItems,
      onSetPageItemsCount: this.onSetPageItemsCount,
      pageItemsCount: this.state.pageItemsCount,
      loading: this.state.loading,
    };
  }

  extraProps() {
    return {};
  }

  getProps() {
    return Object.assign({}, this.loaderProps, this.extraProps());
  }

  getState(name) {
    return this.state[name];
  }

  getPageItemsCount(name) {
    this.state.pageItemsCount[name] || 0;
  }

  setPageItemsCount(name, count) {
    let pageItemsCount = Object.assign({}, this.state.pageItemsCount);

    pageItemsCount[name] = count;
    this.setState({
      pageItemsCount
    });
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

  setItems(name, items) {
    let itemMap = null;

    if (items) {
      //console.log("ITEMS ET TO");
      //console.log(items);
      items = this.sortItems(items);
      itemMap = items.reduce((m, o) => {m[o.id] = o; return m;}, {});
    }

    let stuff = {};
    stuff[name] = items;
    stuff[name + 'Map'] = itemMap;
    stuff['pageItemsCount'] = this.state.pageItemsCount || {};
    stuff.pageItemsCount[name] = items ? items.length : 0;

    //console.log("SET ITEMS STUFF");
    //console.log(stuff);

    this.setState(stuff);
  }


  setLoading(loading=true) {
    //alert("SETLOADIN: " + loading);
    this.setState({loading});
  }

  render() {
    alert("LoaderComponent: OVERRIDE ME!");
  }

}

class LoaderBase {
  constructor(props) {
    this.props = props;
    this.network = new Network.Network();
  }

  name() {
    alert("You need to override name - minification fucks this up.");
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

    //console.log("SET DATA FOR: " + name);
    //console.log(data);
    this.setItems(data[name]);
  }


  load(props={}) {
    if (!props.force && this.items()) {
      //console.log("Items already loaded for " + this.name());
      return null; // already loaded, use reset
    }

    if (this.items()) {
      this.setItems(null);
    }

    let url = Pyr.URL(this.url(props));

    return this.network.getJSON({
      type: this.props.method || Pyr.Method.GET,
      url: url,
      context: this,
      onLoading: props.onLoading,

    }).done((data, textStatus, jqXHR) => {
        //console.log("SETTING ITEMS: " + this.name());
        //console.log(data);
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

    return this.loadItemInner(mid, props).then((data, textStatus, jaXHR) => {
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
    //console.log("RESETTING: " + this.name());
    this.setItems(null);
  }
}

class Jobs extends LoaderBase {
  name() {
    return "jobs";
  }

  url() {
    return JOBS_URL;
  }
}

class Recruiters extends LoaderBase {
  name() {
    return "recruiters";
  }

  url() {
    return RECRUITERS_URL;
  }
}

class Candidates extends LoaderBase {
  name() {
    return "candidates";
  }

  url(props) {
    //return Pyr.URL(JOBS_URL).push(props.jobId).push(CANDIDATES_URL);
    return CANDIDATES_URL;
  }

  unused_setData(data) {
    this.setItems(data.job.candidates);
  }
}


class Positions extends LoaderBase {
  name() {
    return "jobs";
  }

  url() {
    return POSITIONS_URL;
  }

  setData(data) {
    //console.log("POSITIONS LOADER");
    //console.log(this.props);
    this.setItems(data.jobs);
  }

}

class Heads extends LoaderBase {
  name() {
    return "heads";
  }

  url() {
    return HEADS_URL;
  }

}

class Messages extends LoaderBase {
  name() {
    return "messages";
  }

  url() {
    return MESSAGES_URL;
  }
}

const Loader = {
  Component : LoaderComponent,
  Jobs,
  Recruiters,
  Positions,
  Heads,
  Candidates,
  Messages,
};

export default Loader;
