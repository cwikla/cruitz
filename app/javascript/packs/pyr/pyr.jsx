

import React from 'react';
import PropTypes from 'prop-types';

import {
  BrowserRouter as Router,
  Route,
  Redirect
} from 'react-router-dom';

import Component from './base';
import Util from './util';

import { 
  PyrForm as Form, 
} from "./form";

import UI from './ui';
import Grid from './grid';
import Network from './network';
import Attachment from './attachment';

class RouterProps extends Component {
  render() {
    let rest = Util.propsRemove(this.props, ["component", "dashboard"]);
    let AComponent = this.props.component;
    let dashboard = this.props.dashboard;

    let url = "/:page?/:pid?/:sub?/:subid?";

    return (
      <Router>
        <Route
          path={url}
          render={(props) => {
            let location = props.location;
            let history = props.history;
  
            //console.log("ROUTE: " + location.pathname);
            //console.log(props);
            //console.log(location);
  
            let action = null;
            let params = props.match.params;
  
            let pid = params.pid;
  
            if (pid && isNaN(parseInt(pid))) {
              action = pid;
              pid = null;
            }
  
            let sendProps = { 
              location: location,
              history: history,
              page: params.page,
              action: action,
              itemId: pid,
              subPage: params.sub,
              subItemId: params.subid,
            };
  
            if (!sendProps.page && dashboard) {
              let dest = Util.URL(dashboard);
              //console.log("************ REDIRECT TO");
              //console.log(dest);
              //console.log(dest.toString());
              //console.log("+++++++++++");
              return (
                <Redirect to={Util.URL(dashboard).toString()}/>
              );
            }
    
            return (
                <UI.RouterProvider route={sendProps} location={props.location}  history={props.history}>
                  <AComponent {...rest} {...sendProps} />
                </UI.RouterProvider>
            );
          }}
        />
      </Router>
    );
  }
}

const UserContextTypes = {
  user: PropTypes.object,
  setCompany: PropTypes.func,
};

class UserProvider extends Network.Component {
  static childContextTypes = {
    user: PropTypes.object,
    setUser: PropTypes.func,
    setCompany: PropTypes.func,
  };

  getChildContext() {
    return {
      user: this.state.user,
      setUser: this.onSetUser,
      setCompany: this.onSetCompany,
    }
  }

  constructor(props) {
    super(props);

    this.initState({
      user: null
    });

    this.onSetCompany = this.setCompany.bind(this);
    this.onSetUser = this.setUser.bind(this);
  }

  componentDidMount() {
    // This is being called twice - saw some notes about it being because it's DEV

    this.getSelf(this.props.url);
  }

  setUser(user) {
    console.log("SET USER");
    console.log(user);

    this.setState({
      user
    });
  }

  setCompany(company) {
    console.log("SET COMPANY");
    console.log(company);

    let user = Object.assign({}, this.state.user);
    user.company = Object.assign({}, company);
    this.setUser(user);
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

    }).fail(function(jqXHR, textStatus, errorThrown) {
      Network.ajaxError(jqXHR, textStatus, errorThrown);
    });
  }

  render() {
    return this.props.children;
  }
}

const Pyr = { 
  Component,
  Util,

  Method : Network.Method,
  ClassNames : Util.ClassNames,
  URL : Util.URL,

  Network,

  Attachment,

  UserContextTypes,
  UserProvider,

  RouterProps,

  UI,
  Grid,
  Form, 
};

export { Component };
export default Pyr;
