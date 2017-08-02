
import React, {
  Component,
} from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';

const ONE_MINUTE = (60 * 1000);
const ONE_HOUR = (ONE_MINUTE * 60);
const ONE_DAY = (ONE_HOUR * 24);
const TWO_DAYS = (ONE_DAY * 2);

class ClassNamesObj  {
  constructor(...args) {
    this.arr = [];
    this.push(...args);
  }
  
  push(...args) {
    for(let val of args) {
      this.innerPush(val);
    }
    return this;
  }

  concat(...args) {
    return new ClassNamesObj(this.arr).push(...args);
  }

  innerPush(val) {
    if (typeof val == 'string') {
      val = val.split(" ");
    }
    if (!Array.isArray(val)) {
      val = [ val ];
    }
    val = val.slice();
    this.arr = this.arr.concat(val);
    return this;
  }
  
  toString() {
    return this.arr.join(" ");
  }
  
  classes() {
    return this.toString();
  }
  
  clear() {
    this.arr = [];
  }
}

function ClassNames(...args) {
  return new ClassNamesObj(...args);
}

function summarize(arg, maxLength=300, ellipses=true) {
  if (arg.length <= maxLength) {
    return arg;
  }
  
  let cut = new RegExp(/\s/, "gi");
  
  arg = arg.slice(0, maxLength-3); // For ellipses
  let pieces = arg.split(cut);
  pieces = pieces.slice(0, pieces.length-1);
  let result = pieces.join(" ");

  if (result.length < maxLength/3) { // too small
    result = arg.slice(0, maxLength/2);
  }
  result = result + "...";

  return result;
}

function friendlyDate(date, longOnly=false) {

  date = new Date(date); // in case it's a string
  let now = new Date();
  
  let diff = (now - date); // to seconds

  if ((diff >= TWO_DAYS) || longOnly) {
    let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true };
    return (
      <span className="friendly-date"><span className="hidden-sm-down">{date.toLocaleString("en-US", options)}</span><span className="hidden-md-up">{date.toLocaleDateString("en-US")}</span></span>
    );
  }

  var result = null;
  if (diff < ONE_MINUTE) {
    result = "Moments ago";
  } else
  if (diff < ONE_HOUR) {
    result = Math.floor(diff / ONE_MINUTE) + " minutes ago";
  } else
  if (diff < ONE_DAY) {
    result = "Today at " + date.toLocaleString("en-US", {hour: 'numeric', minute: 'numeric'});
  }
  result = result || "Yesterday at " + date.toLocaleString("en-US", {hour: 'numeric', minute: 'numeric'});

  return (<span className="friendly-date">{result}</span>);
  
}

function capFirstLetter(string) {
    string = string.toLowerCase();
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function childrenWithProps(children, props, kidType) {
  return React.Children.map(children, (child) => {
    if (!kidType || child.type == kidType) {
      return React.cloneElement(child, props);
    }
    return child;
  });
}

function propsRemove(props, ripOut) {
  let tmp = Object.assign({}, props);
  ripOut.forEach((a) => {
    delete tmp[a];
  });
  return tmp;
}

function propsMerge(initProps, props) {
  let result = {};
  let allClasses = ClassNames(initProps.className, props.className);

  Object.assign(result, initProps);
  Object.assign(result, props);

  result.className = allClasses.classes();

  return result;
}

function propsMergeClassName(props, className) {
  return propsMerge({className}, props);
}

const Util = {
  ClassNames,
  summarize,
  friendlyDate,
  capFirstLetter,
  childrenWithProps,
  propsRemove,
  propsMerge,
  propsMergeClassName,
};

export default Util;
