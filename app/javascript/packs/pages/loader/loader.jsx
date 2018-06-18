
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

    this.onAdd = this.add.bind(this);
    this.onRemove = this.remove.bind(this);
    this.onReplace = this.replace.bind(this);
    this.onReload = this.reload.bind(this);
  }

  name() {
    return this.props.loader.name();
  }

  singular() {
    return this.props.loader.singular();
  }

  componentDidMount() {
    if (this.props.autoLoad) {
      this.props.loader.load();
    }
  }

  add(data) {
    console.log("ADD");
    console.log(data);

    this.props.loader.add(data[this.singular()]);
  }

  remove(data) {
    this.props.loader.remove(data[this.singular()]);
  }

  replace(data) {
    console.log("REPLACE");
    console.log(data);

    this.props.loader.replace(data[this.singular()]);
  }

  reload(data) {
    console.log("RELOAD CALLED!");
    this.props.loader.load({force: true});
  }

  render() {
    let name = this.name();
    return (
      <Pyr.PassThru>
        <Pyr.Pusher event={name + "-add"} onEvent={this.onAdd}/>
        <Pyr.Pusher event={name + "-remove"} onEvent={this.onRemove}/>
        <Pyr.Pusher event={name + "-replace"} onEvent={this.onReplace}/>
        <Pyr.Pusher event={name + "-reload"} onEvent={this.onReload}/>
      </Pyr.PassThru>
    );
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

    console.log("SETTING ITEMS: " + name);
    console.log(newItems.length);

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

  exists(item) {
    return (this.itemsMap()[item.id] != null);
  }

  add(item) {
    if (this.exists(item)) {
      console.log("ROUTING TO REPLACE");
      return this.replace(item);
    }

    let newItems = (this.items() || []).slice();
    newItems.push(item);
    
    this.setItems(newItems);
  }

  remove(item) {
    if (!this.exists(item)) {
      return;
    }

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
    if (!this.exists(item)) {
      console.log("ROUTING TO ADD");
      return this.add(item);
    }

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

class SubmittedCandidates extends LoaderBase {
  name() {
    return "candidates";
  }

  url(props) {
    //return Pyr.URL(JOBS_URL).push(props.jobId).push(CANDIDATES_URL);
    return Pyr.URL(CANDIDATES_URL).push('submitted');
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
