

import React from 'react';
import PropTypes from 'prop-types';
import { 
  Transition,
  CSSTransition,
} from 'react-transition-group';

import BaseComponent from './base';
const Component = BaseComponent;

import Util from './util';
import Scroll from './scroll'
import PieChart from './pie_chart';
import Attachment from './attachment';

import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch
} from 'react-router-dom';



const ClassNames = Util.ClassNames;

const DURATION_TIME = 300;

const SHOW_TIME = 1500;

const ESCAPE_KEY = 27;


class Empty extends Component {
  render() {
    return null;
  }
}

class ChildSelector extends Component {

  render() {
    let val = this.props.page;

    if ((val < 0) || (val >= Util.kidCount(this.props.children))) {
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

const DIV = (props) => (
  <div {...props}>
    { props.children }
  </div>
);

class RouterReceiver extends Component {
  static contextTypes = RouterContextTypes;

  constructor(props) {
    super(props);

    this.onGoBack = this.goBack.bind(this);
  }

  goBack() {
    this.context.history.goBack();
  }

  goUrl(url) {
    this.context.history.push(url.toString());
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

class RouteURL extends Component {
  getFields(path) {
    matches = Util.matchAll(this.props.path, /:[a-zA-Z]*/) || [];

    return matches.map((m, pos) => {
      return m.substring(1, m.length);
    });
  }

  constructor(props) {
    super(props);

    //let fields = this.getFields(this.props.path);

    this.onRouteRender = this.routeRender.bind(this);
  }

  routeRender(routeProps) {

    let AComponent = this.props.component;
    let location = routeProps.location;
    let history = routeProps.history;

    let params = routeProps.match.params;
    //console.log("MATCH PARAMS");
    //console.log(params);

    let searchParams = {};

    let search = new URLSearchParams(location.search);
    for (let pair of search.entries()) {
      searchParams[pair[0]] = pair[1];
    }

    let sendProps = { 
      location: location,
      history: history,
      page: this.props.page || params.page,
      action: this.props.action || params.action,
      itemId: this.props.pid || params.pid,
      subPage: this.props.subPage || params.sub,
      subItemId: this.props.subItemId || params.subid,
      searchParams: Object.assign({}, searchParams, this.props.searchParams || {}),
    };

    //console.log("SEND PROPS");
    //console.log(sendProps);

    let rest = Util.propsRemove(this.props, ["component", "dashboard"]);
   
    return (
      <UI.RouterProvider route={sendProps} location={location} history={history}>
        <AComponent {...rest} {...sendProps} />
      </UI.RouterProvider>
    );
  }

  render() {
    return (
      <Route
        path={this.props.path}
        render={this.onRouteRender}
        exact
      />
    );
  }
}

class DefaultRoute extends Component {
  constructor(props) {
    super(props);
    this.onDefaultRender = this.defaultRender.bind(this);
  }

  defaultRender(routeProps) {
    let rest = Util.propsRemove(this.props, ["component", "dashboard"]);
    let AComponent = this.props.component;
    let dashboard = this.props.dashboard;

    let location = routeProps.location;
    let history = routeProps.history;
    
    //console.log("ROUTE: " + location.pathname);
    //console.log(routeProps);
    //console.log(location);
    
    let params = routeProps.match.params;
    let action = params.action;
    
    let pid = params.pid;
    
    if (pid && isNaN(parseInt(pid))) {
      action = pid;
      pid = null;
    }

    let searchParams = {};

    let search = new URLSearchParams(location.search);
    for (let pair of search.entries()) {
      searchParams[pair[0]] = pair[1];
    }
    
    let sendProps = { 
      location: location,
      history: history,
      page: params.page,
      action: action,
      itemId: pid,
      //subPage: params.sub,
      //subItemId: params.subid,
      searchParams: Object.assign({}, searchParams, this.props.searchParams || {}),
    };
   
    if (!sendProps.page && dashboard) {
      let dest = Util.URL(dashboard).toString().toLowerCase();
      //console.log("************ REDIRECT TO");
      //console.log(dest);
      //console.log(dest.toString());
      //console.log("+++++++++++");
      return (
        <Redirect to={dest} />
      );
    }
     
    return (
      <UI.RouterProvider route={sendProps} location={location}  history={history}>
        <AComponent {...rest} {...sendProps} />
      </UI.RouterProvider>
    );
  }

  render() {
    let url = "/:page?/:pid?/:action?"; // /:subid?";

    return (
      <Route
        path={url}
        render={this.onDefaultRender}
      />
    );
  }
}

class Hello extends Component {
  render() {
    return (
      <div>HELLLO</div>
    );
  }
}

class RouterProps extends Component {
  render() {
    let kids = Util.childrenWithProps(this.props.children, this.props);

    return (
      <Router>
        <div style={{height: '100%', width: '100%'}}>
          <Switch>
            { kids }
            <DefaultRoute {...this.props} />
          </Switch>
        </div>
      </Router>
    );
  }
}

function fontProp(props) {
  if (props.regular) {
    return "far";
  }
  if (props.brand) {
    return "fab";
  }
  if (props.light) {
    return "fal";
  }
  return "fas";
}

const Icon = (props) => (
  <span {...Util.propsMergeClassName(Util.propsRemove(props, ["regular", "brand", "solid", "light", "fixed"]), "pyr-icon")}>
    <i 
      {...Util.propsMergeClassName(Util.propsRemove(props, ["regular", "brand", "solid", "light", "fixed"]),
        ClassNames(fontProp(props), " fa-" + props.name,  (props.fixed ? "fa-fw" : "")))} />
  </span>
);

const Burger = (props) => (
  <span className="pyr-icon dropdown-toggle"
    {...props}
  >
    <i className="fa fa-bars" />
  </span>
);

const PrimaryButton = (props) => (
    <label href="#"
      {...Util.propsMergeClassName(props, "btn btn-primary pyr-btn-primary")}
    >{props.children}</label>
);

const Button = (props) => (
    <label
      {...Util.propsMergeClassName(props, "btn pyr-btn")}
    >{props.children}</label>
);

const IconButton = (props) => (
  <label
    {...Util.propsMergeClassName(props, "icon-btn pyr-icon-btn")}
  ><Icon name={props.name}/> {props.children}</label>
);

class FlatButton extends Component {
  render() {
    let classes = ClassNames("btn-flat pyr-btn-flat");
    if (this.props.selected) {
      classes.push("selected");
    }

    return (
      <label href="#"
        {...Util.propsMergeClassName(this.props, classes)}
      >{this.props.children}</label>
    );
  }
}

class BackButton extends RouterReceiver {
  render() {
    return (
      <div className="ml-auto">
      <label
        {...Util.propsMergeClassName(this.props, "pyr-back-button")}
        onClick={this.onGoBack}
      >{this.props.children}</label>
      </div>
    );
  }
}

class ImageFile extends Component {
  constructor(props) {
    super(props);

    let localUrl = this.props.file ? URL.createObjectURL(this.props.file) : null;

    this.initState({
      localUrl,
    });

    this.contentType = this.props.file ? this.props.file.type : this.props.contentType;

    this.onLoad = this.loaded.bind(this);
  }

  release() {
    if (this.state.localUrl) {
      URL.revokeObjectURL(this.state.localUrl);
    }
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if ((this.props.file != nextProps.file) || (this.props.url != nextProps.url)) {
      this.release();

      let state = {
        localUrl : (nextProps.file ? URL.createObjectURL(nextProps.file) : null),
      };

      this.setState(state);
    }
  }

  getURL() {
    return (this.state.localUrl ? this.state.localUrl : this.props.url);
  }

  componentWillUnmount() {
    this.release();
  }

  loaded(e) {
    this.release();
  }

  getContentType() {
    let ftype = this.contentType;

    //console.log(ftype);

    if (!ftype) {
      return "file";
    }

    ftype = ftype.split("/");
    if (ftype.length < 2) {
      return "file";
    }

    let fapp = ftype[0].toLowerCase();

    if (fapp == "application") {
      return ftype[1].toLowerCase();
    }
    
    return ftype[0];
  }

 
  render() {
    let ftype = this.getContentType().toLowerCase();

    let rest = Util.propsRemove(this.props, ["file", "url", "contentType"]);

    if (!Attachment.isImageType(this.props.file || this.props.contentType)) {
      return (
        <Icon name={"file-" + ftype} regular {...Util.propsMergeClassName(rest, "pyr-image-file")}/>
      );
    }

    
    return (
      <img
        {...Util.propsMergeClassName(rest, "pyr-image-file")}
        src={this.getURL()}
        onLoad={this.onLoad}
      />
    );
  }
}

const ImageButton = (props) => (
  <div className="pyr-image-btn"><img {...props}/></div>
);

const Image = (props) => (
  <img {...props} src={props.src ? props.src : "default.png"} />
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

class Collapse extends Component {
  constructor(props) {
    super(props);

    this.onToggle = this.toggle.bind(this);

    this.initState({
      open: props.open || false
    });
  }

  toggle(e) {
    let open = !this.state.open;
    this.setState( {
      open
    });
  }

  renderButton(text, open) {
    let name = !open ? "plus" : "minus";
    return (
      <IconButton name={name} onClick={this.onToggle}>{text}</IconButton>
    );
  }

  renderChildren(open) {
    if (!open) {
      return null;
    }
    return (
      <div className="children">
        {this.props.children}
      </div>
    );
  }

  render() {
    let clz = ClassNames("pyr-collapse", this.state.open ? "" : "collapsed");
    return (
      <div {...Util.propsMergeClassName(this.props, clz)}>
        { this.renderButton(this.props.label, this.state.open) }
        { this.renderChildren(this.state.open) }
      </div>
    );
  }
}

class MagicDate extends Component {
  constructor(props) {
    super(props);
    this.onUpdateMe = this.updateMe.bind(this);

    this.initState({
      currentTime: new Date()
    });

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
    let value = Util.friendlyDate(this.props.date, this.props);

    return (
      <span className="pyr-magic-date">{ value }</span>
    );
  }
}

class MagicFuzzyDate extends MagicDate {
  render() {
    let value = Util.fuzzyDate(this.props.date);
    
     return (
        <span className="pyr-magic-fuzzy-date">{ value }</span>
      );
  }
}

const NoticeContextTypes = {
  setNotice: PropTypes.func,
  notice: PropTypes.node
};

class CSSAnimation extends Component {
  constructor(props) {
    super(props)
    this.initState({
      go: false
    });
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
  
    return results;
  }
  
  renderInner(state) {
    let clazzes = this.toClassNames(this.props.classNames, state, this.props.appear, this.props.in);

    let stuff = Pyr.Util.childrenWithProps(this.props.children, {className: clazzes.toString(), key: "fade-inner"})[0];

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

    this.initState({
      notice: null
    });

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

class NoticeReceiver extends Component {
  static contextTypes = NoticeContextTypes;

  constructor(props) {
    super(props);

    this.initState({
      show: false
    });

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

class Modal extends Component {
  constructor(...args) {
    super(...args);

    this.initState({
      open : false
    });

    this.onClose = this.close.bind(this);
    this.onOpen = this.open.bind(this);
    this.onKeyPress = this.keyPress.bind(this);
    this.onNoProp = this.noProp.bind(this);
  }

  isOpen() {
    return this.props.open || this.state.open || false;
    //return this.state.open;
  }

  componentDidMount() {
    document.addEventListener("keydown", this.onKeyPress);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.onKeyPress);
  }

  open() {
    this.setState({
      open: true
    });

    if (this.props.onShow) {
      this.props.onShow();
    }
  }

  close() {
    this.setState({
      open: false
    });

    if (this.props.onClose) {
      this.props.onClose();
    }
  }

  noProp(e) {
    e.stopPropagation();
  }

  keyPress(e) {
    //console.log(e.keyCode);
    if (e.keyCode === ESCAPE_KEY) {
      e.preventDefault();
      this.close(e);
    }
  }

  title() {
    return "";
  }

  renderTitle() {
    return (
      <div className="title mr-auto" >
        <h3 className="">{this.title()}</h3>
      </div>
    );
  }

  renderInner() {
  }

  render() {
    if (!this.isOpen()) {
      return null;
    }

    return (
      <div
        className={ClassNames("pyr-app-modal").push(this.props.className)}
        ref={(node) => this.me = node }
        onClick={this.onClose}
      >
          <div className="pyr-app-modal-content"
              onClick={this.noProp}
          >
            <div className="pyr-app-modal-header flx-row">
              { this.renderTitle() }
              <IconButton name="times" className="times ml-auto" onClick={this.onClose}/>
            </div>
            <div className="pyr-app-modal-inner" >
              { this.renderInner() }
            </div>
          </div>
      </div>
    );
  }
}

class NavBar extends Component {
  renderHeaderLeft() {
    return null;
  }

  renderHeaderRight() {
    return (
          <div className="col navbar-nav" >
            <BackButton name="close"
              className="ml-auto nav-item"
              ><IconButton name="arrow-left">Back</IconButton></BackButton>
          </div>
    );
  }

  render() {
    return (
        <div 
          className="navbar flx-row controls align-items-center"
          onClick={this.props.onClick}
        >
          { this.renderHeaderLeft() }
          { this.renderHeaderRight() }
        </div>
    );
  }
}


class FullScreen extends Component {
  constructor(props) {
    super(props);

    this.onClose = this.close.bind(this);
  }

  close(e) {
    if (e) {
      e.preventDefault();
    }
    if (this.props.onClose) {
      this.props.onClose();
    }
  }

  renderHeader() {
    return null;
  }

  renderNavBar() {
    if (this.props.noNavBar) {
      return null;
    }

    return (
      <NavBar onClick={this.onClose} />
    );
  }

  renderInner() {
    let extra = this.props.asPage ? "flx-col flx-1" : "";

    return (
      <div 
        className={ClassNames("pyr-fullscreen").push(this.props.className).push(extra)}
        ref={(node) => this.me = node }
      >
        { this.renderNavBar() }
        { this.renderHeader() }
        <div className={ClassNames("content").push(extra)}>
          {this.props.children}
        </div>
      </div>
    );
  }

  render() {
    return this.renderInner();
  }
}

class BackgroundImage extends Component {
  render() {
    let inlineStyle = {
      backgroundImage: "url(" + (this.props.url.toString()) + ")",
      backgroundRepeat: "no-repeat",
      backgroundAttachment: "local",
      backgroundPosition: "center",
      backgroundSize: "contain",
    };

    return (
      <div style={inlineStyle} className={this.props.className}>
        {this.props.children}
      </div>
    );
  }
}

const Fifty = (props) => (
  <div className={ClassNames("fifty").push(props.className)}>
    { props.children }
  </div>
);

const PassThru = (props) => (
  props.children
);

const UI = { 
  RouterContextTypes,
  RouterProvider,
  RouterReceiver,
  RouterProps,
  RouteURL,

  NoticeContextTypes,
  NoticeProvider,
  NoticeReceiver,

  Icon,
  Burger,
  Label,
  FancyLabel,
  FancyButton,
  SmallLabel,
  ButtonLabel,
  MagicFuzzyDate,
  MagicDate,
  Loading,
  Button,
  PrimaryButton,
  BackButton,
  FlatButton,
  IconButton,
  Fade,
  FullScreen,
  Modal,
  Slide,
  Empty,
  ChildSelector,
  PassThru,
  Image,
  ImageButton,
  Collapse,
  ImageFile,
  DIV,

  Scroll,
  PieChart,

  BackgroundImage,
  Fifty,
};

export default UI;
