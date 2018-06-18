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
  [STATE_NEW]: { name: "New", action: "New", icon: "plus-circle"},
  [STATE_UNLOCKED] : {name: "Unlocked", action: "Unlock", icon: "unlock"},
  [STATE_ENGAGED] : {name: "Engaged", action: "Engage", icon: "dot-circle"},
  [STATE_OFFER] : {name: "Offer", action: "Offer", icon: "info-circle"},
  [STATE_HIRED] : {name: "Hired", action: "Hire", icon: "user-circle"},

  [STATE_REJECTED] : {name: "Rejected", action: "Reject", icon: "minus-circle"},
  [STATE_SPAM] : {name: "SPAM",action: "SPAM", icon: "ban"},
  [STATE_RECALLED] : {name: "Recalled", action: "Recall", icon: "exclamation-circle"},
  [STATE_CANCELED] : {name: "Cancelled", action: "Cancel", icon: "times-circle"},
};

const NEXT_STATES = {
  [STATE_NEW]: [STATE_UNLOCKED, STATE_REJECTED],
  [STATE_UNLOCKED]: [STATE_OFFER, STATE_REJECTED],
  [STATE_OFFER]: [STATE_HIRED, STATE_REJECTED],
  [STATE_HIRED]: [],

  [STATE_REJECTED]: [],
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

const UnlockedBubble = (props) => (
  <Pyr.UI.PassThru>
    <div className="icon juan"><Pyr.UI.Icon name="unlock" data-fa-transform="shrink-8" data-fa-mask="fas fa-circle" /></div>
    <div className={ClassNames("label")}>{ toName(props.state) }</div>
  </Pyr.UI.PassThru>
);

const StateBubble = (props) => (
  <Pyr.UI.PassThru>
    <div className="icon "><Pyr.UI.Icon name={ID_TO_STATE[props.state].icon} /></div>
    <div className={ClassNames("label")}>{ toName(props.state) }</div>
  </Pyr.UI.PassThru>
);

const NoneBubble = (props) => (
  <div className="state-bubble flx-col none">
    <div className="icon"><Pyr.UI.Icon regular={true} name="circle" /></div>
    <div className={ClassNames("label")}>&nbsp;</div>
  </div>
);

class Bubble extends Component {
  render() {
    let TheBubble = this.props.state == STATE_UNLOCKED ? UnlockedBubble : StateBubble;

    return (
      <div className={"state-bubble flx-col " + toClassName(this.props.state)}>
        <TheBubble {...this.props} />
      </div>
    );
  }
}

const Nibble = (props) => (
  <div className={ClassNames("nibble").push(toClassName(props.state))} >&mdash;&mdash;</div>
);

class Bar extends Component {
  render() {
    let states = (this.props.candidateStates || []).reduce((arr, s) => {
      arr.push(s.state);
      return arr;
    }, [ STATE_NEW ]);

    //console.log("STATES");
    //console.log(states);

    let rest = Pyr.Util.propsRemove(this.props, ["state", "candidateStates"]);

    return (
        <div {...Pyr.Util.propsMergeClassName(rest, ClassNames("flx-row state-bar").push(this.props.className))}>
          { states.map(astate => {
              return (
                <Pyr.UI.PassThru key={"sta-"+astate} className="">
                  <Bubble state={astate} current={this.props.state} />
                  { NEXT_STATES[astate].length == 0 ? null : <Nibble state={astate} current={this.props.state} /> }
                </Pyr.UI.PassThru>
              );
            })
          }
          { NEXT_STATES[this.props.state].length == 0 ? null : <NoneBubble /> }
        </div>
    );
  }
}

const State = {
  states,
  toName,
  toAction,
  toClassName,
  nextIsValid,
  nexts,
  Bubble,
  NoneBubble,
  Bar,
  STATE_UNLOCKED,
  STATE_CANCELED,
};

export default State;
