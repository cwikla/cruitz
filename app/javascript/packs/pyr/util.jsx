
import React, {
  Component,
} from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';

import classNames from 'classnames';

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
  capFirstLetter,
  childrenWithProps,
  propsRemove,
  propsMerge,
  propsMergeClassName,
  mergeClassName
};

export default Util;
