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

const Bubble = (props) => (
  <div className="state-bubble flx-col">
    <Pyr.UI.Icon regular={props.state < 0 ? false : true} name={props.state < 0 ? "minus-circle" : "check-circle"} className={toClassName(props.state)} />
    <div className={ClassNames("label").push(toClassName(props.state))}>{ toName(props.state) }</div>
  </div>
);

const NoneBubble = (props) => (
  <div className="state-bubble flx-col">
    <Pyr.UI.Icon regular={true} name="circle" />
    <div className={ClassNames("label")}>&nbsp;</div>
  </div>
);

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
                  <Bubble state={astate} current={this.props.state}/>
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
};

export default State;
