
import React, {
  Component,
} from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';

import classNames from 'classnames';

const ONE_MINUTE = (60 * 1000);
const ONE_HOUR = (ONE_MINUTE * 60);
const ONE_DAY = (ONE_HOUR * 24);
const TWO_DAYS = (ONE_DAY * 2);

export function friendlyDate(date) {

  date = new Date(date); // in case it's a string
  let now = new Date();
  
  let diff = (now - date); // to seconds

  if (diff < ONE_HOUR) {
    diff = (diff / 60 / 60) + " minutes ago";
  }
  if (diff < ONE_DAY) {
    return date.toLocaleString("en-US", {hour: 'numeric', minute: 'numeric'});
  }
  else
  if (diff < TWO_DAYS) {
    return "Yesterday at " + date.toLocaleString("en-US", {hour: 'numeric', minute: 'numeric'});
  }
  
  let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true };
  return (
    <span className="friendly-date"><span className="hidden-sm-down">{date.toLocaleString("en-US", options)}</span><span className="hidden-md-up">{date.toLocaleDateString("en-US")}</span></span>
  );
}

export function capFirstLetter(string) {
    string = string.toLowerCase();
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export function childrenWithProps(children, props, kidType) {
  return React.Children.map(children, (child) => {
    if (!kidType || child.type == kidType) {
      return React.cloneElement(child, props);
    }
    return child;
  });
}

export function propsRemove(props, ripOut) {
  let tmp = Object.assign({}, props);
  ripOut.forEach((a) => {
    delete tmp[a];
  });
  return tmp;
}

export function mergeClassName(a, b) {
  a = a || "";
  b = b || "";
  return classNames(a, b);
}

export function propsMerge(initProps, props) {
  let result = {};
  let allClasses = mergeClassName(initProps.className, props.className);

  Object.assign(result, initProps);
  Object.assign(result, props);

  result.className = allClasses;

  return result;
}

export function propsMergeClassName(props, className) {
  return propsMerge({className}, props);
}

const Util = {
  friendlyDate,
  capFirstLetter,
  childrenWithProps,
  propsRemove,
  propsMerge,
  propsMergeClassName,
  mergeClassName
};

export default Util;
