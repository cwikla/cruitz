import React from 'react';
import PropTypes from 'prop-types';
import {
  render
} from 'react-dom';

import {
  Link,
  Redirect,
  BrowserRouter as Router,
} from 'react-router-dom';

import Pyr from '../pyr/pyr';

import Component from './component';

import {
  ME_URL,
} from './const';

class MarketPlace extends Component {
  render() {
    return (
      <h3>This is the marketplace</h3>
    );
  }
}


render (
  <Pyr.UserProvider url={Pyr.URL(ME_URL)}>
    <Pyr.UI.NoticeProvider>
      <Pyr.RouterProps component={MarketPlace} />
    </Pyr.UI.NoticeProvider>
  </Pyr.UserProvider>,

  document.getElementById('react-container')
);
