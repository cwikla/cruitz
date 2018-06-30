import React from 'react';
import PropTypes from 'prop-types';

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
  EXP_TYPE_COMPANY,
  EXP_TYPE_SCHOOL,
  YEARS,
} from '../const';

const Lock = (props) => (
  <div className="flx-col">
    { /* Nice try! There isn't any candidate information here!  */ }
    <Pyr.UI.Icon name="lock" />
  </div>
);

class AutoText extends Component {
  render() {
    let rest = Pyr.Util.propsRemove(this.props, ["edit", "name", "children", "component"]);
    if (!this.props.edit) {
      return (
        <span className={this.props.className}>{this.props.children}</span>
      );
    }

    //console.log("PROPS");
    //console.log(this.props);

    let TextComponent = this.props.component || Pyr.Form.TextField;

    return (
      <Pyr.Form.Group name={this.props.name} >
        <TextComponent value={this.props.children} {...rest}/>
      </Pyr.Form.Group>
    );
  }
}

const CVHeader = (props) => (
  <div className={ClassNames("cv-header flx-col flx-noshrink").push(props.locked ? "locked" : "")} >
    <div className="flx-row flx-1">

      <div className={ClassNames("name first-name").push(props.locked ? "locked" : "").push(props.edit ? "flx-1" : "")}>
        <AutoText autoFocus name="first_name" edit={props.edit} placeholder="First Name">{props.firstName}</AutoText>
      </div>

      <div className={ClassNames("name last-name mr-auto flx-1").push(props.locked ? "locked" : "")}>
        <AutoText name="last_name" edit={props.edit} placeholder="Last Name">{props.lastName}</AutoText>
      </div>
    </div>

    <div className="flx-row flx-1 info">
      <div className={ClassNames("email flx-1").push(props.locked ? "locked" : "")}>
        <AutoText name="email" edit={props.edit} component={Pyr.Form.EmailField}>{props.email}</AutoText>
      </div>

      <div className={ClassNames("phone-number flx-1").push(props.locked ? "locked" : "")}>
        <AutoText name="phone_number" edit={props.edit} component={Pyr.Form.PhoneNumberField}>{props.phoneNumber}</AutoText>
      </div>
    </div>
    <div className="flx-row-stretch info social-links">
      <WebLink.Links links={props.links} locked={props.locked} edit={props.edit}/>
    </div>
    <div className={ClassNames("lock ml-auto mr-auto mt-auto mb-auto").push(props.locked ? "locked" : "")}>{ props.locked ? <Lock /> : null }</div>
  </div>
)

class CandidateHeader extends Component {

  isLocked() {
    return this.props.locked;
  }

  render() {
    if (!this.props.candidate) {
      return <Pyr.UI.Loading />
    }

    let candidate = this.props.candidate;
    let job = this.props.job;

    let firstName = candidate.first_name;
    let lastName = candidate.last_name;

    let fullName = candidate.first_name + " " + candidate.last_name;
    let phoneNumber = candidate.phone_number || "No Phone";
    let email = candidate.email || "No Email";

    let locked = this.isLocked();

    if (locked) {
      fullName = Pyr.Util.scramble("George Smith");
      phoneNumber = Pyr.Util.scramble("415-555-1212");
      email = Pyr.Util.scramble("georgith@george.com");
    }

    let edit = this.props.edit;

    let ALock = !locked ? Pyr.UI.Empty : Lock;

    return (
      <CVHeader
        locked = {this.isLocked()}
        fullName={fullName}
        firstName={firstName}
        lastName={lastName}
        phoneNumber={phoneNumber}
        email={email}
        edit={edit}
        links={candidate.links}
      />
    );

  }
}

