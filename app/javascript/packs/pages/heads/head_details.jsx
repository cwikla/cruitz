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
    let head = this.props.head;

    let experiences = (head.experiences || []).sort((x,y) => {
      return (x.year_start - y.year_start);
    });

    let guts = experiences.map((exp, pos) => {
      return (
        <div className="work" key={"work-"+exp.id}>
          <div className="year">{exp.year_start}-{exp.year_end || "Current"}</div>
          <div className="company">{exp.place}</div>
          <div className="current_title">{exp.title}</div>
          <div className="description">{exp.description}</div>
        </div>
      );
    });

    let clazzes = ClassNames(this.props.className, "work-history");

    return (
      <HeadComponent {...this.props} className={clazzes}>
        { guts }
      </HeadComponent>
    );
  }
}

class Full extends Component {
  render() {
    return (
      <Head>
        <Name {...this.props} />
        <Primary {...this.props}/>
        <Address {...this.props} />
        <SocialLinks {...this.props} />
        <Skills {...this.props} />
        <WorkHistory {...this.props} />
      </Head>
    )
  }
}

class Stats extends Component {
  render() {
    let rest = Pyr.Util.propsRemove(this.props, "head");
    let head = this.props.head;

    let views = 22;

    let newCandy = 2;
    let acceptedCandy = 8;
    let rejectedCandy = 2;

    let total = newCandy + acceptedCandy + rejectedCandy;

    return (
      <div {...Pyr.Util.propsMergeClassName(rest, "head-stats flx-col")} >
        <div className="header">Stats</div>
        <div className="guts">
          <div className="views">{views} Views</div>
          <div className="pie">
            <Pyr.UI.PieChart
              className="ml-auto mr-auto"
              slices={[
                { color: 'orange', value: newCandy },
                { color: 'green', value: acceptedCandy },
                { color: 'red', value: rejectedCandy },
              ]}
            />
          </div>

          <div className="candy ml-auto mr-auto">
            <div className="total">{total} Applications</div>
            <div className="accepted">{acceptedCandy} Accepted</div>
            <div className="rejected">{rejectedCandy} Rejected</div>
          </div>
        </div>
      </div>
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
  Full,
  Stats,
};

export default HeadDetails;
