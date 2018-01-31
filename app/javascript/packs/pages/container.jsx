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

import {
  COMPANIES_URL,
  ME_URL,
} from './const';


import Logo from './shared/logo';

class NavUserMenu extends Component {
  render () {
    return (
      <div className="nav-item flx-row page-nav-bar align-items-center">
        <li className="dropdown">
          <a className="nav-link dropdown-toggle" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><Pyr.UI.Icon name="user"/></a> 
            <div className="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdownMenuLink">
              <Link to={Pyr.URL(ME_URL).toString()} className="dropdown-item">My Profile</Link>
              <Link to={Pyr.URL(COMPANIES_URL).toString()} className="dropdown-item">My Company</Link>
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

class Container extends Component {
  constructor(props) {
    super(props);

    this.initState({
      loading: false
    });
  }

  renderSearchNav(url="/") {
    return (
      <div className="nav-item ml-auto flx-row"><NavSearch url={url}/></div>
    );
  }

  renderNav() {
    return (
       <Pyr.Grid.Row className="navbar flx-row align-items-center">
          <Pyr.Grid.Col className="col col-1 col-sm-1 col-md-2 navbar-nav">
            <Logo />
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

  renderSideBar() {
    return null;
  }

  renderMain() {
    return null;
  }

  renderContent() {
    return (
      <div className="flx-row flx-1">
        { this.renderSideBar() }
        { this.renderMain() }
      </div>
    );
  }

  isReady() {
    return !this.state.loading;
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

    return(
      <Pyr.Grid.FullContainer key="react-top" className="d-flex flx-col">
        { this.renderNav() }
        { this.renderContent() }

        <Pyr.UI.NoticeReceiver />
      </Pyr.Grid.FullContainer>
    );
  }
}

export default Container;
