import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';

import {
  Link,
} from 'react-router-dom';

import Pyr, {
  Component
} from '../../pyr/pyr';

const ClassNames = Pyr.ClassNames;

import Loader from '../loader/loader';
import WebLink from '../shared/web_link';

import Avatar, {
} from '../shared/avatar';

import State from '../shared/state';

import {
  RANGES
} from '../const';

const Lock = (props) => (
  <div className="flx-col">
    { /* Nice try! There isn't any candidate information here!  */ }
    <Pyr.UI.Icon name="lock" />
  </div>
);

class CVHeader extends Component {
  isLocked() {
    return this.props.locked;
  }

  render() {
    if (!this.props.candidate) {
      return <Pyr.UI.Loading />
    }

    let candidate = this.props.candidate;
    let job = this.props.job;

    let fullName = candidate.first_name + " " + candidate.last_name;
    let phoneNumber = candidate.phone_number || "No Phone";
    let email = candidate.email || "No Email";
    let salary = candidate.salary || "No Salary";

    let company = candidate.company || "No Company";
    let description = candidate.description || "No Description";

    let locked = this.isLocked();

    if (locked) {
      fullName = Pyr.Util.scramble("George Smith");
      phoneNumber = Pyr.Util.scramble("415-555-1212");
      email = Pyr.Util.scramble("georgith@george.com");
      salary = Pyr.Util.scramble("60,000");
    }

    let clazzes = ClassNames("cv-header flx-col flx-noshrink");
    let extra = ClassNames(locked ? "locked" : "");

    let ALock = !locked ? Pyr.UI.Empty : Lock;

/*
    console.log("HMMM");
    console.log(candidate.unlocked_at);
    console.log(!!candidate.unlocked_at);
*/

    return (
      <div className={clazzes} >
        <div className="flx-row flx-1">
          <div className={ClassNames(extra).push("name mr-auto")}>{fullName}</div>
        </div>
        <div className="flx-row flx-1 info">
          <div className={ClassNames(extra).push("phone-number mr-auto flx-1")}>{phoneNumber}</div>
          <div className={ClassNames(extra).push("email mr-auto flx-1")}>{email}</div>
        </div>
        <div className="flx-row flx-1 info">
          <div className={ClassNames(extra).push("salary mr-auto flx-1")}>{salary}</div>
        </div>
        <div className="flx-row-stretch info social-links">
          <WebLink.Links links={candidate.links} locked={locked} />
        </div>
        <div className={ClassNames(extra).push("lock ml-auto mr-auto mt-auto mb-auto")}><ALock /></div>
      </div>
    );
  }
}

const ExperienceItem = (props) => (
  <div className="item">
    <div className="title">{props.item.title} @ {props.item.place}</div>
    <div className="years">{props.item.year_start} - {props.item.year_end || "Current"}</div>
    <div className="description">{props.item.description}</div>
  </div>
);

class Experience extends Component {
  render() {
    //console.log("EXPS");
    //console.log(this.props.experiences);

    if (!this.props.experiences || this.props.experiences.length == 0) {
      return (
        <div className="none">No Experience</div>
      );
    }

    let experiences = this.props.experiences;

    return (
      <div id="experience" className="cv-section experience">
      {
        experiences.map( (item, pos) => {
          return (<ExperienceItem item={item} key={"exp"+pos}/>);
        })
      }
      </div>
    );
  }
}

const EducationItem = (props) => (
  <div className="item">
    <div className="degree">{props.item.title} @ {props.item.place}</div>
    <div className="years">{props.item.year_start} - {props.item.year_end || "Current"}</div>
  </div>
);

class Education extends Component {
  render() {
    if (!this.props.educations || this.props.educations.length == 0) {
      return null;
    }

    let educations = this.props.educations;

    return (
      <div id="education" className="cv-section education">
      {
        educations.map( (item, pos) => {
          return (<EducationItem item={item} key={"ed"+pos}/>);
        })
      }
      </div>
    );
  }
}

class Skills extends Component {
  render() {
    if (!this.props.skills || this.props.skills.length == 0) {
      return (
        <div className="none">No Skills</div>
      );
    }

    let skills = this.props.skills;

    return (
      <div id="skills" className="cv-section skills flx-row flx-wrap">
        {
          skills.map( (item, pos) => {
            return (<div className="skill flx-0 flx-nowrap" key={"sk"+item.id}>{item.name}</div>);
          })
        }
      </div>
    );
  }
}

class Uploads extends Component {
  render() {
    if (!this.props.uploads || this.props.uploads.length == 0) {
      return (
        <div className="none">None</div>
      );
    }

    let uploads = this.props.uploads;

    return (
      <div id="uploads" className="cv-section uploads flx-row">
        {
          uploads.map( (item, pos) => {
            if (!item.url) {
              return (
                <div className="file mt-auto flx-0 flx-nowrap" key={"fi-"+pos}><Pyr.UI.Icon name="lock" /></div>
              );
            }
            return (
              <div className="file mt-auto flx-0 flx-nowrap" key={"fi-"+pos}>
                <a href={item.url} download target="_blank">
                  <Pyr.UI.ImageFile url={item.url} contentType={item.content_type}/>
                  <div className="file-name">{item.file_name}</div>
                </a>
              </div>
            );
          })
        }
      </div>
    );
  }
}


class CandidateCVItem extends Component {
  render() {
    let candidate = this.props.candidate;
    let job = this.props.job;
    let locked = this.props.locked;

    let allClass = ClassNames("cv flx-col");

    let fullName = candidate.first_name + " " + candidate.last_name;
    let phoneNumber = candidate.phone_number || "No Phone";
    let email = candidate.email || "No Email";
    let description = candidate.description || "No Description";

    let id = "cv-" + candidate.id;

    //console.log("CVITEM");
    //console.log(candidate);
    //console.log(candidate.works);

    return (
      <div className={allClass} id={id}>
        <CVHeader 
          candidate={candidate}
          job={job}
          locked={locked}
          onSetItem={this.props.onSetItem}
        />
        <Pyr.UI.Label className="cv-label">Experience</Pyr.UI.Label>
        <Experience experiences={candidate.works} />
        <Pyr.UI.Label className="cv-label">Education</Pyr.UI.Label>
        <Education educations={candidate.educations} />
        <Pyr.UI.Label className="cv-label">Skills</Pyr.UI.Label>
        <Skills skills={candidate.skills} />
        <Pyr.UI.Label className="cv-label">Attachments</Pyr.UI.Label>
        <Uploads uploads={candidate.uploads} locked={locked}/>
      </div>
    );
  }
}

const CV = {
  CV : CandidateCVItem 
};

export default CV;
