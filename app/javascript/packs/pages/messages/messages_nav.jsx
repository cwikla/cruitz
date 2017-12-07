
import React, {
  Component
} from 'react';

import ReactDOM from 'react-dom';

import {
  Link,
} from 'react-router-dom';

import {
  MESSAGES_URL,
} from '../const';

import Pyr from '../../pyr/pyr';
const ClassNames = Pyr.ClassNames;

class NavMenuButton extends Component {
  render() {
    let url = Pyr.URL(MESSAGES_URL).set("sort", this.props.sort);

    console.log("NavMenuButton: " + this.props.sort);

    url.bake();
    console.log(url.parser.pathname.toString());
    console.log(url.parser.search.toString());
    console.log(url.parser);

    let us = url.toString();
    console.log("US: " + us);

    return (
      <Link className={this.props.className} to={url.toString()}>{this.props.children}</Link>
    );
  }
}

class NavBar extends Component {
  render () {
    return (
      <div className="flx-row page-nav-bar">
        <li className="nav-item dropdown">
          <a className="nav-link dropdown-toggle" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Sort</a>
            <div className="dropdown-menu dropdown-primary" aria-labelledby="navbarDropdownMenuLink">
              <NavMenuButton className="dropdown-item" sort="received">Received <Pyr.UI.Icon name="sort-asc"/></NavMenuButton>
              <NavMenuButton className="dropdown-item" sort="recruiter">Recruiter <Pyr.UI.Icon name="sort-asc"/></NavMenuButton>
              <NavMenuButton className="dropdown-item" sort="candidate">Candidate <Pyr.UI.Icon name="sort-asc"/></NavMenuButton>
            </div>
        </li>
      </div>
    );
  }
}

export default NavBar;
