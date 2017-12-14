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
  Link,
  Redirect
} from 'react-router-dom';

import Pyr from '../pyr/pyr';

import Sidebar from './side_bar';
import JobsPage from './jobs/jobs_page';
import CandidatesPage from './candidates/candidates_page';
import MessagesPage from './messages/messages_page';
import RecruitersPage from './recruiters/recruiters_page';
import SettingsPage from './settings/settings_page';
import MePage from './me/me_page';
import RegistrationsPage from './registration/registrations_page';
import CompaniesPage from './companies/companies_page';

import {
  JOBS_PAGE,
  CANDIDATES_PAGE,
  RECRUITERS_PAGE,
  SETTINGS_PAGE,
  MESSAGES_PAGE,
  SEARCH_PAGE,
  ME_PAGE,
  COMPANIES_PAGE,

  JOBS_URL,
  CANDIDATES_URL,
  RECRUITERS_URL,
  SETTINGS_URL,
  MESSAGES_URL,
  COMPANIES_URL,
  ME_URL,

  SEARCH_URL,

  USERS_URL,

  INDEX_ACTION,
  NEW_ACTION,
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
  [COMPANIES_PAGE.toLowerCase()]: CompaniesPage,
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

const UserLabel = (props) => (
  <div 
    className="nav-item"
    id="user" 
    onClick={props.onClick}
  ><Pyr.UI.Icon name="user" className="fa-fw" /><Pyr.UI.Icon id="arrow" name="arrow-down" className="fa-fw"/></div>
);

class PagePicker extends Pyr.UserReceiver {
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


class NavUserMenu extends Component {
  render () {
    return (
      <div className="nav-item flx-row page-nav-bar align-items-center">
        <li className="dropdown">
          <a className="nav-link dropdown-toggle" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><Pyr.UI.Icon name="user"/></a>
            <div className="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdownMenuLink">
              <Link to={PageURL(ME_PAGE).toString()} className="dropdown-item">My Profile</Link>
              <Link to={PageURL(COMPANIES_PAGE).toString()} className="dropdown-item">My Company</Link>
            </div>
        </li>
      </div>
    );
  }
}

class Dashboard extends Pyr.UserReceiver {
  constructor(props) {
    super(props);

    this.state = {
      action: INDEX_ACTION,
      jobs: [],
      jobMap: {},
      loading: true,
      buttonItemCount: {},
      notice: null,
      slide: false
    };

    this.lastPage = null;

    this.onJobClicks = {};

    this.onJobIndex = this.jobIndex.bind(this);
    this.onJobCreate = this.jobCreate.bind(this);
    this.onJobUpdate = this.jobUpdate.bind(this);
    this.onJobDelete = this.jobDelete.bind(this);
    this.onJobNew = this.jobNew.bind(this);

    this.onSetAction = this.setAction.bind(this);
    this.onSetUnaction = this.setAction.bind(this, null);

    this.onSetButtonCount = this.setButtonCount.bind(this);

    this.onLoading = this.setLoading.bind(this);
    this.onShowSlide = this.showSlide.bind(this);
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
    let iid = this.props.itemId;
    if (!iid) {
      return iid;
    }
    return (iid.toLowerCase() != NEW_ACTION.toLowerCase() ? iid : null);
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
    let act = this.props.action; //this.state.action;
    let page = this.props.page;
    let subPage = this.props.subPage;
    let itemId = this.props.itemId;
    let subId = this.props.subItemId;

    if (act) {
      if (act && (act.toLowerCase() == NEW_ACTION.toLowerCase())) {
        act = NEW_ACTION;
      }
    }

    if (!act && (subId || (itemId && !subPage))) {
      act = SHOW_ACTION;
    }

    //console.log("PROPS ACTION IS: " + this.props.action);
    //console.log("ACTION IS: " + act);

    return act;
  }

  setButtonCount(page, count=0) {
    //console.log("BUTTON COUNT: " + page + ":" + count);
    let buttonItemCount = Object.assign({}, this.state.buttonItemCount);
    buttonItemCount[page] = count;

    this.setState({
      buttonItemCount
    });
  }

  setAction(action, e) {
    //console.log("Action set to " + action);
    if (e) {
      e.preventDefault();
    }

    this.setState({
      action,
      slide: false
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

      //console.log("WILL RECEIVE");
      //console.log(nextProps);
      //console.log(page);

      this.setAction(null);
      
    }
  }

  jobNew() {
    this.setState({
      page: JOBS_PAGE,
      action: NEW_ACTION,
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

  showSlide() {
    let slide = !this.state.slide;
    this.setState({
      slide
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
            <div onClick={this.onShowSlide}>
              <Pyr.UI.Icon name="search" /><Pyr.Form.TextField placeholder="Search..." unmanaged/>
            </div>
          </Pyr.Form.Group>
        </Pyr.Form.Form>
      </div>
    );
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

  renderSearchNav() {
    let page = this.getPageComponent();

    let NavBar = page.NavBar || Pyr.UI.Empty;

    if (!NavBar) {
      return (<div className="nav-item ml-auto">&nbsp;</div>);
    }

    return (
      <div className="nav-item ml-auto flx-row"><NavViewMenu /><NavBar />{ this.renderSearch() }</div>
    );
  }

  render3() {
    return (
      <div>
            <Link to={"/jobs/new"}><Pyr.UI.IconButton name="plus" className="nav-item" >Add Job</Pyr.UI.IconButton></Link>
            &nbsp;&nbsp;
            <Link to={"/recruiters"}><Pyr.UI.IconButton name="list" className="nav-item">Recruiters</Pyr.UI.IconButton></Link>
      </div>
    );
  }
            //<Link to={ME_URL}><UserLabel user={this.user()} /></Link>

  renderNav() {
    return (
       <Pyr.Grid.Row className="navbar flx-row align-items-center">
          <Pyr.Grid.Col className="col col-1 col-sm-1 col-md-2 navbar-nav">
            <Pyr.UI.SmallLabel className="nav-item">{this.getPageTitle()}</Pyr.UI.SmallLabel>
          </Pyr.Grid.Col>
          <Pyr.Grid.Col className="col col-10 col-sm-10 col-md-9 navbar-nav hidden-sm-down flx-row">
            { this.renderSearchNav() }
          </Pyr.Grid.Col>
          <Pyr.Grid.Col className="col col-1 col-sm-1 col-md-1 navbar-nav flx-row align-items-center">
            <div id="alerts" className="alerts nav-item"><Pyr.UI.Icon name="bell-o" className="fa-fw"/></div>
            <NavUserMenu user={this.user()}/>
          </Pyr.Grid.Col>
        </Pyr.Grid.Row>
    );
  }

  renderBottomNav() {
    return (
       <Pyr.Grid.Row className="navbar bottom flx-row align-items-center">
          <Pyr.Grid.Col className="col col-10 col-sm-10 col-md-8 navbar-nav">
            { this.renderSearchNav() }
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

      location: this.props.location,

      showing: true,
      url: PageURL(page),
    };

    return props;
  }

  renderMain() {
    let page = this.getPage();
    let PageComponent = this.getPageComponent();

    let props = this.pageProps(page);

    return (
        <main 
          id="main-page"
          className="col col-11 offset-1 col-sm-11 offset-sm-1 col-md-10 offset-md-2 flx-col flx-1 main-page"
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
          <Pyr.UI.Loading />
        </Pyr.Grid.FullContainer>
      );
    }

    return(
      <Pyr.Grid.FullContainer key="react-top" className="d-flex flx-col">
        { this.renderNav() }
        <div className="flx-row flx-1">
          { this.renderSideBar() }
          { this.renderMain() }
        </div>
      <Pyr.UI.NoticeReceiver />
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
  <Pyr.UserProvider url={Pyr.URL(USERS_URL).push("/me")}>
    <Pyr.UI.NoticeProvider>
      <Router>
        <Pyr.RouterProps component={Dashboard} dashboard={MESSAGES_URL}/>
      </Router>
    </Pyr.UI.NoticeProvider>
  </Pyr.UserProvider>,

  document.getElementById('react-container')
);
