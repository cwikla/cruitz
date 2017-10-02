import React, {
  Component,
} from 'react';

import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { 
  render 
} from 'react-dom';

import {
  BrowserRouter as Router,
  Link
} from 'react-router-dom';

import Pyr from '../pyr/pyr';

import Sidebar from './side_bar';
import JobsPage from './jobs/jobs_page';
import CandidatesPage from './candidates/candidates_page';
import MessagesPage from './messages/messages_page';
import RecruitersPage from './recruiters/recruiters_page';
import SettingsPage from './settings/settings_page';
import MePage from './me/me_page';

import {
  JOBS_PAGE,
  CANDIDATES_PAGE,
  RECRUITERS_PAGE,
  SETTINGS_PAGE,
  MESSAGES_PAGE,
  SEARCH_PAGE,
  ME_PAGE,

  JOBS_URL,
  CANDIDATES_URL,
  RECRUITERS_URL,
  SETTINGS_URL,
  MESSAGES_URL,
  SEARCH_URL,

  USERS_URL,

  INDEX_ACTION,
  SHOW_ACTION,
} from './const';

const DEFAULT_PAGE = MESSAGES_PAGE;

const PAGE_MAP = {
  [JOBS_PAGE.toLowerCase()]: JobsPage,
  [CANDIDATES_PAGE.toLowerCase()]: CandidatesPage,
  [RECRUITERS_PAGE.toLowerCase()]: RecruitersPage,
  [SETTINGS_PAGE.toLowerCase()]: SettingsPage,
  [MESSAGES_PAGE.toLowerCase()]: MessagesPage,
  [ME_PAGE.toLowerCase()]: MePage,
};


