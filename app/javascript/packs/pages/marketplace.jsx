import React from 'react';
import PropTypes from 'prop-types';
import {
  render
} from 'react-dom';

import {
  Route,
  Link,
  Redirect,
  BrowserRouter as Router,
} from 'react-router-dom';

import Pyr, {
  Component 
} from '../pyr/pyr';


import {
  POSITIONS_PAGE,
  HEADS_PAGE,

  POSITIONS_URL,
  HEADS_URL,

  ME_URL,
} from './const';

import Container from './container';

import PositionsPage from './positions/positions_page';
import MessagesPage from './messages/messages_page';
import HeadsPage from './heads/heads_page';

const DEFAULT_PAGE = POSITIONS_PAGE;

const HolderPage = (props) => (
  <Redirect to="/" />
);

const PAGE_MAP = {
  "home" : HolderPage,
  [POSITIONS_PAGE.toLowerCase()]: PositionsPage,
  [HEADS_PAGE.toLowerCase()]: HeadsPage,
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

class Hello extends Component {
  render() {
    return (
      <div>HELLLO</div>
    );
  }
}


render (
  <Pyr.UserProvider url={Pyr.URL(ME_URL)}>
    <Pyr.UI.NoticeProvider>
      <Pyr.UI.RouterProps component={MarketPlace} dashboard={POSITIONS_PAGE}  >
        <Pyr.UI.RouteURL path="/positions/:pid/submit/:subid" page="positions" action="submit" />
      </Pyr.UI.RouterProps>
    </Pyr.UI.NoticeProvider>
  </Pyr.UserProvider>,

  document.getElementById('react-container')
);
