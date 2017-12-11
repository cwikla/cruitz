
import React, {
  Component
} from 'react';

import PropTypes from 'prop-types';

import {
  Route,
  Redirect
} from 'react-router-dom';

import Util from './util';

import { 
  PyrForm as Form, 
} from "./form";

import UI from './ui';
import Grid from './grid';

class NetworkComponent extends Component {
  constructor(props) {
    super(props);

    this.ajaxii = {};
  }

  abortJSON(uuid) {
    let old = this.ajaxii;

    if ($.isEmptyObject(old)) {
      return;
    }

    this.ajaxii = {};

    if (uuid) {
      xhr = old[uuid];
      xhr.abort();
    }

    //console.log("abortJSON(" + uuid + ")");
    //console.log(old);

    for(let key in old) {
      if (!uuid || old[key] == uuid) {
        old[key].abort();
      }
    }
  }

  getJSON(stuff) {
    let ax = Util.getJSON(stuff);
    this.ajaxii[ax.uuid] = ax;

    return ax.done(() => {
      delete this.ajaxii[ax.uuid];
    });
  }

  componentWillMount() {
    this.ajaxii = {};
  }

  componentWillUnmount() {
    this.abortJSON();
  }

}

class RouterProps extends Component {
  render() {
    let rest = Util.propsRemove(this.props, ["component", "dashboard"]);
    let AComponent = this.props.component;
    let dashboard = this.props.dashboard;

    let url = "/:page?/:pid?/:sub?/:subid?";

    return (
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
            let dest = Util.PURL(dashboard);
            //console.log("************ REDIRECT TO");
            //console.log(dest);
            //console.log(dest.toString());
            //console.log("+++++++++++");
            return (
              <Redirect to={Util.PURL(dashboard).toString()}/>
            );
          }
  
          return (
            <UI.RouterProvider route={sendProps} location={props.location}  history={props.history}>
              <AComponent {...rest} {...sendProps} />
            </UI.RouterProvider>
          );
        }}
      />
    );
  }
}

const UserContextTypes = {
  user: PropTypes.object
};

class UserReceiver extends NetworkComponent {
  static contextTypes = Object.assign({}, UserContextTypes, UI.NoticeContextTypes);

  user() {
    return this.context.user;
  }
}

class UserProvider extends NetworkComponent {
  static childContextTypes = {
    user: PropTypes.object
  };

  getChildContext() {
    return {
      user: this.state.user,
    }
  }

  constructor(props) {
    super(props);
    this.state =  {
      user: null
    };

  }

  componentDidMount() {
    // This is being called twice - saw some notes about it being because it's DEV

    this.getSelf(this.props.url);
  }

  getSelf(url) {
    let self = this;

    //alert("GET SELF CALLED");

    this.getJSON({
      type: Util.Method.GET,
      url: url,
      context: this
    }).done(function(data, textStatus, jqXHR) {
      self.setState({
        user: data.user
      });
    }).fail(function(jqXHR, textStatus, errorThrown) {
      ajaxError(jqXHR, textStatus, errorThrown);
    });
  }

  render() {
    return this.props.children;
  }
}

const Pyr = { 
  Util,

  ajaxError : Util.ajaxError,
  getJSON : Util.getJSON,

  Method : Util.Method,
  ClassNames : Util.ClassNames,
  URL : Util.PURL,

  NetworkComponent,

  UserContextTypes,
  UserProvider,
  UserReceiver,

  RouterProps,

  UI,
  Grid,
  Form, 
};
export default Pyr;
