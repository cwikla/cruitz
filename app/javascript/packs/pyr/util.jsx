
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

function isToday(date, offsetDays=0) {
  let start = new Date();
  if (offsetDays) {
    start = new Date(start.getTime() - (offsetDays * 86400000));
  }
  start.setHours(0, 0, 0, 0);

  let end = new Date(start);
  end.setHours(23, 59, 59, 999);

  return ((date.getTime() >= start.getTime()) && (date.getTime() <= end.getTime()));
}

function isYesterday(date) {
  return isToday(date, 1);
}

function friendlyDate(date, longOnly=false) {

  date = new Date(date); // in case it's a string
  let now = new Date();
  
  let diff = (now - date); // to seconds
  let longOptions = { weekday: 'short', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true };
  if (now.getYear() != date.getYear()) {
    longOptions.year = 'numeric';
  }

  let timeOptions = { hour: 'numeric', minute: 'numeric', hour12: true };
  if (!longOnly) {
    var result = null;
    if (diff < ONE_HOUR) {

      if (diff < ONE_MINUTE) {
        result = "Moments ago";

      } else {

        result = Math.floor(diff / ONE_MINUTE) + " minutes ago";
      }

      return (
        <span className="friendly-date"><span className="hidden-sm-down">{result}</span><span className="hidden-md-up">{date.toLocaleString("en-US", timeOptions)}</span></span>
      );
    } 
    else if (isToday(date)) {
      result = "Today at " + date.toLocaleString("en-US", timeOptions);

      timeOptions = { hour: 'numeric', minute: 'numeric', hour12: true };

      return (
        <span className="friendly-date"><span className="hidden-sm-down">{result}</span><span className="hidden-md-up">{date.toLocaleString("en-US", timeOptions)}</span></span>
      );

    } else if (isYesterday(date)) {

      result = "Yesterday at " + date.toLocaleString("en-US", timeOptions);

      return (
        <span className="friendly-date"><span className="hidden-sm-down">{result}</span><span className="hidden-md-up">{date.toLocaleDateString("en-US")}</span></span>
      );
    }
  }


  return (
    <span className="friendly-date"><span className="hidden-sm-down">{date.toLocaleString("en-US", longOptions)}</span><span className="hidden-md-up">{date.toLocaleDateString("en-US")}</span></span>
  );
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
