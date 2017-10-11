
import React, {
  Component
} from 'react';

import PropTypes from 'prop-types';
import { 
  Transition,
  CSSTransition
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

const DURATION_TIME = 250;

const SHOW_TIME = 3000;

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

const FancyLabel = (props) => (
  <label {...Util.propsMergeClassName(props, "fancy pyr-label")}>{props.children}</label>
);

const FancyButton = (props) => (
  <div className="flx-row fancy"><label {...Util.propsMergeClassName(Util.propsRemove(props, "onClick"), "")}>{props.children}</label> <Pyr.Icon onClick={props.onClick} name="times-circle"/></div>
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

const NoticeContextTypes = {
  setNotice: PropTypes.func,
  notice: PropTypes.node
};

const UserContextTypes = {
  user: PropTypes.object
};

class UserComponent extends Component {
  static contextTypes = Object.assign({}, UserContextTypes, NoticeContextTypes);

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

function toClassNames(classNames, state, appear) {
  state = [ state ];
  if (appear && state[0] == "entering") {
    state = ["appearing"];
  }
  if (appear && state[0] == "entered") {
    state = ["appeared"];
  }
  if (state[0] == "entering") {
    state = ["enter", "entering"];
  }
  if (state[0] == "appearing") {
    state = ["appear", "appearing"];
  }
  if (state[0] == "exiting") {
    state = ["exit", "exiting"];
  }
  //console.log(state);
  let cz = ClassNames(classNames);
  //console.log(cz.all());

  let cnames = cz.all().slice();

  let results = cnames.reduce((acc, cname) => {
     return acc.push(state.map((x) => cname + "-" + x));
    }, cz);

  //console.log("RESULTS");
  //console.log(results);

  return results;
}

class CSSAnimation extends Component {
  constructor(props) {
    super(props)
    this.state = {
      go: false
    };
    this.delayTimer = null;
  }

  componentDidMount() {
    if (!this.state.go) {
      this.delayTimer = setTimeout(() => { this.setState({go: true});}, 0.05);
    }
  }

  componentWillUnmount() {
    if (this.delayTimer) {
      let tt = this.delayTimer;
      this.delayTimer = null;
      clearTimeout(tt);
    }
  }

  renderInner(state) {
    //console.log("STATE: " + state);
    let clazzes = toClassNames(this.props.classNames, state, this.props.appear);
    //console.log("CLAZZES: " + clazzes.toString());

    let stuff = Pyr.Util.childrenWithProps(this.props.children, {className: clazzes.toString(), key: "fade-inner"})[0];
    //console.log("INNER STUFF:");
    //console.log(stuff);

    return stuff;
  }

  render() {
    return (
      <Transition
        {...this.props}
        in={this.state.go}
      >
        {(state) => this.renderInner(state)}
      </Transition>
    );
  }
}


const transitionStyles = {
  entering: { opacity: 0 },
  entered: { opacity: 1 },
  appeared: { opacity: 1 },
};

const Fade = (props) => (
    <CSSAnimation
      in={!props.out}
      timeout={(props.duration || DURATION_TIME)}
      classNames={"fade-"+(!props.out ? "in" : "out")}
    >
      { props.children }
    </CSSAnimation>
);

const Slide = (props) => (
  <Transition in={props.in} timeout={DURATION_TIME}>
    {(state) => (
      <div style={{opacity: 0}, transitionStyles[state]}>
        I'm A fade Transition!
      </div>
    )}
  </Transition>
);

class NoticeProvider extends Component {
  static childContextTypes = {
    setNotice: PropTypes.func,
    notice: PropTypes.node
  };

  getChildContext() {
    return {
      setNotice: this.onSetNotice,
      notice: this.state.notice
    }
  }

  constructor(props) {
    super(props);

    this.state = {
      notice: null
    };

    this.onSetNotice = this.setNotice.bind(this);
    this.onHideNotice = this.hideNotice.bind(this);
  }

  setNotice(notice) {
    this.setState({
      notice
    });
  }

  hideNotice(notice) {
    this.setNotice(null);
  }

  render() {
    return this.props.children;
  }
}

class Notice extends Component {
  static contextTypes = NoticeContextTypes;

  constructor(props) {
    super(props);

    this.state = {
      show: false
    };

    this.timer = null;

    this.onShow = this.show.bind(this);
    this.onHide = this.hide.bind(this);
  }

  clear() {
    if (this.timer) {
      let tt = this.timer;
      this.timer = null;
      clearTimeout(tt);
      this.context.setNotice(null);
    }
    this.setState({
      show: false
    });
  }

  kickoff() {
    if (this.timer) {
      clear();
    }

    this.timer = setTimeout( () => {
      this.clear();
      this.onHide();
    }, this.props.delay || SHOW_TIME);

    this.setState({
      show: true
    });
    this.onShow();
  }

  show() {
    if (this.props.onShow) {
      this.props.onShow();
    }
  }

  hide() {
    if (this.props.onHide) {
      this.props.onHide();
    }
  }

  componentDidMount() {
    if (this.context.notice) {
      this.kickoff();
    }
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (this.context.notice != nextContext.notice) {
      this.clear();

      if (nextContext.notice) {
        this.kickoff();
      }
    }
  }

  componentWillUnmount() {
    this.clear();
  }

  render() {
    if (!this.context.notice) {
      return null;
    }

    let stuff = Util.propsMergeClassName(this.props, "notice");

    //console.log("STUFF");
    //console.log(stuff);

    return (
      <Fade out={!this.state.show}>
        <div
          className={ClassNames("notice").push(this.props.className)}
        ><div className="ninner">{this.context.notice}</div></div>
      </Fade>
    );
  }
}



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

  renderInner() {
    return (
      <div 
        className={ClassNames("fullscreen").push(this.props.className)}
        ref={(node) => this.me = node }
      >
        <div 
          className="flx-row flx-end controls"
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

/*
  renderOld() {
    return (
      <Transition
        in={true}
        timeout={this.props.duration || DURATION_TIME}
        appear
      >
        {(state) => {
          console.log("STATE: " + state);
          return (
            <div className={ClassNames("fullscreen fade-in").push("fade-in-" + state)}>
              { this.renderInner() }
            </div>
          );
        }}
      </Transition>
    );
  }
*/

  render() {
    return this.renderInner();
  }
}


const URL = PURL;
const Pyr = { 
  ajaxError,
  getJSON,
  Grid,
  UserContextTypes,
  UserProvider,
  UserComponent,
  Icon,
  Label,
  FancyLabel,
  FancyButton,
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
  NoticeContextTypes,
  NoticeProvider,
  Notice,
  Slide,
};
export default Pyr;
