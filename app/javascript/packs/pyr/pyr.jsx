
import React, {
  Component
} from 'react';

import PropTypes from 'prop-types';
import { 
  CSSTransitionGroup 
} from 'react-transition-group';

import { 
  PyrForm as Form, 
} from "./form";

import Util from './util';

import {
  Route,
  Redirect
} from 'react-router-dom';


const PURL = Util.PURL;
const ajaxError = Util.ajaxError;
const getJSON = Util.getJSON;
const Method = Util.Method;

const ClassNames = Util.ClassNames;

import Grid from './grid';
import Scroll from './scroll';
import PieChart from './pie_chart';

const USERS_URL = "/users";

const APPEAR_TIME = 250;
const ENTER_TIME = 250;
const LEAVE_TIME = 250;

const ESCAPE_KEY = 27;

const Loading = (props) => (
  <div className="loading" />
);

const Icon = (props) => (
  <i {...Util.propsMergeClassName(props, "fa fa-" + props.name)}/>
);

const PrimaryButton = (props) => (
    <label href="#"
      {...Util.propsMergeClassName(props, "btn btn-primary")}
    >{props.children}</label>
);

const Button = (props) => (
    <label
      {...Util.propsMergeClassName(props, "btn")}
    >{props.children}</label>
);

const IconButton = (props) => (
  <label
    {...Util.propsMergeClassName(props, "icon-btn")}
  ><Pyr.Icon name={props.name}/></label>
);

class FlatButton extends Component {
  render() {
    let classes = ClassNames("btn btn-flat");
    if (this.props.selected) {
      classes.push("selected");
    }

    return (
      <a href="#"
        {...Util.propsMergeClassName(this.props, classes)}
      >{this.props.children}</a>
    );
  }
}

const Label = (props) => (
  <label {...Util.propsMergeClassName(props, "pyr-label")}>{props.children}</label>
);

const SmallLabel = (props) => (
  <label {...Util.propsMergeClassName(props, "small-label hidden-sm-down")}>{props.children}</label>
);

const ButtonLabel = (props) => (
  <label {...Util.propsMergeClassName(props, "btn-primary")}>{props.children}</label>
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

  user() {
    return this.context.user;
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

class RouterProps extends Component {
  render() {
    let rest = Util.propsRemove(this.props, ["component", "dashboard"]);
    let Component = this.props.component;
    let dashboard = this.props.dashboard;

    let url = "/:page?/:pid?/:sub?/:subid?";

    return (
      <Route
        path={url}
        render={(props) => {
          let params = props.match.params;
          let sendProps = { 
            page: params.page,
            itemId: params.pid,
            subPage: params.sub,
            subItemId: params.subid,
          };

          if (!sendProps.page && dashboard) {
            return (
              <Redirect to={Pyr.URL(dashboard).toString()}/>
            );
          }
  
          return (
            <Component {...rest} {...sendProps} />
          );
        }}
      />
    );
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

    this.getSelf(this.props.url);
  }

  componentWillUnmount() {
  }

  getSelf(url) {
    let self = this;

    //alert("GET SELF CALLED");

    getJSON({
      type: Method.GET,
      url: url,
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

const Fade = (props) => (
    <CSSTransitionGroup
      transitionName={"fade-" + (props.in_or_out || "in")}
      transitionAppear={true}
      transitionEnter={false}
      transitionLeave={false}
      transitionAppearTimeout={props.appearTime || APPEAR_TIME}
      transitionEnterTimeout={props.enterTime || ENTER_TIME}
      transitionLeaveTimeout={props.leaveTime || LEAVE_TIME}
    >
      { Util.firstKid(props.children) }
    </CSSTransitionGroup>
);

class FullScreen extends Component {
  constructor(props) {
    super(props);

    this.onEscape = this.escPress.bind(this);
    this.onClose = this.close.bind(this);
  }

  componentDidMount() {
    document.addEventListener("keydown", this.onEscape);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.onEscape);
  }

  close(e) {
    if (e) {
      e.preventDefault();
    }
    if (this.props.onClose) {
      this.props.onClose();
    }
  }

  escPress(e) {
    if (e.keyCode === ESCAPE_KEY) {
      if (this.props.onEscape) {
        this.props.onEscape();
      }
    }
  }

  render() {
    return (
      <div className="fullscreen"
        ref={(node) => this.me = node }
      >
        <div 
          className="flx-row flx-end"
          onClick={this.onClose}
        >
          <Pyr.Icon name="close"
              className="close"
              />
        </div>
        <div className="content">
          {this.props.children}
        </div>
      </div>
    );
  }

}


const URL = PURL;
const Pyr = { 
  ajaxError,
  getJSON,
  Grid,
  UserProvider,
  UserComponent,
  Icon,
  Label,
  SmallLabel,
  ButtonLabel,
  Form, 
  Util,
  Method,
  MagicDate,
  ClassNames,
  URL,
  Loading,
  Scroll,
  Button,
  PrimaryButton,
  FlatButton,
  IconButton,
  Fade,
  FullScreen,
  PieChart,
  RouterProps,
};
export default Pyr;
