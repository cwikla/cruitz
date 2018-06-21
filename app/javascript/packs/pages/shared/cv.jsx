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
  RANGES,
  HEADS_URL,
  SKILLS_URL,
} from '../const';

const Lock = (props) => (
  <div className="flx-col">
    { /* Nice try! There isn't any candidate information here!  */ }
    <Pyr.UI.Icon name="lock" />
  </div>
);

class AutoText extends Component {
  render() {
    let rest = Pyr.Util.propsRemove(this.props, ["edit", "name"]);
    if (!this.props.edit) {
      return (
        <span {...rest}>{this.props.children}</span>
      );
    }

    //console.log("PROPS");
    //console.log(this.props);

    return (
      <Pyr.Form.Group name={this.props.name} {...rest}>
        <Pyr.Form.TextField value={this.props.children} />
      </Pyr.Form.Group>
    );
  }
}

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

    let edit = this.props.edit;

    let ALock = !locked ? Pyr.UI.Empty : Lock;

/*
    console.log("HMMM");
    console.log(candidate.unlocked_at);
    console.log(!!candidate.unlocked_at);
*/

    return (
      <div className={clazzes} >
        <div className="flx-row flx-1">
          <div className={ClassNames(extra).push("name mr-auto flx-1")}><AutoText name="full_name" edit={edit}>{fullName}</AutoText></div>
        </div>
        <div className="flx-row flx-1 info">
          <div className={ClassNames(extra).push("phone-number flx-1")}><AutoText name="phone_number" edit={edit}>{phoneNumber}</AutoText></div>
          <div className={ClassNames(extra).push("email flx-1")}><AutoText name="email" edit={edit}>{email}</AutoText></div>
        </div>
        <div className="flx-row flx-1 info">
          <div className={ClassNames(extra).push("salary mr-auto")}><AutoText name="salary" edit={edit}>{salary}</AutoText></div>
        </div>
        <div className="flx-row-stretch info social-links">
          <WebLink.Links links={candidate.links} locked={locked} edit={edit}/>
        </div>
        <div className={ClassNames(extra).push("lock ml-auto mr-auto mt-auto mb-auto")}><ALock /></div>
      </div>
    );
  }
}

const EditExperienceInner = (props) => (
    <div className="exp-modal flx-col flx-1">
      <div className="flx-row">
        <Pyr.Form.Group name="title" className="flx-5">
          <Pyr.Form.TextField />
        </Pyr.Form.Group> 
        <div className="flx-1 text-center">@</div>
        <Pyr.Form.Group name="company" className="flx-5">
          <Pyr.Form.TextField />
        </Pyr.Form.Group>
      </div>
      <div className="flx-row">
        Put the date selector here
      </div>

      <div className="">
        <Pyr.Form.Group name="description">
          <Pyr.Form.TextArea />
        </Pyr.Form.Group>
      </div>
    </div>
);

class ExperienceModal extends Pyr.UI.Modal {
  title() {
    return "Experience";
  }

  renderInner() {
    return (
      <EditExperienceInner props={this.props} />
    );
  }
}

const ExpAdd = (props) => (
  <Pyr.PassThru>
    { props.edit ? <div className={props.className}><Pyr.UI.IconButton className="mt-auto mb-auto" name="plus" onClick={props.onShowModal}> Add Experience</Pyr.UI.IconButton></div> : null }
  </Pyr.PassThru>
);

const EditExperience = (props) => (
      <Pyr.Form.Many model={props.model} name={props.name} >
        <div className="edit-experience">
          <div className="flx-row">
            <Pyr.Form.Group name="title" className="flx-1">
              <Pyr.Form.TextField className="" />
            </Pyr.Form.Group>
  
            @
  
            <Pyr.Form.Group name="place" className="flx-1">
              <Pyr.Form.TextField className="" />
            </Pyr.Form.Group>
          </div>
        
          <Pyr.Form.Group name="description" className="flx-1">
            <Pyr.Form.TextArea className="experience" />
          </Pyr.Form.Group>
        </div>
      </Pyr.Form.Many>
);

const ExperienceItem = (props) => (
  <div className="item">
    <div className="title">{props.item.title} @ {props.item.place}</div>
    <div className="years">{props.item.year_start} - {props.item.year_end || "Current"}</div>
    <div className="description">{props.item.description}</div>
  </div>
);

class Experience extends Component {
  constructor(props) {
    super(props);
    this.initState({
      showModal: false
    });

    this.onShowModal = this.showModal.bind(this);
    this.onCloseModal = this.closeModal.bind(this);
  }

  showModal() {
    //console.log("SHOW MODAL");
    this.setState({
      showModal: true
    });
  }

  closeModal() {
    this.setState({
      showModal: false
    });
  }

