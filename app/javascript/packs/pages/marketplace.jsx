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

import Pyr, {
  Component 
} from '../pyr/pyr';


import {
  ME_URL,
} from './const';

import Container from './container';

class MarketPlace extends Container {
  componentDidMount() {
    this.setState({
      loading: false
    });
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
