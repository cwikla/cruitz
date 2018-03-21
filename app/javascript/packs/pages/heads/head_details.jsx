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

class Head extends Component {
  render () {
    return (
      <div {...Pyr.Util.propsMergeClassName(this.props, "head")}>
        { this.props.children }
      </div>
    );
  }
}

class HeadComponent extends Component {
  render() {
    let head = this.props.head;
    let position = this.props.position;

    let clazzes = ClassNames("head-details", this.props.className);

    if (this.props.locked) {
      clazzes.push("locked");
    }

    return (
      <div className={clazzes}>
        { this.props.children }
      </div>
    );
  }
}

class Name extends Component {
  render() {
    let head = this.props.head;

    let clazzes = ClassNames(this.props.className, "name");

    return (
      <HeadComponent {...this.props} className={clazzes}>
        {head.first_name} {head.last_name}
      </HeadComponent>
    );
  }
}


class Primary extends Component {
  render() {
    let head = this.props.head;

    let clazzes = ClassNames(this.props.className, "primary");

    return (
      <HeadComponent {...this.props} className={clazzes}>
        <div className="email">{head.email}</div>
        <div className="phone-number">{head.phone_number}</div>
      </HeadComponent>
    );
  }
}

class Address extends Component {
  render() {
    let head = this.props.head;

    let clazzes = ClassNames(this.props.className, "address");

    let street = "1060 W. Addison";
    let city = "Chicago";
    let state = "IL";
    let country = "US";

    return (
      <HeadComponent {...this.props} className={clazzes}>
        <div className="street">{ street }</div>
        <div className="city">{ city }, { state }</div>
      </HeadComponent>
    );
  }
}

class SLink extends Component {
  render() {
    return (
      <div className="social-link">
        <Pyr.UI.Icon name={this.props.name} className={this.props.name} />
      </div>
    );
  }
}

class SocialLinks extends Component {
  render() {
    let head = this.props.head;

    let clazzes = ClassNames(this.props.className, "social-links flx-row flx-wrap");

    return (
        <HeadComponent {...this.props} className={clazzes}>
          <SLink name="linkedin-square" />
          <SLink name="github" />
          <SLink name="dribbble" />
          <SLink name="quora" />
        </HeadComponent>
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

    let head = this.props.head;

    let clazzes = ClassNames(this.props.className, "skills flx-row flx-wrap");

    return (
      <HeadComponent {...this.props} className={clazzes}>
        { ts }
      </HeadComponent>
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

    let head = this.props.head;

    let clazzes = ClassNames(this.props.className, "work-history");

    return (
      <HeadComponent {...this.props} className={clazzes}>
        { guts }
      </HeadComponent>
    );
  }
}

const HeadDetails = {
  Head,
  Name,
  Address,
  Primary,
  SocialLinks,
  Skills,
  WorkHistory,
};

export default HeadDetails;
