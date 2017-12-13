import React, { 
  Component
} from 'react';

import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { 
  render 
} from 'react-dom';

import {
  Link,
} from 'react-router-dom';

import Pyr from '../pyr/pyr';
const ClassNames = Pyr.ClassNames;

class Button extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let myClass = ClassNames("sidebar-button");
    if (this.props.selected) {
      myClass.push("selected");
    }
    
    let url = this.props.url;
    let props = Pyr.Util.propsRemove(this.props, "url");

    return(
      <Link to={url.toString().toLowerCase()}>
        <li {...Pyr.Util.propsMergeClassName(props, myClass)} >
          <span className="inner"><span className="name">{props.children}</span></span>
        </li>
      </Link>
    );
   }
}

class Header extends Component {
  renderIcon() {
    if (!this.props.icon) {
      return null;
    }

    return (
      <Pyr.UI.Icon name={this.props.icon} className="header-icon fa-fw"/>
    );
  }

  renderCount() {
    if (!this.props.itemCount || this.props.itemCount == 0) {
      return null;
    }

    return (
      <span> ({this.props.itemCount})</span>
    );
  }

  render() {
    let myClass = ClassNames("sidebar-header");
    if (this.props.selected) {
      myClass.push("selected");
    }

    //console.log(this.props.itemCount);
    //console.log(this.props.children);
    let restProps = Pyr.Util.propsRemove(this.props, ["itemCount", "url"]);

    console.log("HEADER");
    console.log(this.props.url);
    console.log(this.props.url.toString().toLowerCase());

    return (
      <Link to={this.props.url.toString().toLowerCase()}>
        <div {...Pyr.Util.propsMergeClassName(restProps, myClass)}><span className="inner">{this.renderIcon()}<Pyr.UI.SmallLabel>{this.props.children}{this.renderCount()}</Pyr.UI.SmallLabel></span></div>
      </Link>
    );
  }
}


const Menu = (props) => (
  <ul {...Pyr.Util.propsMergeClassName(props, "sidebar-menu flx-1")}>
    {props.children}
   </ul>
);

class Main extends Component {
  render() {
    let newKids = this.props.children;
    let classes = "sidebar";

    return (
      <div id="sidebar" {...Pyr.Util.propsMergeClassName(this.props, classes)} >
        {newKids}
      </div>
    );
  }
}

const Sidebar = {
  Main,
  Menu,
  Header, 
  Button
};

export default Sidebar;
