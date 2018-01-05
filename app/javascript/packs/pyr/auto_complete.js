
import React, {
  Component
} from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';

import Util from './util';

import { 
  Typeahead,
  Bloodhound 
} from 'typeahead.js';

const SEARCH_URL ='/geo/search/%QUERY%.json';

class AutoComplete extends Component {
  constructor(props) {
    super(props);

    this.state = {
      results: []
    };

    this.bloodhound = nil;
  }

  componentWillMount() {
    this.bloodhound = new Bloodhound({
      datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
      queryTokenizer: Bloodhound.tokenizers.whitespace,

      // prefetch: '../data/films/post_1960.json',

      remote: {
        url: SEARCH_URL,
        wildcard: '%QUERY%'
      }
    });
  }

  componentWillUnmount() {
    this.bloodhound.clear();
    this.bloodhound = nil;
  }

  render() {
    return (
      <div>Hello</div>
    );
  }
}

export default AutoComplete;
