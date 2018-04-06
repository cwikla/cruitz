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

import JobsPage from './jobs/jobs_page';
import CandidatesPage from './candidates/candidates_page';
import MessagesPage from './messages/messages_page';
import RecruitersPage from './recruiters/recruiters_page';
import RegistrationsPage from './registration/registrations_page';

const DashboardPage = (props) => (
  <Redirect to="/" />
);

import {
  JOBS_PAGE,
  CANDIDATES_PAGE,
  RECRUITERS_PAGE,
  MESSAGES_PAGE,
  SEARCH_PAGE,

  ME_URL,
} from './const';

const DEFAULT_PAGE = RECRUITERS_PAGE;

const PAGE_MAP = {
  "home" : DashboardPage,
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
              <Container.SubIcon name="Messages" icon="envelope-open-o" selected={this.props.page} page="messages" count={this.props.pageItemsCount.messages}/>
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

class LoaderComponent extends Loader.Component {
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
  }

  extraProps() {
    return {
      recruiters: this.recruitersLoader,
      jobs: this.jobsLoader,
      candidates: this.candidatesLoader,
    };
  }

  render() {
    let props = this.getProps();

    return (
        <Pyr.UI.RouterProps component={Dashboard} dashboard={DEFAULT_PAGE} {...props}>
          <Pyr.UI.RouteURL path="/messages/:pid?" page="messages" action="index" />
          <Pyr.UI.RouteURL path="/jobs/new" page="jobs" action="new" />
          <Pyr.UI.RouteURL path="/jobs/:pid/candidates/:subid" page="candidates" action="show" />
          <Pyr.UI.RouteURL path="/jobs/:pid/candidates" page="candidates" action="index" />
          <Pyr.UI.RouteURL path="/jobs/:pid?" page="jobs" action="index" />
        </Pyr.UI.RouterProps>
    );
  }

}

render (
  <Pyr.UserProvider url={Pyr.URL(ME_URL)}>
      <Pyr.UI.NoticeProvider>
        <LoaderComponent />
      </Pyr.UI.NoticeProvider>
  </Pyr.UserProvider>,

  document.getElementById('react-container')
);
