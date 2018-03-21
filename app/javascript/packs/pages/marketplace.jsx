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
const ClassNames = Pyr.ClassNames;


import {
  POSITIONS_PAGE,
  HEADS_PAGE,
  MESSAGES_PAGE,

  POSITIONS_URL,
  HEADS_URL,

  ME_URL,
} from './const';

import Logo from './shared/logo';

import Container from './container';

import PositionsPage from './positions/positions_page';
import MessagesPage from './messages/messages_page';
import HeadsPage from './heads/heads_page';

const DEFAULT_PAGE = HEADS_PAGE; /* POSITIONS_PAGE; */

const HolderPage = (props) => (
  <Redirect to="/" />
);

const PAGE_MAP = {
  "home" : HolderPage,
  [POSITIONS_PAGE.toLowerCase()]: PositionsPage,
  [HEADS_PAGE.toLowerCase()]: HeadsPage,
  [MESSAGES_PAGE.toLowerCase()] : MessagesPage,
};

class NavBar extends Component {
  render() {
    return (
       <Pyr.Grid.Row className="navbar flx-row">
          <Pyr.Grid.Col className="col col-1 navbar-nav">
          </Pyr.Grid.Col>
          <Pyr.Grid.Col className="col col-10 navbar-nav flx-row align-items-center">
              <Logo className="mr-auto"/>

              <div className="flx-row ml-auto align-items-center">
                <div id="alerts" className="alerts nav-item"><Pyr.UI.Icon name="bell-o" className="fa-fw"/></div>
                <Container.NavUserMenu user={this.props.user} />
              </div>
          </Pyr.Grid.Col>
          <Pyr.Grid.Col className="col col-1">
          </Pyr.Grid.Col>
        </Pyr.Grid.Row>
    );
  }
}



class SubNavBar extends Container.NavBar {
  render() {
    console.log("SUB NAV BAR");
    console.log(this.props.page);

    return (
       <Pyr.Grid.Row className="subnavbar flx-row">
          <Pyr.Grid.Col className="col col-1 navbar-nav">
          </Pyr.Grid.Col>
          <Pyr.Grid.Col className="col col-10 navbar-nav flx-row align-items-center">
            <div className="mr-auto flx-row">
              <Container.SubIcon name="Jobs" icon="bullseye" selected={this.props.page} page="positions" count={this.props.buttonItemCount.positions}/>
              <Container.SubIcon name="Messages" icon="envelope-open-o" selected={this.props.page} page="messages" count={this.props.buttonItemCount.messages}/>
              <Container.SubIcon name="Heads" icon="users" selected={this.props.page} page="heads" count={this.props.buttonItemCount.heads}/>
            </div>
          </Pyr.Grid.Col>
          <Pyr.Grid.Col className="col col-1">
          </Pyr.Grid.Col>
        </Pyr.Grid.Row>
    );
  }

}

class MarketPlace extends Container.Base {
  componentDidMount() {
    this.setState({
    });
  }

  getDefaultPage() {
    return DEFAULT_PAGE;
  }

  pageToComponent(page) {
    return super.pageToComponent(page) || PAGE_MAP[page];
  }

  renderSubNavBar() {
    return (
      <SubNavBar user={this.user()} page={this.getPage()} buttonItemCount={this.state.buttonItemCount}/>
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
      <Pyr.UI.RouterProps component={MarketPlace} dashboard={DEFAULT_PAGE}  >
        <Pyr.UI.RouteURL path="/messages/:pid" page="messages" action="index" />
        <Pyr.UI.RouteURL path="/heads/:pid" page="heads" action="index" />
        <Pyr.UI.RouteURL path="/positions/:pid/submit/:subid" page="positions" action="submit" />
      </Pyr.UI.RouterProps>
    </Pyr.UI.NoticeProvider>
  </Pyr.UserProvider>,

  document.getElementById('react-container')
);
