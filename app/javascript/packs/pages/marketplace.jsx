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

class HolderPage extends Container {
  render() {
    return (
      <h1>Marketplace goes here</h1>
    );
  }
}

const HOLDER_PAGE = 'Holder';
const DEFAULT_PAGE = HOLDER_PAGE;

const PAGE_MAP = {
  [HOLDER_PAGE.toLowerCase()]: HolderPage,
};

class MarketPlace extends Container {
  componentDidMount() {
    this.setState({
      loading: false
    });
  }

  getDefaultPage() {
    return DEFAULT_PAGE;
  }

  pageToComponent(page) {
    return super.pageToComponent() || PAGE_MAP[page];
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
