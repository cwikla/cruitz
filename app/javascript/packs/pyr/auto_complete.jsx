
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
      results: []
    };

    this.onSearch = this.search.bind(this);
  }

  search(query) {
    console.log(query);
    return;

    this.getJSON({
    }).done((data, textStateus, jqXHR) => {
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
