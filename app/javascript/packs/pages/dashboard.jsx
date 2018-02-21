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

import Container from './container';
import Sidebar from './side_bar';
import JobsPage from './jobs/jobs_page';
import CandidatesPage from './candidates/candidates_page';
import MessagesPage from './messages/messages_page';
import RecruitersPage from './recruiters/recruiters_page';
import SettingsPage from './settings/settings_page';
import MePage from './me/me_page';
import RegistrationsPage from './registration/registrations_page';
import CompaniesPage from './companies/companies_page';

import Logo from './shared/logo';

const DashboardPage = (props) => (
  <Redirect to="/" />
);

import {
  JOBS_PAGE,
  CANDIDATES_PAGE,
  RECRUITERS_PAGE,
  SETTINGS_PAGE,
  MESSAGES_PAGE,
  SEARCH_PAGE,
  ME_PAGE,
  COMPANIES_PAGE,
  HEADS_PAGE,

  HOME_URL,
  JOBS_URL,
  CANDIDATES_URL,
  RECRUITERS_URL,
  SETTINGS_URL,
  MESSAGES_URL,
  COMPANIES_URL,
  HEADS_URL,
  ME_URL,

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
  [SETTINGS_PAGE.toLowerCase()]: SettingsPage,
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

class PagePicker extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    if (this.user().first_time) {
      return (
        <RegistrationsPage {...this.props} showing/>
      );
    }

    return (
      <Dashboard {...this.props} />
    );
  }
}

class NavMenuButton extends Component {
  render() {
    let url = Pyr.URL(MESSAGES_URL).set("sort", this.props.sort);

    //console.log("NavMenuButton: " + this.props.sort);

    url.bake();
    //console.log(url.parser.pathname.toString());
    //console.log(url.parser.search.toString());
    //console.log(url.parser);

    let us = url.toString();
    //console.log("US: " + us);

    let icon = <Pyr.UI.Icon name="sort-asc" className={!this.props.dir ? "ghost" : ""}/>;

    return (
      <Link className={this.props.className} to={url.toString()}>{icon}{this.props.children}</Link>
    );
  }
}


class NavViewMenu extends Component {
  render () {
    return (
      <div className="flx-row page-nav-bar">
        <li className="nav-item dropdown">
          <a className="nav-link dropdown-toggle" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><Pyr.UI.Icon name="sort"/></a>
            <div className="dropdown-menu dropdown-primary" aria-labelledby="navbarDropdownMenuLink">
              <NavMenuButton className="dropdown-item" sort="received" dir="asc">Received</NavMenuButton>
              <NavMenuButton className="dropdown-item" sort="job">Job</NavMenuButton>
              <NavMenuButton className="dropdown-item" sort="rank">Rank</NavMenuButton>
              <hr/>
              <NavMenuButton className="dropdown-item" sort="list"><Pyr.UI.Icon name="list"/> List</NavMenuButton>
              <NavMenuButton className="dropdown-item" sort="grid"><Pyr.UI.Icon name="th"/> Grid</NavMenuButton>
            </div>
        </li>
      </div>
    );
  }
}


class Dashboard extends Container {
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

    this.onSetButtonCount = this.setButtonCount.bind(this);

    this.onShowSlide = this.showSlide.bind(this);
  }

  getDefaultPage() {
    return DEFAULT_PAGE;
  }

  pageToComponent(page) {
    return super.pageToComponent(page) || PAGE_MAP[page];
  }

  setButtonCount(page, count=0) {
    //console.log("BUTTON COUNT: " + page + ":" + count);
    let buttonItemCount = Object.assign({}, this.state.buttonItemCount);
    buttonItemCount[page] = count;

    this.setState({
      buttonItemCount
    });
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

  unused_componentWillReceiveProps(nextProps) {
    if ((this.props.page != nextProps.page) ||
        (this.props.subPage != nextProps.subPage) ||
        (this.props.itemId != nextProps.itemId) ||
        (this.props.subPageId != nextProps.subPageId)) {
      let page = Pyr.Util.capFirstLetter(this.props.page || DEFAULT_PAGE);

      //console.log("WILL RECEIVE");
      //console.log(nextProps);
      //console.log(page);

      
    }
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
 
  renderSideBar() {
    let self = this;
    let page = this.getPage();
    let itemId = this.getItemId();
    let subPage = this.getSubPage();

    let jobs = this.state.jobs; //.sort((x, y) => new Date(y.created_at).getTime() - new Date(x.created_at).getTime());

    let jobKids = jobs.map( (job, pos) => {
        let isJob = isPage(page, CANDIDATES_PAGE);
        let jobId = itemId;

        let candCount = job.candidate_counts.total;

        if (candCount == 0) {
          return null;
        }

        return (<Sidebar.Button 
                  key={job.id} 
                  url={Pyr.URL(JOBS_URL).push(job.id).push(CANDIDATES_PAGE)}
                  selected={isJob && (job.id == jobId)}
                ><span className="hidden-sm-down">{job.title} {this.renderCandidateCount(job.candidate_counts.accepted + job.candidate_counts.waiting)}</span></Sidebar.Button>
        );
      }
    );


    return (
        <Sidebar.Main className="col col-1 col-sm-1 col-md-2 flx-col h-100">
          <Sidebar.Header 
            id="messages"
            icon="envelope-open-o"
            selected={isPage(page, MESSAGES_PAGE, true)}
            itemCount={this.state.buttonItemCount[MESSAGES_PAGE] || 0}
            url={PageURL(MESSAGES_PAGE)}
            >Messages</Sidebar.Header>

          <Sidebar.Header 
            id="candidates" 
            icon="users"
            selected={isPage(page, CANDIDATES_PAGE) }
            itemCount={this.state.buttonItemCount[CANDIDATES_PAGE] || 0}
            url={PageURL(CANDIDATES_PAGE)}
          >Candidates</Sidebar.Header>

          <Pyr.UI.Scroll className="sidebar-scroll hidden-sm-down flx-1">
            <Sidebar.Menu>
              {jobKids}
            </Sidebar.Menu>
          </Pyr.UI.Scroll>

          <Sidebar.Header 
            id="jobs"
            icon="bullseye"
            itemCount={this.state.buttonItemCount[JOBS_PAGE] || 0}
            selected={isPage(page, JOBS_PAGE)}
            url={PageURL(JOBS_PAGE)}
          >Jobs</Sidebar.Header>
          <Sidebar.Header 
            id="recruiters"
            icon="cubes"
            itemCount={this.state.buttonItemCount[RECRUITERS_PAGE] || 0}
            selected={isPage(page, RECRUITERS_PAGE)}
            url={PageURL(RECRUITERS_PAGE)}
          >Recruiters</Sidebar.Header>
          <Sidebar.Header 
            id="settings"
            icon="gear"
            selected={isPage(page, SETTINGS_PAGE)}
            className="p-b-1"
            url={PageURL(SETTINGS_PAGE)}
          >Settings</Sidebar.Header>
        </Sidebar.Main>
    );
  }

  renderMain() {
    let props = {
      className: "col col-11 offset-1 col-sm-11 offset-sm-1 col-md-10 offset-md-2"
    };
    return super.renderMain(props);
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
      <Pyr.UI.RouterProps component={Dashboard} dashboard={MESSAGES_PAGE}/>
    </Pyr.UI.NoticeProvider>
  </Pyr.UserProvider>,

  document.getElementById('react-container')
);
