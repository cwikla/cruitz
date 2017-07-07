
import React, { 
  Component
} from 'react';

import PropTypes from 'prop-types';

import ReactDOM from 'react-dom';

import { 
  render 
} from 'react-dom';

import classNames from 'classnames';

export function capFirstLetter(string) {
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

export function propsMerge(props, moreProps) {
  let result = {};

  let propsClassName = props.className || "";
  let morePropsClassName = moreProps.className || "";

  Object.assign(result, props);
  Object.assign(result, moreProps);

  result.className = classNames(propsClassName, morePropsClassName);

  return result;
}

export function propsMergeClassName(props, className) {
  return propsMerge(props, {className});
}

const Util = {
  capFirstLetter,
  childrenWithProps,
  propsRemove,
  propsMerge,
  propsMergeClassName
};

export default Util;
