import React, {
} from 'react';

import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';

import {
  Link,
  Redirect
} from 'react-router-dom';


import Pyr, {
  Component
} from '../../pyr/pyr';
const ClassNames = Pyr.ClassNames;


class Primary extends Component {
  render() {
    let head = this.props.head;
    let position = this.props.position;

    let clazzes = ClassNames("sub-section primary");
    if (this.props.locked) {
      clazzes.push("locked");
    }

    return (
      <div className={clazzes}>
        <div className="name">{head.first_name} {head.last_name}</div>
        <div className="email">{head.email}</div>
        <div className="phone-number">{head.phone_number}</div>

      </div>
    );
  }
}

class SocialLinks extends Component {
  render() {
    let clazzes = ClassNames("sub-section social");
    if (this.props.locked) {
      clazzes.push("locked");
    }

    return (
        <div className={clazzes}>
          <Pyr.UI.Icon name="linkedin-square" className="linkedin-square"/>
          <Pyr.UI.Icon name="github" className="github"/>
          <Pyr.UI.Icon name="dribbble" className="dribble"/>
          <Pyr.UI.Icon name="quora" className="quora"/>
        </div>
    );
  }
}

class Skills extends Component {
  render() {
    let skills = ["C++", "C", "Quality Insurance", "Cool Skill", "Skill Me"];
    if (!skills || skills.length == 0) {
      return null;
    }

    let ts =  skills.map((skill, pos) => {
      let sid = Math.random();
      let key = "skill-" + sid;
      return (
        <div
          key={key}
          className="skill"
        >{skill}</div>
      );
    });

    return (
      <div className="skills sub-section flx-row flx-wrap">
        { ts }
      </div>
    );
  }
}

class WorkHistory extends Component {
  render() {
    let workHistory = this.props.work_history;

    workHistory = [1,2,3,4,5,6];

    let guts = workHistory.map((item, pos) => {
      return (
        <div className="work" key={"work-"+item}>
          <div className="year">2015-Current</div>
          <div className="company">My Company</div>
          <div className="current_title">Director Engineering</div>
          <div className="description">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</div>
        </div>
      );
    });

    return (
      <div className="work-history sub-section">
        { guts }
      </div>
    );
  }
}

const HeadDetails = {
  Primary,
  SocialLinks,
  Skills,
  WorkHistory,
};

export default HeadDetails;
