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
  CANDIDATES_PAGE,

  POSITIONS_URL,
  HEADS_URL,

  ME_URL,
} from './const';

import Logo from './shared/logo';

import Container from './container';
import Loader from './loader/loader';

import PositionsPage from './positions/positions_page';
import SubmittedCandidatesPage from './submitted_candidates/submitted_candidates_page';
import MessagesPage from './messages/messages_page';
import HeadsPage from './heads/heads_page';

const DEFAULT_PAGE = MESSAGES_PAGE;

const HolderPage = (props) => (
  <Redirect to="/" />
);

const PAGE_MAP = {
  "home" : HolderPage,
  [POSITIONS_PAGE.toLowerCase()]: PositionsPage,
  [CANDIDATES_PAGE.toLowerCase()]: SubmittedCandidatesPage,
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
                <div id="alerts" className="alerts nav-item"><Pyr.UI.Icon name="bell" className="fa-fw"/></div>
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
    //console.log("SUB NAV BAR");
    //console.log(this.props.page);
   
    let positionsCount = this.props.pageItemsCount.positions;
    let messagesCount = this.props.pageItemsCount.messages;
    let headsCount = this.props.pageItemsCount.heads;

    return (
       <Pyr.Grid.Row className="subnavbar flx-row">
          <Pyr.Grid.Col className="col col-1 navbar-nav">
          </Pyr.Grid.Col>
          <Pyr.Grid.Col className="col col-10 navbar-nav flx-row align-items-center">
            <div className="mr-auto flx-row">
              <Container.SubIcon name="Messages" icon="envelope" selected={this.props.page} page="messages" count={messagesCount}/>
              <Container.SubIcon name="Jobs" icon="bullseye" selected={this.props.page} page="positions" count={positionsCount}/>
              <Container.SubIcon name="Candidates" icon="users" selected={this.props.page} page="candidates" count={this.props.pageItemsCount.candidates}/>
              <Container.SubIcon name="Talent" icon="users" selected={this.props.page} page="talent" count={headsCount}/>
            </div>
          </Pyr.Grid.Col>
          <Pyr.Grid.Col className="col col-1">
          </Pyr.Grid.Col>
        </Pyr.Grid.Row>
    );
  }

}

class MarketPlace extends Container.Base {
  getDefaultPage() {
    return DEFAULT_PAGE;
  }

  pageToComponent(page) {
    return super.pageToComponent(page) || PAGE_MAP[page];
  }

  renderSubNavBar() {
    return (
      <SubNavBar user={this.user()} page={this.getPage()} pageItemsCount={this.props.pageItemsCount}/>
    );

  }

}

class CacheComponent extends Container.Cache {
  constructor(props) {
    super(props);

    this.initState({
      jobs: null,
      jobsMap: null,

      heads: null,
      headsMap: null,

      messages: null,
      messagesMap: null,

      candidates: null,
      candidatesMap: null,
    });

    this.mounted = false;

    this.positionsLoader = new Loader.Positions(this.loaderProps);
    this.headsLoader = new Loader.Heads(this.loaderProps);
    this.messagesLoader = new Loader.Messages(this.loaderProps);
    this.candidatesLoader = new Loader.Candidates(this.loaderProps);
  }

  extraProps() {
    return Object.assign({}, {
      loaders: {
        positions: this.positionsLoader,
        heads: this.headsLoader,
        messages: this.messagesLoader,
        candidates: this.candidatesLoader,
      },

      // need to see if I can make this a dict...
      jobs: this.state.jobs,
      jobsMap: this.state.jobsMap,

      positions: this.state.jobs,
      positionsMap: this.state.jobsMap,
      

      heads: this.state.heads,
      headsMap: this.state.headsMap,

      messages: this.state.messages,
      messagesMap: this.state.messagesMap,

      candidates: this.state.candidates,
      candidatesMap: this.state.candidatesMap,

    });
  }

  componentDidMount() {
    if (!this.state.jobs) {
      this.positionsLoader.load();
    }
    this.mounted =true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  render() {
    if (!this.state.jobs) {
      return (
        <Pyr.UI.Loading />
      );
    }
      // wait for jobs to load

    let props = this.getProps();

        //<Pyr.UI.RouteURL path="/messages/:pid" page="messages" action="index" />
        //<Pyr.UI.RouteURL path="/heads/new" page="heads" action="new" />
        //<Pyr.UI.RouteURL path="/heads/:pid" page="heads" action="index" />
    return (
      <Pyr.PassThru>
        <Pyr.UI.RouterProps component={MarketPlace} dashboard={DEFAULT_PAGE} {...props} >
          <Pyr.UI.RouteURL path="/positions/:pid/select" page="positions" action="select" />
          <Pyr.UI.RouteURL path="/positions/:pid/submit/:subid" page="positions" action="submit" />
          <Pyr.UI.RouteURL path="/candidates/:pid/:subid" page="candidates" action="index" />
        </Pyr.UI.RouterProps>
        <Loader.Component loader={this.messagesLoader} />
        <Loader.Component loader={this.candidatesLoader} />
      </Pyr.PassThru>
    );
  }
}


render (
  <Pyr.UserProvider url={Pyr.URL(ME_URL)}>
    <Pyr.UI.NoticeProvider>
      <CacheComponent />
    </Pyr.UI.NoticeProvider>
  </Pyr.UserProvider>,

  document.getElementById('react-container')
);
