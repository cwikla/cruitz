import React, {
} from 'react';

import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';

import Pyr from '../../pyr/pyr';

const STATE_NEW = 0;
const STATE_UNLOCKED = 100;
const STATE_ENGAGED = 200;
const STATE_OFFER = 300;
const STATE_HIRED = 1000;

const STATE_REJECTED = -100;
const STATE_SPAM = -666;
const STATE_RECALLED = -1000;
const STATE_CANCELED = -5000;

const ID_TO_STATE = {
  [STATE_NEW]: { name: "New", action: "New"},
  [STATE_UNLOCKED] : {name: "Unlocked", action: "Unlock"},
  [STATE_ENGAGED] : {name: "Engaged", action: "Engage"},
  [STATE_OFFER] : {name: "Offer", action: "Offer"},
  [STATE_HIRED] : {name: "Hired", action: "Hire"},

  [STATE_REJECTED] : {name: "Rejected", action: "Reject"},
  [STATE_SPAM] : {name: "SPAM",action: "SPAM"},
  [STATE_RECALLED] : {name: "Recalled", action: "Recall"},
  [STATE_CANCELED] : {name: "Cancelled", action: "Cancel"},
};

const NEXT_STATES = {
  [STATE_NEW]: [STATE_UNLOCKED, STATE_REJECTED],
  [STATE_UNLOCKED]: [STATE_OFFER, STATE_REJECTED],
  [STATE_OFFER]: [STATE_HIRED, STATE_REJECTED],
  [STATE_HIRED]: [STATE_REJECTED],

  [STATE_REJECTED]: [STATE_NEW],
  [STATE_SPAM]: [],
  [STATE_RECALLED]: [],
  [STATE_CANCELED]: [],
};

function states() {
  let all = Object.keys(ID_TO_STATE).map(x => parseInt(x));
  return all.sort();
}


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

const Bubble = (props) => (
  <div className="state-bubble state background">
    { toName(props.state)[0] }
  </div>
);

const State = {
  states,
  toName,
  toAction,
  toClassName,
  nextIsValid,
  nexts,
  Bubble,
};

export default State;
