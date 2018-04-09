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

import {
  ME_PAGE,
  COMPANY_PAGE,
  SETTINGS_PAGE,

  COMPANY_URL,
  ME_URL,
  SETTINGS_URL,

  NEW_ACTION,
  SHOW_ACTION,
  INDEX_ACTION,
} from './const';

import Logo from './shared/logo';
import MePage from './me/me_page';
import CompanyPage from './company/company_page';
import SettingsPage from './settings/settings_page';

function PageURL(page) {
  return Pyr.URL("/" + page.toLowerCase());
}

const PAGE_MAP = {
  [ME_PAGE.toLowerCase()]: MePage,
  [COMPANY_PAGE.toLowerCase()]: CompanyPage,
  [SETTINGS_PAGE.toLowerCase()]: SettingsPage,
};

class SubIcon extends Component {
  render() {
    let clazzes = ClassNames("nav-item sub-nav-icon flx-row");


    let selected = this.props.page.toLowerCase() == this.props.selected.toLowerCase();
    if (selected) {
      clazzes.push("selected");
    }

    let all = Pyr.Util.propsMergeClassName(this.props, clazzes);

    let url = Pyr.URL("/").push(this.props.page);

    return (
      <Link to={url.toString()}>
        <div {...all}>
          <Pyr.UI.Icon name={this.props.icon} className="mt-auto mb-auto"/>
          <div className="title">{this.props.count} - {this.props.name}</div>
        </div>
      </Link>
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
              <Link to={Pyr.URL(ME_URL).toString()} className="dropdown-item"><Pyr.UI.Icon name="user-circle" /> My Profile</Link>
              <Link to={Pyr.URL(COMPANY_URL).toString()} className="dropdown-item"><Pyr.UI.Icon name="building" /> My Company</Link>
              <Link to={Pyr.URL(SETTINGS_URL).toString()} className="dropdown-item"><Pyr.UI.Icon name="gear" /> Settings</Link>
            </div>
        </li>
      </div>
    );
  }
}

class NavSearch extends Component {
  render() {
    let url = Pyr.URL(this.props.url).push("search");

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
}


class OldNavBar extends Component {
  render() {
    return (
       <Pyr.Grid.Row className="navbar flx-row align-items-center">
          <Pyr.Grid.Col className="col col-1 navbar-nav">
            <Logo />
          </Pyr.Grid.Col>
          <Pyr.Grid.Col className="col col-6 navbar-nav flx-row">
          </Pyr.Grid.Col>
          <Pyr.Grid.Col className="col col-5 flx-row navbar-nav align-items-center">
            <div className="flx-row ml-auto">
              <div id="alerts" className="alerts nav-item"><Pyr.UI.Icon name="bell-o" className="fa-fw"/></div>
              <NavUserMenu user={this.props.user} />
            </div>
          </Pyr.Grid.Col>
        </Pyr.Grid.Row>
    );
  }
}

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


class Base extends Component {
  sortItems(items) {
    //console.log("SORTING ITEMS");
    if (!items || (items.length == 0)) {
      return items;
    }
    if (items[0].id) {
      return items.sort((x, y) => y.id - x.id);
    }
    if (items[0].created_at) {
      return items.sort((x, y) => new Date(y.created_at).getTime() - new Date(x.created_at).getTime());
    }
    return items;
  }

  pageToComponent(page) {
    return PAGE_MAP[page]
  }

  getSubPage() {
    return this.props.subPage;
  }

  getPageTitle() {
    return Pyr.Util.capFirstLetter(this.getPage());
  }

  getDefaultPage() {
    return null;
  }

  getPage() {
    let subPage = this.getSubPage();
    if (subPage) {
      return subPage;
    }
    return this.props.page || this.getDefaultPage();
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

  getSearchParams() {
    return this.props.searchParams;
  }

  getPageComponent() {
    let page = this.getPage().toLowerCase();
    let result = this.pageToComponent(page);
    return result;
  }

  getLocation() {
    return this.props.location;
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

  renderSearchNav(url="/") {
    return null; // HMMM

    return (
      <div className="nav-item ml-auto flx-row"><NavSearch url={url} page={this.getPage()}/></div>
    );
  }


  renderSubNavBar() {
    return null;
  }

  renderNavBar() {
    return (
      <NavBar user={this.user()} page={this.getPage()} />
    );
  }

  renderTop() {
    return (
      <div>
        { this.renderNavBar() }
        { this.renderSubNavBar() }
      </div>
    );
  }

  renderSideBar() {
    return null;
  }

  extraProps() {
    return {};
  }

  pageProps(page) {
    let someProps = {
      location: this.getLocation(),
      action: this.getAction(),
      page: page.toLowerCase(),
      
      itemId: this.getItemId(),
      subPage: this.getSubPage(),
      subItemId: this.getSubItemId(),
      searchParams: this.getSearchParams(),
      
      showing: true,
      url: PageURL(page),
    };

    return Object.assign({}, this.props, someProps, this.extraProps());
  }

  renderMain(sideBar) {
    let page = this.getPage();
    //console.log("PAGE");
    //console.log(page);
    let PageComponent = this.getPageComponent();

    //console.log(PageComponent);

    let props = this.pageProps(page);

    //console.log("MAIN");
    //console.log(props);

    let mainProps = {};

    let classes = "col col-11 offset-1 col-sm-11 offset-sm-1 col-md-10 offset-md-2 flx-col flx-1 main-page";
    if (!sideBar) {
      classes = "col flx-col flx-1 main-page";
    }

  //console.log("CONTAINER PROPS");
  //console.log(props);

    return (
        <main
          id="main-page"
          {...Pyr.Util.propsMergeClassName(mainProps, classes)}
        >
          <div className="d-flex flx-1">
            <PageComponent {...props} />
          </div>
        </main>
    );
  }

  renderContent() {
    let sideBar = this.renderSideBar();

    return (
      <div className="flx-row flx-1 container-content">
        { sideBar }
        { this.renderMain(!!sideBar) }
      </div>
    );
  }

  isReady() {
    return !this.props.loading && this.context.user;
  }

  render() {
    //alert(this.state.page == CANDIDATES_PAGE);
    // React went bonkers changing the top level dude

    if (!this.isReady()) {
      return (
        <Pyr.Grid.FullContainer key="react-top">
          <Pyr.UI.Loading />
        </Pyr.Grid.FullContainer>
      );
    }

    let clz = Pyr.ClassNames("d-flex flx-col");
    clz.push(this.constructor.name);

    return(
      <Pyr.Grid.FullContainer key="react-top"  className={clz} >
        { this.renderTop() }
        { this.renderContent() }

        <Pyr.UI.NoticeReceiver />
      </Pyr.Grid.FullContainer>
    );
  }
}

const Container = {
  Base,
  NavUserMenu,
  NavBar,
  SubIcon,
};

export default Container;
