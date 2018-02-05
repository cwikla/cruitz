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
  POSITIONS_PAGE,

  ME_URL,
} from './const';

import Container from './container';

import PositionsPage from './positions/positions_page';
import MessagesPage from './messages/messages_page';

class HolderPage extends Container {
  render() {
    return (
      <h1>Marketplace goes here</h1>
    );
  }
}

const HOLDER_PAGE = 'Holder';
const DEFAULT_PAGE = POSITIONS_PAGE;

const PAGE_MAP = {
  "home" : PositionsPage,
  [HOLDER_PAGE.toLowerCase()]: HolderPage,
  [POSITIONS_PAGE.toLowerCase()]: PositionsPage,
};

class MarketPlace extends Container {
  componentDidMount() {
    this.setState({
      loading: false
    });
  }

  getDefaultPage() {
    return POSITIONS_PAGE;
  }

  pageToComponent(page) {
    return super.pageToComponent(page) || PAGE_MAP[page];
  }

  unusedrenderSideBar() {
    return (
      <div
        className="col col-2 col-sm-2 col-md-3 flx-col h-100 sidebar"
      >
        <PositionsPage.SearchForm />
      </div>
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
