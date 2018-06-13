

import React from 'react';
import PropTypes from 'prop-types';

import BaseComponent from './base';
import Util from './util';

import Pusher from './pusher';

import { 
  PyrForm as Form, 
} from "./form";

import UI from './ui';
import Grid from './grid';
import Network from './network';
import Attachment from './attachment';

const UserContextTypes = {
  user: PropTypes.object,
  setUser: PropTypes.func,
  setCompany: PropTypes.func,
  getCompany: PropTypes.func,
};

class UserProvider extends Network.Component {
  static childContextTypes = {
    user: PropTypes.object,
    setUser: PropTypes.func,
    setCompany: PropTypes.func,
    getCompany: PropTypes.func,
  };

  getChildContext() {
    return {
      user: this.state.user,
      setUser: this.onSetUser,
      setCompany: this.onSetCompany,
      getCompany: this.onGetCompany,
    };
  }

  constructor(props) {
    super(props);

    this.initState({
      user: null,
    });

    this.onSetCompany = this.setCompany.bind(this);
    this.onSetUser = this.setUser.bind(this);

    this.onGetCompany = this.getCompany.bind(this);
  }

  componentDidMount() {
    // This is being called twice - saw some notes about it being because it's DEV

    this.getSelf(this.props.url);
  }

  setUser(user) {
    console.log("SET USER");
    console.log(user);

    user = Object.assign({}, user);

    this.setState({
      user,
    });

  }

  setCompany(company) {
    console.log("SET COMPANY");
    console.log(company);

    let user = Object.assign({}, this.state.user);
    user.company = Object.assign({}, company);
    this.setUser(user);
  }

  getCompany(company) {
    if (!company) {
      return null;
    }

    if (this.state.user && this.state.user.company) {
      if (company.id == this.state.user.company.id) {
        return  this.state.user.company;
      }
    }

    return company;
  }

  getSelf(url) {
    let self = this;

    //alert("GET SELF CALLED");

    this.getJSON({
      type: Network.Method.GET,
      url: url,
      context: this

    }).done((data, textStatus, jqXHR) => {
      self.setUser(data.user);

    });
  }

  render() {
    let user = this.state.user;

    let userId = user ? user.uuid : null;
    let pusher = user ? user.pusher : null;

    if (!user || !user.pusher) {
      return this.props.children;
    }
    
    return (
      <Pusher.Provider key="user-pusher" userId={userId} pusher={pusher}>
        { this.props.children }
      </Pusher.Provider>
    );
  }
}

class PyrComponent extends Network.Component {
  static contextTypes = Object.assign({}, UserContextTypes, UI.NoticeContextTypes, UI.RouterContextTypes);

 initState(inState) {
    this.state = Object.assign({}, this.state, inState);
  }

  user() {
    return this.context.user;
  }

  setCompany(company) {
    this.context.setCompany(company);
  }

  setUser(user) {
    this.context.setUser(user);
  }

  getCompany(company) {
    return this.context.getCompany(company);
  }

  goBack() {
    return this.context.history.goBack();
  }

  goTo(url) {
    this.context.history.push(url.toString());
  }

  setNotice(notice) {
    this.context.setNotice(notice);
  }
}

const Component = PyrComponent;

const Pyr = { 
  BaseComponent,
  Util,

  Method : Network.Method,
  ClassNames : Util.ClassNames,
  URL : Util.URL,

  Network,

  Attachment,

  UserContextTypes,
  UserProvider,

  Pusher: Pusher.Pusher,

  UI,
  Grid,
  Form, 
  Component,
};

export { 
  Component
};

export default Pyr;