  render() {
    //console.log("EXPS");
    //console.log(this.props.experiences);

    let edit = this.props.edit;

    if (!this.props.experiences || this.props.experiences.length == 0) {
      return (
        <Pyr.PassThru>
          <div key="exp-title" className="cv-label flx-row"><Pyr.UI.Label>Experience</Pyr.UI.Label> <ExpAdd className="ml-auto" edit={edit} /></div>
          <div className="none">No Experience</div>
        </Pyr.PassThru>
      );
    }

    let experiences = this.props.experiences;

    if (edit) {
      return (
        <Pyr.PassThru>
          <div key="exp-title" className="cv-label flx-row"><Pyr.UI.Label>Experience</Pyr.UI.Label> </div>
          <EditExperience model="Works" name="works"/>
        </Pyr.PassThru>
      );
    }

    return (
      <Pyr.PassThru>
       <div key="exp-title" className="cv-label flx-row"><Pyr.UI.Label>Experience</Pyr.UI.Label> <ExpAdd className="ml-auto" edit={edit} /></div>
       <div id="experience" className="cv-section experience">
         {
           experiences.map( (item, pos) => {
             return (
               <Pyr.PassThru key={"pt-" + pos}>
                 <ExperienceItem item={item} key={"exp"+pos}/>
               </Pyr.PassThru>
             );
           })
         }
         <ExperienceModal onClose={this.onCloseModal} open={this.state.showModal}/>
       </div>
      </Pyr.PassThru>
    );
  }
}

const EduAdd = (props) => (
  <Pyr.PassThru>
    { props.edit ? <div className={props.className}><Pyr.UI.IconButton className="mt-auto mb-auto" name="plus" onClick={props.onShowModal}> Add Education</Pyr.UI.IconButton></div> : null }
  </Pyr.PassThru>
);

const EducationItem = (props) => (
  <div className="item">
    <div className="degree">{props.item.title} @ {props.item.place}</div>
    <div className="years">{props.item.year_start} - {props.item.year_end || "Current"}</div>
  </div>
);

class Education extends Component {
  render() {
    let edit = this.props.edit;

    if (!this.props.educations || this.props.educations.length == 0) {
      return (
        <Pyr.PassThru>
          <div key="edu-title" className="cv-label flx-row"><Pyr.UI.Label>Education</Pyr.UI.Label> <EduAdd className="ml-auto" edit={edit} /></div>
          <div className="none">No Education</div>
        </Pyr.PassThru>
      );
    }

    let educations = this.props.educations;

    if (edit) {
      return (
        <Pyr.PassThru>
          <div key="edu-title" className="cv-label flx-row"><Pyr.UI.Label>Education</Pyr.UI.Label> </div>
          <EditExperience model="Educations" name="educations"/>
        </Pyr.PassThru>
      );
    }

    return (
      <Pyr.PassThru>
        <div key="edu-title" className="cv-label flx-row"><Pyr.UI.Label>Education</Pyr.UI.Label> <EduAdd className="ml-auto" edit={edit} /></div>
        <div id="education" className="cv-section education">
        {
          educations.map( (item, pos) => {
            return (
              <EducationItem item={item} key={"ed"+pos}/>
            );
          })
        }
        </div>
      </Pyr.PassThru>
    );
  }
}

const EditSkills = (props) => (
    <Pyr.Form.Group name="skills">
      <Pyr.Form.AutoComplete url={SKILLS_URL} multiple allowNew />
    </Pyr.Form.Group>
);

const ListSkills = (props) => (
   <div id="skills" className="cv-section skills flx-row flx-wrap">
    { (!props.skills || props.skills.length == 0) ? <Pyr.UI.Label>No Skills</Pyr.UI.Label> : null }
     {
        props.skills.map( (item, pos) => {
          return (<div className="skill flx-0 flx-nowrap" key={"sk"+item.id}>{item.name}</div>);
        })
      }
    </div>
);


class Skills extends Component {
  render() {
    let skills = this.props.skills;
    let edit = this.props.edit;

    return (
      <Pyr.PassThru>
        <div key="skills-title" className="cv-label flx-row"><Pyr.UI.Label>Skills</Pyr.UI.Label></div>
        { edit ? <EditSkills skills={skills} /> : <ListSkills skills={skills} /> }
      </Pyr.PassThru>
    );
  }
}

const EditUploads = (props) => (
  <Pyr.Form.Group name="uploads">
    <Pyr.Form.FileSelector multiple row wrap showFileName uploads={props.uploads}/>
  </Pyr.Form.Group>
);

const ListUploads = (props) => (
    <div id="uploads" className="cv-section uploads flx-row">
      { (!props.uploads || props.uploads.length == 0) ? <Pyr.UI.Label>No Attachments</Pyr.UI.Label> : null }
      {
        props.uploads.map( (item, pos) => {
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


class Uploads extends Component {
  render() {
    let uploads = this.props.uploads;
    let edit = this.props.edit;

    return (
      <Pyr.PassThru>
        <div key="uploads-title" className="cv-label flx-row"><Pyr.UI.Label>Attachments</Pyr.UI.Label></div>
        { edit ? <EditUploads uploads={uploads} /> : <ListUploads uploads={uploads} /> }
      </Pyr.PassThru>
    );
  }
}


class CandidateCVItem extends Component {
  render() {
    let candidate = this.props.candidate;
    let job = this.props.job;
    let locked = this.props.locked;
    let edit = this.props.edit;

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
          edit={edit}
        />
        <Experience experiences={candidate.works} edit={edit} locked={locked}/>
        <Education educations={candidate.educations} edit={edit} locked={locked}/>
        <Skills skills={candidate.skills} edit={edit} locked={locked}/>
        <Uploads uploads={candidate.uploads} edit={edit} locked={locked}/>
      </div>
    );
  }
}

const CV = {
  CV : CandidateCVItem 
};

export default CV;