const EditExperienceInner = (props) => (
    <div className="exp-modal flx-col flx-1">
      <div className="flx-row">
        <Pyr.Form.Group name="title" className="flx-5">
          <Pyr.Form.TextField />
        </Pyr.Form.Group> 
        <div className="flx-1 text-center at">@</div>
        <Pyr.Form.Group name="place" className="flx-5">
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

const ExpAdd = (props) => (
  <Pyr.PassThru>
    { props.edit ? <div className={props.className}><Pyr.UI.IconButton className="mt-auto mb-auto" name="plus" onClick={props.onShowModal}> Add Experience</Pyr.UI.IconButton></div> : null }
  </Pyr.PassThru>
);

const YEARS_OPTIONS = YEARS.map( year => {
    return {value: year, label: year} 
  }).concat({value: 0, label: "Current"}).reverse();

const YearSelect = (props) => (
  <Pyr.Form.Group {...props}>
    <Pyr.Form.CompactSelect
      options={YEARS_OPTIONS}
      isClearable={false}
      isSearchable={false}
    />
  </Pyr.Form.Group>
);

const EditExperience = (props) => (
  <div className={ClassNames("edit-experience").push(props.className)}>
    <div className="flx-row">
      <Pyr.Form.Group name="title" className="flx-1">
        <Pyr.Form.TextField className="" placeholder="Title"/>
      </Pyr.Form.Group>

      <div className="at">@</div>
  
      <Pyr.Form.Group name="place" className="flx-1">
        <Pyr.Form.TextField className="" placeholder="Organization"/>
      </Pyr.Form.Group>
    </div>

    <div className="flx-row">
      <YearSelect name="year_start" className="flx-1"/>

      <div className="at"> - </div>

      <YearSelect name="year_end" className="flx-1"/>
    </div>
        
    <Pyr.Form.Group name="description" className="flx-1">
      <Pyr.Form.TextArea className="experience" placeholder="Description"/>
    </Pyr.Form.Group>
  </div>
);

const EditManyExperiences = (props) => (
  <Pyr.Form.Many model={props.model} name={props.name}>
    <EditExperience {...props} />
  </Pyr.Form.Many>
);

class EditManyExp extends Component {
  constructor(props) {
    super(props);
    
    this.onAdd = this.add.bind(this);
    this.onRemove = this.remove.bind(this);
  }

  getName() {
    return this.props.name;
  }

  getKey() {
    return this.props.name.toLowerCase();
  }

  getItems() {
    return this.props.items;
  }

  add() {
    if (this.props.onAdd) {
      this.props.onAdd();
    }
  }

  remove(item) {
    if (this.props.onRemove) {
      this.props.onRemove(item.id);
    }
  }

  render() {
    let title = this.props.title || "Experience";
    let name = this.getName();
    let key = this.getKey();

    let exps = this.getItems();

    return (
      <div className="flx-col exp-form">
        <div className={ClassNames("exp-title cv-label flx-row").push("exp-" + title)}><Pyr.UI.Label>{title}</Pyr.UI.Label> <Pyr.UI.IconButton className="ml-auto" name="plus" onClick={this.onAdd}> Add { name }</Pyr.UI.IconButton></div>
        { exps.length == 0 ? "None" : null }
        {  
          exps.map((item, pos) => {
            let kid = item.id || pos;
            return (
              <Pyr.Form.Nested object={item} model={this.props.model} index={pos} key={key + "-" + title + "-eme-" + kid}>
                <div className="flx-row"><EditExperience className="flx-1" /> <Pyr.UI.IconButton name="times" className="mb-auto remove" onClick={e => this.onRemove(item)}/></div>
              </Pyr.Form.Nested>
            );
          })
        }
      </div>
    );
  }
}

const WorkEditManyExp = (props) => (
  <EditManyExp {...props} edit={true} locked={false} name="Experience" model="experiences"/>
);

const EducationEditManyExp = (props) => (
  <EditManyExp {...props} edit={true} locked={false} name="Education" title="Education" model="educations" />
);

const ExperienceItem = (props) => (
  <div className="item">
    <div className="title flx-row">{props.item.title} <div className="at">@</div> {props.item.place}</div>
    <div className="years flx-row">{props.item.year_start} <div className="at">-</div> {props.item.year_end || "Current"}</div>
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
          <EditManyExperiences model="Educations" name="educations"/>
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
    <div className="degree flx-row">{props.item.title} <div className="at">@</div> {props.item.place}</div>
    <div className="years flx-row">{props.item.year_start} <div className="at">-</div> {props.item.year_end || "Current"}</div>
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
          <EditManyExperiences model="Educations" name="educations"/>
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
    //console.log(candidate.experiences);

    return (
      <div className={allClass} id={id}>
        <CandidateHeader 
          candidate={candidate}
          job={job}
          locked={locked}
          onSetItem={this.props.onSetItem}
          edit={edit}
        />
        <Experience experiences={candidate.experiences} edit={edit} locked={locked}/>
        <Education educations={candidate.educations} edit={edit} locked={locked}/>
        <Skills skills={candidate.skills} edit={edit} locked={locked}/>
        <Uploads uploads={candidate.uploads} edit={edit} locked={locked}/>
      </div>
    );
  }
}


