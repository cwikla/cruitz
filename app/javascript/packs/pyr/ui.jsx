

import React from 'react';
import PropTypes from 'prop-types';
import { 
  Transition,
  CSSTransition,
} from 'react-transition-group';

import BaseComponent from './base';
import Util from './util';
import Scroll from './scroll'
import PieChart from './pie_chart';
import Attachment from './attachment';

import {
  Route,
  Redirect
} from 'react-router-dom';


const ClassNames = Util.ClassNames;

const DURATION_TIME = 300;

const SHOW_TIME = 1500;

const ESCAPE_KEY = 27;


class Empty extends BaseComponent {
  render() {
    return null;
  }
}

class ChildSelector extends BaseComponent {

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

class RouterReceiver extends BaseComponent {
  static contextTypes = RouterContextTypes;

  constructor(props) {
    super(props);

    this.onGoBack = this.goBack.bind(this);
  }

  goBack() {
    this.context.history.goBack();
  }
}

class RouterProvider extends BaseComponent {
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

const Icon = (props) => (
  <i {...Util.propsMergeClassName(props, "fa fa-" + props.name)}/>
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

class FlatButton extends BaseComponent {
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

class ImageFile extends BaseComponent {
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

    if (!Attachment.isImageType(this.props.file || this.props.contentType)) {
      return (
        <Icon name={"file-" + ftype + "-o"}/>
      );
    }

    let rest = Util.propsRemove(this.props, ["file", "url", "contentType"]);
    
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

class Collapse extends BaseComponent {
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

class MagicDate extends BaseComponent {
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
      <span>{ value }</span>
    );
  }
}

const NoticeContextTypes = {
  setNotice: PropTypes.func,
  notice: PropTypes.node
};

class CSSAnimation extends BaseComponent {
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

class NoticeProvider extends BaseComponent {
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

class NoticeReceiver extends BaseComponent {
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

class Modal extends BaseComponent {
  constructor(...args) {
    super(...args);

    this.initState({
      open : false
    });

    this.onClose = this.close.bind(this);
    this.onKeyPress = this.keyPress.bind(this);
    this.onNoProp = this.noProp.bind(this);
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

  renderInner() {
  }

  render() {
    if (!this.state.open) {
      return null;
    }

    return (
      <div
        className={ClassNames("pyr-app-modal").push(this.props.className)}
        ref={(node) => this.me = node }
        onClick={this.onClose}
      >
          <div className="modal-border"
              onClick={this.noProp}
          >
            <IconButton name="close" className="close" onClick={this.onClose}/>
            <div className="model-inner"
            >
              { this.renderInner() }
            </div>
          </div>
      </div>
    );
  }
}


class FullScreen extends BaseComponent {
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

  renderLeft() {
    return null;
  }

  renderNavBar() {
    if (this.props.noNavBar) {
      return null;
    }

    return (
        <div 
          className="navbar flx-row controls align-items-center"
          onClick={this.onClose}
        >
          { this.renderLeft() }
          <div className="col navbar-nav" >
            <BackButton name="close"
              className="ml-auto nav-item"
              ><IconButton name="arrow-left">Back</IconButton></BackButton>
          </div>
        </div>
    );
  }

  renderInner() {
    return (
      <div 
        className={ClassNames("pyr-fullscreen flx-col flx-1").push(this.props.className)}
        ref={(node) => this.me = node }
      >
        { this.renderNavBar() }
        { this.renderHeader() }
        <div className="content">
          {this.props.children}
        </div>
      </div>
    );
  }

  render() {
    return this.renderInner();
  }
}

const PassThru = (props) => (
  props.children
);

const UI = { 
  RouterContextTypes,
  RouterProvider,
  RouterReceiver,

  NoticeContextTypes,
  NoticeProvider,
  NoticeReceiver,

  Icon,
  Label,
  FancyLabel,
  FancyButton,
  SmallLabel,
  ButtonLabel,
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
  ImageButton,
  Collapse,
  ImageFile,

  Scroll,
  PieChart,
};

export default UI;
