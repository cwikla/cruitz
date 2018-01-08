
import React, {
  Component
} from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';

import Util from './util';
import Network from './network';

import {
  Typeahead,
  AsyncTypeahead
} from 'react-bootstrap-typeahead';

class AutoComplete extends Network.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      results: [],
    };

    this.onSearch = this.search.bind(this);
    this.onLoading = this.loading.bind(this);
  }

  loading(isLoading) {
    console.log("IS LOADING: " + isLoading);
    this.setState({
      isLoading
    });
  }

  search(query) {
    console.log("A: *******");
    console.log(this.props.url);
    let url = Util.PURL(this.props.url).set("q", query);
    console.log(url);
    console.log(url.parser.href);
    console.log(url.toString());
    console.log("B: *******");

    this.getJSON({
      url : url,
      onLoading : this.onLoading,
    }).done((data, textStatus, jqXHR) => {
      console.log(data);
    });
  }

  render() {
    return (
      <AsyncTypeahead
        onSearch={this.onSearch}
        isLoading={this.state.isLoading}
        options={this.state.results}
      />
    );
  }
}

export default AutoComplete;