class ExperienceModal extends Pyr.UI.Modal {
  constructor(props) {
    super(props);

    this.onGetTarget = this.getTarget.bind(this);
    this.onSubmit = this.submit.bind(this);
  }

  valid() {
    return true;
  }

  getTarget() {
    return this.form;
  }

  title() {
    return "Add Experience";
  }

  submit(e) {
    if (e) {
      e.preventDefault();
    }

    let $item = $(this.getTarget().form);
    console.log($item);

    let data = $item.serializeArray();
    console.log("DATA");
    console.log(data);

    if (this.props.onAdd) {
//      this.props.onAdd(data);
    }

    this.close();
  }

  renderInner() {
    return (
      <div className="add-experience-modal">
        <Pyr.Form.Form
          model="Experience"
          object={{}}
          url={"#"}
          method={Pyr.Method.PUT}
          id="experience-form"
          ref={(node) => { this.form = node; }}
          onSubmit={this.onSubmit}
        >
          <Pyr.Form.Group name="hello">
            <Pyr.Form.TextField   />
          </Pyr.Form.Group>
        </Pyr.Form.Form>
      </div>
    );
  }
}

class CVNewForm extends Component {
  constructor(props) {
    super(props);

    this.initState({
      experiences: [],
      educations: [],
    });

    this.onAddExperience = this.addExperience.bind(this);
    this.onRemoveExperience = this.removeExperience.bind(this);

    this.onAddEducations = this.addEducations.bind(this);
    this.onRemoveEducations = this.removeEducations.bind(this);
  }

  addExperience() {
    let experiences = this.state.experiences.slice()
    let last = experiences[experiences.length - 1];
    let id = last ? last.id + 1 : 1;

    experiences.push({
      id
    });

    this.setState({
      experiences
    });
  }

  removeExperience(itemId) {
    let experiences = this.state.experiences.reduce( (arr, item) => {
      if (item.id != itemId) {
        arr.push(item);
      }
      return arr;
    }, []);

    this.setState({
      experiences
    });
  }

  addEducations() {
    let educations = this.state.educations.slice()
    let last = educations[educations.length - 1];
    let id = last ? last.id + 1 : 1;

    educations.push({
      id
    });

    this.setState({
      educations
    });
  }

  removeEducations(itemId) {
    let educations = this.state.educations.reduce( (arr, item) => {
      if (item.id != itemId) {
        arr.push(item);
      }
      return arr;
    }, []);

    this.setState({
      educations
    });
  }


  render() {
    let key = "head-form";
    let url = Pyr.URL(HEADS_URL);

    if (this.props.head) {
      url = url.push(this.props.head.id);
      key = key + "-" + this.props.head.id;
    }

    let allClass = ClassNames("cv cv-form flx-col");

    let method = this.props.method || Pyr.Method.POST;
    let candidate = null;
    let job = null;
    let locked= false;
    let edit = true;

    let object = {
      experiences: this.state.experiences,
      educations: this.state.educations,
    };

    return (
      <div className={allClass} >
        <Pyr.Form.Form
          model="Head"
          object={object}
          url={url}
          method={method}
          id="head-form"
          key={key}
          ref={(node) => { this.form = node; }}
          onPreSubmit={this.props.onPreSubmit}
          onPostSubmit={this.props.onPostSubmit}
          onSuccess={this.props.onSuccess}
          onError={this.props.onError}
        >
          <CVHeader
            job={job}
            locked={locked}
            onSetItem={this.props.onSetItem}
            edit={edit}
          />
          <WorkEditManyExp onAdd={this.onAddExperience} onRemove={this.onRemoveExperience} items={this.state.experiences}/>
          <EducationEditManyExp onAdd={this.onAddEducations} onRemove={this.onRemoveEducations} items={this.state.educations}/>
          <Skills edit={edit} locked={locked}/>
          <Uploads edit={edit} locked={locked}/>
        </Pyr.Form.Form>
      </div>
    );
  }
}

const CV = {
  CV : CandidateCVItem,
  NewForm : CVNewForm,

  Header : CVHeader,
  Experience,
  Education,
  Skills,
  Uploads,

  AutoText,
  EditExperience,
  EditSkills,
  EditUploads,
};

export default CV;
