
import React, {
  Component
} from 'react';
import PropTypes from 'prop-types';

import { 
  PyrForm as Form, 
  POST, 
  PUT, 
  GET, 
  DELETE 
} from "./form";

import Util from './util';
import Grid from './grid';

const Method = { 
  POST, 
  PUT, 
  GET, 
  DELETE 
};

const USERS_URL = "/users";

function ajaxError(jaXHR, textStatus, errorThrown) {
   alert(errorThrown);
}

function getJSON(stuff) {
  stuff = Object.assign({
    dataType: "json",
    type: GET,
  }, stuff);

  let onLoading = stuff.loading ? stuff.loading : null;

  let oldBeforeSend = stuff.beforeSend;
  let beforeSend = (jqXHR, settings) => {
    if (oldBeforeSend) {
      oldBeforeSend(jqXHR, settings);
    }
    if (onLoading) {
      onLoading();
    }
  };

  stuff.beforeSend = beforeSend;
    
  return $.getJSON(
    stuff
  )
  .always(() => {
    if (onLoading) {
      onLoading(false);
    }
  });
}

class Icon extends Component {
  render() {
    let name = "fa fa-" + this.props.name;
    return (
      <i {...Util.propsMergeClassName(this.props, name)}/>
    );
  }
}

class SmallLabel extends Component {
  render() {
    return (<label {...Util.propsMergeClassName(this.props, "small-label hidden-sm-down")}>{this.props.children}</label>);
  }
}

class UserComponent extends Component {
  static contextTypes = {
    user: PropTypes.object
  }

  userChange(user) {
    // nothing to see here
  }

  componentDidUpdate(prevProps, prevState, prevContext) {
    let prevID = prevContext.user ? prevContext.user.id : null;
    let id = this.context.user ? this.context.user.id : null;

    if (prevID != id) {
      //alert(prevID + " => " + id);
      this.userChange(this.context.user);
    }
  }
}

class UserProvider extends Component {
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

    this.getSelf();
  }

  componentWillUnmount() {
  }

  getSelf() {
    let self = this;

    //alert("GET SELF CALLED");

    $.getJSON({
      type: Pyr.Method.GET,
      url: USERS_URL + "/me",
      context: this
    }).done(function(data, textStatus, jaXHR) {
      self.setState({
        user: data.user
      });
    }).fail(function(jaXHR, textStatus, errorThrown) {
      Pyr.ajaxError(jaXHR, textStatus, errorThrown);
    });
  }

  render() {
    return this.props.children;
  }
}

const Pyr = { 
  ajaxError,
  getJSON,
  Grid,
  UserProvider,
  UserComponent,
  Icon,
  SmallLabel,
  Form, 
  Util,
  Method,
};
export default Pyr;
