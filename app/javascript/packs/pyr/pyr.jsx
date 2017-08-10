
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
const ClassNames = Util.ClassNames;
const URL = Util.URL;

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

const Loading = (props) => (
  <div className="loading" />
);

const Icon = (props) => (
  <i {...Util.propsMergeClassName(props, "fa fa-" + props.name)}/>
);

const SmallLabel = (props) => (
    <label {...Util.propsMergeClassName(props, "small-label hidden-sm-down")}>{props.children}</label>
);

class MagicDate extends Component {
  constructor(props) {
    super(props);
    this.onUpdateMe = this.updateMe.bind(this);

    this.state = {
      currentTime: new Date()
    };

    this.interval = null;
  }

  tooOld(date) {
    date = new Date(date); // in case it's a string
    let now = new Date();

    let diff = (now - date); // to seconds
    return diff >= (1000 * 60 * 60 * 1); // OLDER THAN 1 HOUR
  }

  componentDidMount() {
    if (!this.tooOld(this.props.date) && !this.interval) {
      this.interval = setInterval(() => this.onUpdateMe(true), (60 - (new Date()).getSeconds()) * 1000);
    }
  }

  componentWillUnmount() {
    if (this.interval) {
      let tmp = this.interval;
      this.interval = null;
      clearInterval(tmp);
    }
  }

  updateMe(first=false) {
    if (first) {
      clearInterval(this.interval);
      if (!this.tooOld(this.props.date)) {
        this.interval = setInterval(this.onUpdateMe, 60 * 1000);
      }
    }
    this.setState({
      currentTime: new Date()
    });
  }

  render() {
    let value = Util.friendlyDate(this.props.date, this.props.longOnly);

    return (
      <span>{ value }</span>
    );
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

    if (prevID != id && this.userChange) {
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
  MagicDate,
  ClassNames,
  URL,
  Loading
};
export default Pyr;
