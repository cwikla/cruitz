
import React from 'react';

import {
  Link,
} from 'react-router-dom';

import Pyr, {
  Component 
} from '../../pyr/pyr';
const ClassNames = Pyr.ClassNames;

import {
  CANDIDATES_URL,
} from '../const';

class NavMenuButton extends Component {
  render() {
    let url = Pyr.URL(CANDIDATES_URL).set("filter", this.props.filter);

    console.log("NavMenuButton: " + this.props.filter);

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
  constructor(props) {
    super(props);

    this.initState({
      filter: "all"
    });
  }

  render () {
    return (
      <div className="flx-row page-nav-bar">
        <li className="nav-item dropdown">
          <a className="nav-link dropdown-toggle" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">{this.state.filter}</a>
            <div className="dropdown-menu dropdown-primary" aria-labelledby="navbarDropdownMenuLink">
              <NavMenuButton className="dropdown-item" filter="all">All</NavMenuButton>
              <NavMenuButton className="dropdown-item" filter="new">New</NavMenuButton>
              <NavMenuButton className="dropdown-item" filter="pending">Pending</NavMenuButton>
              <NavMenuButton className="dropdown-item" filter="accepted">Accepted</NavMenuButton>
              <NavMenuButton className="dropdown-item" filter="rejected">Rejected</NavMenuButton>
              <NavMenuButton className="dropdown-item" filter="recalled">Recalled</NavMenuButton>
              <NavMenuButton className="dropdown-item" filter="canceled">Canceled</NavMenuButton>
            </div>
        </li>
      </div>
    );
  }
}

export default NavBar;
