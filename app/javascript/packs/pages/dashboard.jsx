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
const ClassNames = Pyr.ClassNames;

import Container from './container';

import Loader from './loader/loader';

import MainPage from './main/main_page';
import JobsPage from './jobs/jobs_page';
import CandidatesPage from './candidates/candidates_page';
import MessagesPage from './messages/messages_page';
import RecruitersPage from './recruiters/recruiters_page';
import RegistrationsPage from './registration/registrations_page';

const DashboardPage = (props) => (
  <Redirect to="/" />
);

import {
  MAIN_PAGE,
  JOBS_PAGE,
  CANDIDATES_PAGE,
  RECRUITERS_PAGE,
  MESSAGES_PAGE,
  SEARCH_PAGE,

  ME_URL,
} from './const';

const DEFAULT_PAGE = MESSAGES_PAGE; // CANDIDATES_PAGE; // MESSAGES_PAGE; //JOBS_PAGE;

const PAGE_MAP = {
  "home" : DashboardPage,
  [MAIN_PAGE.toLowerCase()]: MainPage,
  [JOBS_PAGE.toLowerCase()]: JobsPage,
  [CANDIDATES_PAGE.toLowerCase()]: CandidatesPage,
  [RECRUITERS_PAGE.toLowerCase()]: RecruitersPage,
  [MESSAGES_PAGE.toLowerCase()]: MessagesPage,
};


function PageURL(page) {
  return Pyr.URL("/" + page.toLowerCase());
}

class SubNavBar extends Container.NavBar {
  render() {
    return (
       <Pyr.Grid.Row className="subnavbar flx-row">
          <Pyr.Grid.Col className="col col-1 navbar-nav">
          </Pyr.Grid.Col>
          <Pyr.Grid.Col className="col col-10 navbar-nav flx-row align-items-center">
            <div className="mr-auto flx-row">
              <Container.SubIcon name="Messages" icon="envelope" selected={this.props.page} page="messages" count={this.props.pageItemsCount.messages}/>
              <Container.SubIcon name="Candidates" icon="users" selected={this.props.page} page="candidates" count={this.props.pageItemsCount.candidates}/>
              <Container.SubIcon name="Jobs" icon="bullseye" selected={this.props.page} page="jobs" count={this.props.pageItemsCount.jobs}/>
              <Container.SubIcon name="Recruiters" icon="cubes" selected={this.props.page} page="recruiters" count={this.props.pageItemsCount.recruiters}/>
            </div>
          </Pyr.Grid.Col>
          <Pyr.Grid.Col className="col col-1">
          </Pyr.Grid.Col>
        </Pyr.Grid.Row>
    );
  }

}

class Dashboard extends Container.Base {
  getDefaultPage() {
    return DEFAULT_PAGE;
  }

  pageToComponent(page) {
    return super.pageToComponent(page) || PAGE_MAP[page];
  }

  renderSearchNav(url) {
    let page = this.getPage();

    return super.renderSearchNav(PageURL(page));
  }


  renderSubNavBar() {
    return (
      <SubNavBar user={this.user()} page={this.getPage()} pageItemsCount={this.props.pageItemsCount}/>
    );
  }
}

///
/// 
        ///<Pyr.UI.RouteURL path="/jobs/:pid/candidates/:subid" page="candidates" action="show" />
///

class CacheComponent extends Container.Cache {
  constructor(props) {
    super(props);

    this.initState({
      jobs: null,
      jobsMap: null,

      recruiters: null,
      recruitersMap: null,

      candidates: null,
      candidatesMap: null,
      
      messages: null,
      messagesMap: null,
    });

    this.recruitersLoader = new Loader.Recruiters(this.loaderProps);
    this.jobsLoader = new Loader.Jobs(this.loaderProps);
    this.candidatesLoader = new Loader.Candidates(this.loaderProps);
    this.messagesLoader = new Loader.Messages(this.loaderProps);
  }

  extraProps() {
    return Object.assign({}, {
      loaders: {
        recruiters: this.recruitersLoader,
        jobs: this.jobsLoader,
        candidates: this.candidatesLoader,
        messages: this.messagesLoader,
      },

      // need to see if I can make this a dict...
      jobs: this.state.jobs,
      jobsMap: this.state.jobsMap,
      
      recruiters: this.state.recruiters,
      recruitersMap: this.state.recruitersMap,

      candidates: this.state.candidates,
      candidatesMap: this.state.candidatesMap,
      
      messages: this.state.messages,
      messagesMap: this.state.messagesMap,
    });
  }

  componentDidMount() {
    if (!this.state.jobs) {
      this.jobsLoader.load();
    }
  }

  render() {
    if (!this.state.jobs) {
      return (
        <Pyr.UI.Loading />
      );
      // wait for jobs to load
    }

    let props = this.getProps();

          //<Pyr.UI.RouteURL path="/jobs/:pid/candidates" page="candidates" action="index" />
    return (
        <Pyr.PassThru >
          <Pyr.UI.RouterProps component={Dashboard} dashboard={DEFAULT_PAGE} {...props}>
            <Pyr.UI.RouteURL path="/candidates/:pid/:subid" page="candidates" action="index" />
          </Pyr.UI.RouterProps>
          <Loader.Component loader={this.messagesLoader} />
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
