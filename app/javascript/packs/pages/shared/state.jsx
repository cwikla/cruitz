import React, {
} from 'react';

import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';

import Pyr from '../../pyr/pyr';


const ACCEPTED_STATE = 100;
const REJECTED_STATE = -100;

const ID_TO_STATE = {
  0: { name: "New", action: "New"},
  100 : {name: "Accepted", action: "Accept"},
  "-100" : {name: "Passed", action: "Pass"},
  1000 : {name: "Hired", action: "Hire"},
  "-666" : {name: "SPAM",action: "SPAM"},
  "-1000" : {name: "Recalled", action: "Recall"},
  "-5000" : {name: "Cancelled", action: "Cancel"},
};

const NEXT_STATES = {
  0: [100, -100],
  100: [1000, -100],
  "-100": [100],
  1000: [-1000],
  "-666": [100],
  "-5000": [],
};


function toName(sid) {
  if (sid in ID_TO_STATE) {
    return ID_TO_STATE[sid].name;
  }

  return "Unknown";
}

function toAction(sid) {
  if (sid in ID_TO_STATE) {
    return ID_TO_STATE[sid].action;
  }

  return "Unknown";
}

function toClassName(sid) {
  let name = toName(sid);
  return "state "  + Pyr.Util.squish(name).toLowerCase();
}

function nextIsValid(sid) {
  let nexts = NEXT_STATES[sid];
  return nexts ? sid in nexts : false;
}

function nexts(sid) {
  return NEXT_STATES[sid];
}

const State = {
  toName,
  toAction,
  toClassName,
  nextIsValid,
  nexts
};

export default State;
