
import React, {
  Component
} from 'react';

import PropTypes from 'prop-types';
import { 
  Transition,
  CSSTransition,
} from 'react-transition-group';

import { 
  PyrForm as Form, 
} from "./form";

import Util from './util';

import {
  Route,
  Redirect
} from 'react-router-dom';


const URL = Util.PURL;

const ajaxError = Util.ajaxError;
const getJSON = Util.getJSON;
const Method = Util.Method;

const ClassNames = Util.ClassNames;

import Grid from './grid';
import Scroll from './scroll';
import PieChart from './pie_chart';

const USERS_URL = "/users";

const DURATION_TIME = 300;

const SHOW_TIME = 3000;

const ESCAPE_KEY = 27;

class NetworkComponent extends Component {
  constructor(props) {
    super(props);

    this.ajaxii = {};
  }

  abortJSON(uuid) {
    let old = this.ajaxii;

    this.ajaxii = {};

    if (uuid) {
      xhr = old[uuid];
      xhr.abort();
    }

    console.log(old);

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


class Empty extends Component {
  render() {
    return null;
  }
}

class ChildSelector extends Component {

  render() {
    let val = this.props.page;
    console.log("RENDER CHILD: " + val);

    if ((val < 0) || (val >= Util.kidCount(this.props.children))) {
      console.log("ChildSelector: Error: " + val);
      return Util.kidAt(this.props.children, 0) || null;
    }

    return Util.kidAt(this.props.children, val) || null;
  }

}

const Loading = (props) => (
  <div className="loading" />
);

const RouterContextTypes = {
  location: PropTypes.object,
  history: PropTypes.object,
};

class RouterComponent extends Component {
  static contextTypes = RouterContextTypes;

  constructor(props) {
    super(props);

    this.onGoBack = this.goBack.bind(this);
  }

  goBack() {
    console.log(this.context.history.goBack());
  }
}

class RouterProvider extends Component {
  static childContextTypes = {
    location: PropTypes.object,
    history: PropTypes.object,
  };

  getChildContext() {
    return {
      location: this.props.location,
      history: this.props.history,
    }
  }

  render() {
    return this.props.children;
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
          let location = props.location;
          let history = props.history;

          console.log("ROUTE: " + location.pathname);
          console.log(props);
          console.log(location);

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
            return (
              <Redirect to={URL(dashboard).toString()}/>
            );
          }
  
          return (
            <RouterProvider route={sendProps} location={props.location}  history={props.history}>
              <Component {...rest} {...sendProps} />
            </RouterProvider>
          );
        }}
      />
    );
  }
}

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
  ><Icon name={props.name}/> {props.children}</label>
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

class BackButton extends RouterComponent {
  render() {
    return (
      <label
        {...Util.propsMergeClassName(this.props, "btn")}
        onClick={this.onGoBack}
      >{this.props.children}</label>
    );
  }
}


const ImageButton = (props) => (
  <div className="pyr-image-btn"><img {...props}/></div>
);

const Label = (props) => (
  <label {...Util.propsMergeClassName(props, "pyr-label")}>{props.children}</label>
);

const FancyLabel = (props) => (
  <label {...Util.propsMergeClassName(props, "fancy pyr-label")}>{props.children}</label>
);

const FancyButton = (props) => (
  <div className="flx-row fancy"><label {...Util.propsMergeClassName(Util.propsRemove(props, "onClick"), "")}>{props.children}</label> <Icon onClick={props.onClick} name="times-circle"/></div>
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

class UserComponent extends NetworkComponent {
  static contextTypes = Object.assign({}, UserContextTypes, NoticeContextTypes);

  user() {
    return this.context.user;
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
      ajaxError(jaXHR, textStatus, errorThrown);
    });
  }

  render() {
    return this.props.children;
  }
}

class CSSAnimation extends Component {
  constructor(props) {
    super(props)
    this.state = {
      go: false
    };
    this.delayTimer = null;
  }

  reset() {
    let tt = this.delayTimer;
    this.delayTimer = null;
    if (tt) {
      clearTimeout(tt);
    }
  }

  kickoff(goValue) {
    this.reset();
    this.delayTimer = setTimeout(() => { this.setState({go: goValue});}, 0.05);
  }

  componentDidMount() {
    this.kickoff(this.props.in);
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (this.props.in != nextProps.in) {
      this.kickoff(nextProps.in);
    }
  }

  componentWillUnmount() {
    this.reset();
  }

  toClassNames(classNames, state, appear, isIn) {
    let cz = ClassNames(classNames);

    state = [ state ];
    if (appear && state[0] == "entering") {
      state = ["appearing"];
    }
    if (appear && state[0] == "entered") {
      state = ["appeared"];
    }
    if (state[0] == "entering") {
      state = ["enter", "enter-active"];
    }
    if (state[0] == "entered") {
      state = ["enter", "entered"];
    }
    if (state[0] == "appearing") {
      state = ["appear", "appear-active"];
    }
    if (state[0] == "appeared") {
      state = ["appear", "appeared"];
    }
    if (state[0] == "exiting") {
      state = ["exit", "exit-active"];
    }
    if (state[0] == "exited") {
      state = [];
    }
  
    let cnames = cz.all().slice();
  
    let results = cnames.reduce((acc, cname) => {
       return acc.push(state.map((x) => cname + "-" + x));
      }, cz);
  
    //console.log("RESULTS");
    //console.log(results);
  
    return results;
  }
  
  renderInner(state) {
    console.log("STATE: " + state);
    let clazzes = this.toClassNames(this.props.classNames, state, this.props.appear, this.props.in);
    console.log("CLAZZES: " + clazzes.toString());

    let stuff = Pyr.Util.childrenWithProps(this.props.children, {className: clazzes.toString(), key: "fade-inner"})[0];
    //console.log("INNER STUFF:");
    //console.log(stuff);

    return stuff;
  }

  render() {
    console.log("CSS");
    console.log(this.props);
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

const Fade = (props) => (
    <CSSAnimation
      in={props.show}
      timeout={(props.duration || DURATION_TIME)}
      classNames={"pyr-fade"}
    >
      { props.children }
    </CSSAnimation>
);

const Slide = (props) => (
    <CSSAnimation
      in={props.show}
      timeout={(props.duration || DURATION_TIME)}
      classNames={"pyr-slide-"+(!props.left ? "right" : "left")}
    >
      { props.children }
    </CSSAnimation>
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
        <div
          className={ClassNames("pyr-notice").push(this.props.className)}
        ><div className="ninner">{this.context.notice}</div></div>
    );

    return (
      <Fade show={this.state.show}>
        <div
          className={ClassNames("pyr-notice").push(this.props.className)}
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
          <Pyr.BackButton name="close"
              className="close"
              >Go Back</Pyr.BackButton>
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

const PassThru = (props) => (
  props.children
);

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
  BackButton,
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
  Empty,
  ChildSelector,
  PassThru,
  ImageButton,
  NetworkComponent
};
export default Pyr;
