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
  HOME_URL,
  JOBS_URL,
  CANDIDATES_URL,
  RECRUITERS_URL,
  MESSAGES_URL,

  SEARCH_URL,
  USERS_URL,

  INDEX_ACTION,
  NEW_ACTION,
  SHOW_ACTION,
} from './const';

const DEFAULT_PAGE = MESSAGES_PAGE;

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

function isPage(page1, page2, isDefault=false) {
  //console.log("IS PAGE: " + page1 + ":" + page2);
  if (!page1) {
    return isDefault;
  }

  return page1.toLowerCase() == page2.toLowerCase();
}

function same(a,b) {
  return a.id == b.id;
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
              <Container.SubIcon name="Messages" icon="envelope-open-o" selected={this.props.page} page="messages" count={this.props.buttonItemCount.messages}/>
              <Container.SubIcon name="Candidates" icon="users" selected={this.props.page} page="candidates" count={this.props.buttonItemCount.candidates}/>
              <Container.SubIcon name="Jobs" icon="bullseye" selected={this.props.page} page="jobs" count={this.props.buttonItemCount.jobs}/>
              <Container.SubIcon name="Recruiters" icon="cubes" selected={this.props.page} page="recruiters" count={this.props.buttonItemCount.recruiters}/>
            </div>
          </Pyr.Grid.Col>
          <Pyr.Grid.Col className="col col-1">
          </Pyr.Grid.Col>
        </Pyr.Grid.Row>
    );
  }

}

class Dashboard extends Container.Base {
  constructor(props) {
    super(props);

    this.initState({
      jobs: [],
      jobMap: {},
      buttonItemCount: {},
      slide: false
    });

    this.lastPage = null;

    this.onJobClicks = {};

    this.onJobIndex = this.jobIndex.bind(this);
    this.onJobCreate = this.jobCreate.bind(this);
    this.onJobUpdate = this.jobUpdate.bind(this);
    this.onJobDelete = this.jobDelete.bind(this);
    this.onJobNew = this.jobNew.bind(this);

    this.onShowSlide = this.showSlide.bind(this);
  }

  getDefaultPage() {
    return DEFAULT_PAGE;
  }

  pageToComponent(page) {
    return super.pageToComponent(page) || PAGE_MAP[page];
  }

  getJobs() {
    this.getJSON({
      type: Pyr.Method.GET,
      url: JOBS_URL,
      context: this,
      onLoading: this.onLoading,

    }).done((data, textStatus, jqXHR) => {
        this.onJobIndex(data.jobs);

    }).fail((jqXHR, textStatus, errorThrown) => {
      Pyr.Network.ajaxError(jqXHR, textStatus, errorThrown);

    });
  }

  componentDidMount() { 
    this.getJobs();
  }

  same(j1, j2) {
    return j1.id == j2.id;
  }

  jobNew() {
    this.setState({
      page: JOBS_PAGE,
    });
  }

  jobIndex(jobs) {
    let buttonItemCount = Object.assign({}, this.state.buttonItemCount);
    buttonItemCount[JOBS_PAGE] = jobs.length;

    buttonItemCount[CANDIDATES_PAGE] = jobs.reduce((sum, job) => {
      return sum + (job.candidate_counts.accepted + job.candidate_counts.waiting);
    }, 0);

    let jobMap = jobs.reduce((m, o) => {m[o.id] = o; return m;}, {});

    let job = jobs.length ? jobs[jobs.length-1] : null;

    console.log("JOBINDEX GOT JOBS");
    console.log(jobs);

    this.setState({
      buttonItemCount,
      jobs,
      jobMap,
      job
    });
  }

  jobCreate(job) {
    let newJobs = (this.state.jobs || []).slice();
    newJobs.push(job);

    //console.log("JOB CREATE");
    //console.log(job);
    //console.log(newJobs);
    //console.log("********");

    this.onJobIndex(newJobs);
  }

  jobUpdate(job) {
    let newJobs = this.state.jobs.map((item) => {
      if (same(item, job)) {
        return job;
      }
      return item;
    });
    this.onJobIndex(newJobs);
  }

  jobDelete(job) {
    let pos = this.state.jobs.findIndex((item) => {
       return same(item, job);
    });
    if (pos) {
      let newJobs = this.state.jobs.slice(0, pos) + this.state.jobs.slice(pos+1);
      this.onJobIndex(newJobs);
    }
  }

  selectJob(job, e) {
    this.setState({
      page: CANDIDATES_PAGE,
      job: job,
    });
  }

  showSlide() {
    let slide = !this.state.slide;
    this.setState({
      slide
    });
  }

  renderSlide() {
    if (!this.state.slide) {
      return null;
    }

    return(
      <div className="search-side fake-thing flx-col h-100" key="fake-thing">
        Hello
      </div>
    );
  }

  renderSearchNav(url) {
    let page = this.getPage();

    return super.renderSearchNav(PageURL(page));
  }


  renderCandidateCount(count) {
    if (count == 0) {
      return null;
    }
    return (
      <span>({count})</span>
    );
  }

  renderSubNavBar() {
    return (
      <SubNavBar user={this.user()} page={this.getPage()} buttonItemCount={this.state.buttonItemCount}/>
    );
  }
 
  pageProps(page) {
    let props = super.pageProps(page);
    let dashboardProps = {
      jobs: this.state.jobs,
      jobMap: this.state.jobMap,

      onJobCreate: this.onJobCreate,
      onJobUpdate: this.onJobUpdate,
      onJobDelete: this.onJobDelete,

      onSetButtonCount: this.onSetButtonCount,
    };

    return Object.assign({}, props, dashboardProps);
  }

  isReady() {
    return super.isReady() && this.state.jobs;
  }
}

///
/// 
///

render (
  <Pyr.UserProvider url={Pyr.URL(ME_URL)}>
    <Pyr.UI.NoticeProvider>
      <Pyr.UI.RouterProps component={Dashboard} dashboard={MESSAGES_PAGE}>
        <Pyr.UI.RouteURL path="/messages/:pid" page="messages" action="index" />
        <Pyr.UI.RouteURL path="/jobs/new" page="jobs" action="new" />
        <Pyr.UI.RouteURL path="/jobs/:pid" page="jobs" action="index" />
      </Pyr.UI.RouterProps>
    </Pyr.UI.NoticeProvider>
  </Pyr.UserProvider>,

  document.getElementById('react-container')
);