function PageURL(page) {
  return Pyr.URL().push(page);
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

const UserLabel = (props) => (
  <div 
    className="nav-item"
    id="user" 
    onClick={props.onClick}
  ><Pyr.Icon name="user" className="fa-fw" /><Pyr.SmallLabel>{props.user ? props.user.first_name : ""}</Pyr.SmallLabel><Pyr.Icon id="arrow" name="arrow-down" className="fa-fw"/></div>
);


class Dashboard extends Pyr.UserComponent {
  constructor(props) {
    super(props);

    this.state = {
      action: INDEX_ACTION,
      jobs: [],
      jobMap: {},
      loading: true,
      buttonItemCount: {},
      notice: null
    };

    this.lastPage = null;

    this.onJobClicks = {};

    this.onJobIndex = this.jobIndex.bind(this);
    this.onJobCreate = this.jobCreate.bind(this);
    this.onJobUpdate = this.jobUpdate.bind(this);
    this.onJobDelete = this.jobDelete.bind(this);

    this.onSetAction = this.setAction.bind(this);
    this.onSetUnaction = this.setAction.bind(this, null);

    this.onSetButtonCount = this.setButtonCount.bind(this);

    this.onLoading = this.setLoading.bind(this);
  }

  getSubPage() {
    return this.props.subPage;
  }

  getPageTitle() {
    return Pyr.Util.capFirstLetter(this.getPage());
  }

  getPage() {
    let subPage = this.getSubPage();
    if (subPage) {
      return subPage;
    }
    return this.props.page || DEFAULT_PAGE;
  }

  getItemId() {
    return this.props.itemId;
  }

  getSubItemId() {
    return this.props.subItemId;
  }

  getPageComponent() {
    let page = this.getPage().toLowerCase();
    let result = PAGE_MAP[page];
    return result;
  }

  getAction() {
    let act = this.state.action;
    let page = this.props.page;
    let subPage = this.props.subPage;
    let itemId = this.props.itemId;
    let subId = this.props.subItemId;

    if (act) {
      return act;
    }

    if (subId || (itemId && !subPage)) {
      act = SHOW_ACTION;
    }

    return act;
  }

  userChange(user) {
    console.log("User Change: " + JSON.stringify(user));
  }

  setButtonCount(page, count=0) {
    console.log("BUTTON COUNT: " + page + ":" + count);
    let buttonItemCount = Object.assign({}, this.state.buttonItemCount);
    buttonItemCount[page] = count;

    this.setState({
      buttonItemCount
    });
  }

  setAction(action, e) {
    console.log("Action set to " + action);
    if (e) {
      e.preventDefault();
    }

    this.setState({
      action
    });
  }

  setLoading(loading=true) {
    //alert("SETLOADIN: " + loading);
    this.setState({loading});
  }

  getJobs() {
    Pyr.getJSON({
      type: Pyr.Method.GET,
      url: PageURL(JOBS_PAGE),
      context: this,
      loading: this.onLoading,

    }).done(function(data, textStatus, jaXHR) {
        this.onJobIndex(data.jobs);

    }).fail(function(jaXHR, textStatus, errorThrown) {
      Pyr.ajaxError(jaXHR, textStatus, errorThrown);

    });
  }

  componentDidMount() {
    this.getJobs();
  }

  same(j1, j2) {
    return j1.id == j2.id;
  }

  componentWillReceiveProps(nextProps) {
    if ((this.props.page != nextProps.page) ||
        (this.props.subPage != nextProps.subPage) ||
        (this.props.itemId != nextProps.itemId) ||
        (this.props.subPageId != nextProps.subPageId)) {
      let page = Pyr.Util.capFirstLetter(this.props.page || DEFAULT_PAGE);
      console.log("WILL RECEIVE");
      console.log(nextProps);
      console.log(page);
      this.setState({
        action: null
      });
      
    }
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
      action: null
    });
  }

  renderSearch() {
    let page = this.getPage();
    let model = page;
    let url = Pyr.URL(SEARCH_URL).push(page);

    return (
      <div id="search">
        <Pyr.Form.Form
          model="search"
          object={{search: null}}
          url={url}
          className="search-form"
          onSuccess={(data) => { this.context.setNotice("Unimplemented"); } }
          reset
        >
          <Pyr.Form.Group name="search">
            <Pyr.Icon name="search" /><Pyr.Form.TextField placeholder="Search..." unmanaged/>
          </Pyr.Form.Group>
        </Pyr.Form.Form>
      </div>
    );
  }

  renderNav() {
    return (
       <Pyr.Grid.Row className="navbar flx-row align-items-center">
          <Pyr.Grid.Col className="col col-1 col-sm-1 col-md-2 navbar-nav">
            <Link to={Pyr.URL(ME_PAGE).toString()}><UserLabel user={this.context.user} /></Link>
          </Pyr.Grid.Col>
          <Pyr.Grid.Col className="col col-1 col-sm-1 col-md-2 navbar-nav hidden-sm-down">
            <Pyr.SmallLabel className="nav-item">{this.getPageTitle()}</Pyr.SmallLabel>
          </Pyr.Grid.Col>
          <Pyr.Grid.Col className="col col-10 col-sm-10 col-md-8 navbar-nav">
            <div className="nav-item ml-auto">{this.renderSearch()}</div>
          </Pyr.Grid.Col>
        </Pyr.Grid.Row>
    );
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

        return (<Sidebar.Button 
                  key={job.id} 
                  url={Pyr.URL(JOBS_URL).push(job.id).push(CANDIDATES_PAGE).toString()}
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

          <Pyr.Scroll className="sidebar-scroll hidden-sm-down flx-1">
            <Sidebar.Menu>
              {jobKids}
            </Sidebar.Menu>
          </Pyr.Scroll>

          <Sidebar.Header 
            id="jobs"
            icon="bullseye"
            itemCount={this.state.buttonItemCount[JOBS_PAGE] || 0}
            selected={isPage(page, JOBS_PAGE)}
            url={PageURL(JOBS_URL)}
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

  pageProps(page, jobId) {
    let props = {
      action: this.getAction(),
      jobs: this.state.jobs,
      jobMap: this.state.jobMap,

      onSetAction: this.onSetAction,
      onSetUnaction: this.onSetUnaction,
      onSetButtonCount: this.onSetButtonCount,

      onJobCreate: this.onJobCreate,
      onJobUpdate: this.onJobUpdate,
      onJobDelete: this.onJobDelete,

      page: page.toLowerCase(),
      itemId: this.getItemId(),
      subPage: this.getSubPage(),
      subItemId: this.getSubItemId(),

      showing: true,
      url: PageURL(page),
    };

    return props;
  }

  renderMain() {
    let page = this.getPage();
    let PageComponent = this.getPageComponent();

    let props = this.pageProps(page);
    console.log("MAIN");
    console.log(props);

    return (
        <main 
          className="col col-11 offset-1 col-sm-11 offset-sm-1 col-md-10 offset-md-2 flx-col flx-1 main-page" 
          id="main-page"
        >
          <div className="d-flex flx-1">
            <PageComponent {...props} />
          </div>
        </main>
    );
  }

  render() {
    //alert(this.state.page == CANDIDATES_PAGE);
    // React went bonkers changing the top level dude

    if (this.state.loading || !this.state.jobs) {
      return (
        <Pyr.Grid.FullContainer key="react-top">
          <Pyr.Loading />
        </Pyr.Grid.FullContainer>
      );
    }

    return(
      <Pyr.Grid.FullContainer key="react-top">
        { this.renderNav() }
        <div className="flx-row flx-1">
          { this.renderSideBar() }
          { this.renderMain() }
        </div>
      <Pyr.Notice />
      </Pyr.Grid.FullContainer>
    );
  }
}

const Footer = (props) => (
  <div>Footer {props.name}!</div>
);

///
/// 
///

render (
  <Pyr.UserProvider url={Pyr.URL().push(USERS_URL).push("/me")}>
    <Pyr.NoticeProvider>
      <Router>
        <Pyr.RouterProps component={Dashboard} dashboard={MESSAGES_PAGE}/>
      </Router>
    </Pyr.NoticeProvider>
  </Pyr.UserProvider>,

  document.getElementById('react-container')
);
