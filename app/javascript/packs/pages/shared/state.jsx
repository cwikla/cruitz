import React, {
} from 'react';

import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';

import Pyr, {
  Component
} from '../../pyr/pyr';
const ClassNames = Pyr.ClassNames;


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

const Bubble1 = (props) => (
  <div className="state-bubble flx-col">
    <Pyr.UI.Icon regular={true} name={props.state <= props.current ? "check-circle" : "circle"} className={(props.state <= props.current) ? toClassName(props.state) : ""} />
    <div className={ClassNames("label").push((props.state <= props.current) ? toClassName(props.state) : "")}>{ toName(props.state) }</div>
  </div>
);

const Bubble2 = (props) => (
  <div className={ClassNames("state-bubble two flx-col").push(toClassName(props.state)).push("background")}>
    <div className="mt-auto mb-auto ml-auto mr-auto">{ toName(props.state) }</div>
  </div>
);

const Bubble = Bubble1;

const CurrentBubble = (props) => (
  <Bubble state={props.state} current={props.state} />
);

const Nibble = (props) => (
  <div className={ClassNames("nibble").push((props.state <= props.current) ? toClassName(props.state) : "")} >&mdash;&mdash;</div>
);


const Bar = (props) => (
        <div className={ClassNames("flx-row state-bar").push(props.className)}>
          <Bubble state={STATE_NEW} current={props.state}/>
          <Nibble state={STATE_NEW} current={props.state} />

          <Bubble state={STATE_UNLOCKED} current={props.state}/>

          <Nibble state={STATE_OFFER} current={props.state} />
          <Bubble state={STATE_OFFER} current={props.state}/>

          <Nibble state={STATE_HIRED} current={props.state} />
          <Bubble state={STATE_HIRED} current={props.state}/>
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
  CurrentBubble,
  Bar,
};

export default State;
