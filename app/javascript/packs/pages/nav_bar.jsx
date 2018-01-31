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

import Logo from './shared/logo';

class MenuButton extends Component {
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

class ViewMenu extends Component {
  render () {
    return (
      <div className="flx-row page-nav-bar">
        <li className="nav-item dropdown">
          <a className="nav-link dropdown-toggle" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><Pyr.UI.Icon name="sort"/></a>
            <div className="dropdown-menu dropdown-primary" aria-labelledby="navbarDropdownMenuLink">
              <MenuButton className="dropdown-item" sort="received" dir="asc">Received</MenuButton>
              <MenuButton className="dropdown-item" sort="job">Job</MenuButton>
              <MenuButton className="dropdown-item" sort="rank">Rank</MenuButton>
              <hr/>
              <MenuButton className="dropdown-item" sort="list"><Pyr.UI.Icon name="list"/> List</MenuButton>
              <MenuButton className="dropdown-item" sort="grid"><Pyr.UI.Icon name="th"/> Grid</MenuButton>
            </div>
        </li>
      </div>
    );
  }
}

class UserMenu extends Component {
  render () {
    return (
      <div className="nav-item flx-row page-nav-bar align-items-center">
        <li className="dropdown">
          <a className="nav-link dropdown-toggle" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><Pyr.UI.Icon name="user"/></a>
            <div className="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdownMenuLink">
              <Link to={ME_URL} className="dropdown-item">My Profile</Link>
              <Link to={COMPANIES_URL} className="dropdown-item">My Company</Link>
            </div>
        </li>
      </div>
    );
  }
}

const NavBar = {
  MenuButton,
  ViewMenu,
  UserMenu,
};

export default NavBar;
