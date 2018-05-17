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

import Page from '../page';
import Sheet from '../sheet';
import MessageThread from '../messages/message_thread';
import Recruiter from '../shared/recruiter';
import Loader from '../loader/loader';

import Avatar, {
} from '../shared/avatar';

import State from '../shared/state';


import {
  MESSAGES_URL,
  JOBS_URL,
  COMPANIES_URL,

  CATEGORIES_URL,
  SKILLS_URL,
  LOCATIONS_URL,
  CANDIDATES_URL,

  RANGES
} from '../const';

const WEB_LINK_WEB = 0;
const WEB_LINK_IN = 1;
const WEB_LINK_GITHUB = 2;
const WEB_LINK_DRIBBBLE = 3;
const WEB_LINK_QUORA = 4;
const WEB_LINK_FACEBOOK = 5;
const WEB_LINK_TWITTER = 6;
const WEB_LINK_ANGELIST = 7;

const WEB_LINK_TO = {
  [WEB_LINK_WEB] : "link",
  [WEB_LINK_IN] : "linkedin",
  [WEB_LINK_GITHUB] : "github",
  [WEB_LINK_DRIBBBLE] : "dribbble",
  [WEB_LINK_QUORA] : "quora",
  [WEB_LINK_FACEBOOK] : "facebook-f",
  [WEB_LINK_TWITTER] : "twitter",
  [WEB_LINK_ANGELIST] : "angellist",
};


const WebLinkFont = (props) => (
  <a href={props.webLink.url} target="_cruitz"><Pyr.UI.Icon name={WEB_LINK_TO[props.webLink.ltype] ? WEB_LINK_TO[props.webLink.ltype] : "link"} /></a>
);

const WebLinkLock = (props) => (
  <Pyr.UI.Icon name={WEB_LINK_TO[props.webLink.ltype] ? WEB_LINK_TO[props.webLink.ltype] : "link"} className="locked"/>
);

class WebLinks extends Component {
  render() {
    if (!this.props.candidate) {
      return null;
    }

    let candidate = this.props.candidate;

    let webLinks = candidate.links;
    if (!webLinks) {
      return null;
    }

    let locked = !candidate.unlocked_at;

    let WebLinkComp = locked ? WebLinkLock : WebLinkFont;

    return (
      <div id="web-links" className="cv-section web-links flx-row">
        {
          webLinks.map( (item, pos) => {
            return (<div className="web-link flx-0 flx-nowrap" key={"web-lnk"+item.id}><WebLinkComp webLink={item} /></div>);
          })
        }
      </div>
    );
  }
}

const Lock = (props) => (
  <div className="flx-col">
    { /* Nice try! There isn't any candidate information here!  */ }
    <Pyr.UI.Icon name="lock" />
  </div>
);

class CandidateHeader extends Component {
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

    if (!candidate.unlocked_at) {
      fullName = Pyr.Util.scramble("George Smith");
      phoneNumber = Pyr.Util.scramble("415-555-1212");
      email = Pyr.Util.scramble("georgith@george.com");
      salary = Pyr.Util.scramble("60,000");
    }

    let clazzes = ClassNames("candidate-header flx-col flx-noshrink");
    let extra = ClassNames(!candidate.unlocked_at ? "locked" : "");

    let ALock = candidate.unlocked_at ? Pyr.UI.Empty : Lock;

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
          <WebLinks candidate={candidate} />
        </div>
        <div className={ClassNames(extra).push("lock ml-auto mr-auto mt-auto mb-auto")}><ALock /></div>
      </div>
    );
  }
}

class CandidateItem extends Component {

  render() {
    let candidate = this.props.candidate;
    let recruiter = candidate.recruiter;
    let stateName = State.toClassName(candidate.state);

    let id = "candidate-" + candidate.id;
    let allClass = ClassNames("item candidate-item flx-col");

    if (this.props.isSelected) {
       allClass.push("selected");
    }

    allClass.push("state").push(stateName);
    if (!candidate.unlocked_at) {
      allClass.push("locked");
    }

    //console.log("CANDIDATE");
    //console.log(candidate);

    return (
      <div key={id} className={allClass}>
        <div>{candidate.first_name} {candidate.last_name}</div>
        <div>{candidate.summary.title} @ {candidate.summary.place}</div>
      </div>
    );

  }
}


class CandidateForm extends Component {

  methodToName(method) {
    switch (method) {
      case Pyr.Method.PATCH:
        return "Update";
        break

      default:
        return "Create";
        break;
    }
  }

  render() {
    let key = "candidate-form";
    let url = Pyr.URL(JOBS_URL);

    if (this.props.candidate){
      url.push(this.props.candidate.id);
      key = CandidatesPage.key(this.props.candidate);
    }

    let method = this.props.method || Pyr.Method.POST;

    //alert("Render FOrm Candidate " + this.props.candidate.id);


    return (
      <div className="form-parent">
        <Pyr.Form.Form
          model="Candidate"
          object={this.props.candidate}
          url={url}
          method={method}
          id="candidate-form" 
          key={key}
          ref={(node) => { this.form = node; }} 
          onPreSubmit={this.props.onPreSubmit} 
          onPostSubmit={this.props.onPostSubmit}
          onSuccess={this.props.onSuccess}
          onError={this.props.onError}
        >
      
          <Pyr.Form.Group name="title">
            <Pyr.Form.Label>Title</Pyr.Form.Label>
            <Pyr.Form.TextField placeholder= "Enter candidate title"/>
          </Pyr.Form.Group>
      
          <Pyr.Form.Group name="time_commit">
            <Pyr.Form.Label>Time Requirements</Pyr.Form.Label>
            <Pyr.Form.Select>
              <Pyr.Form.Option value="0">Full Time</Pyr.Form.Option>
              <Pyr.Form.Option value="1">Part Time</Pyr.Form.Option>
              <Pyr.Form.Option value="2">Contractor</Pyr.Form.Option>
            </Pyr.Form.Select>
          </Pyr.Form.Group>
      
          <Pyr.Form.Group name="description">
            <Pyr.Form.Label>Description</Pyr.Form.Label>
            <Pyr.Form.TextArea placeholder="Enter description" rows="10" />
          </Pyr.Form.Group>
      
        </Pyr.Form.Form>
        <div className="form-footer">
          <Pyr.Form.SubmitButton target={this} disabled={this.props.isLoading}>{this.methodToName(method)}</Pyr.Form.SubmitButton>
        </div>
      </div>
    );
  }
}

class EditSheet extends Sheet.Edit {
  formPluck(data) {
    return data.candidate;
  }

  renderForm() {
    //alert("JOB EDIT " + this.props.candidate.id);
    return (
      <CandidateForm 
        onPreSubmit={this.onPreSubmit} 
        onPostSubmit={this.onPostSubmit} 
        candidate={this.props.candidate} 
        onSuccess={this.onSuccess}
        method={Pyr.Method.PATCH} 
        isLoading={this.state.isLoading}/>
    );
  }
}

class JobSelect extends Component {
  constructor(props) {
    super(props);
    this.onChange = this.change.bind(this);
  }

  change(item, e) {
    if (item) {
      this.props.onSelect(item.value);
    }
  }

  render() {
    let options = {};
    options = this.props.jobs.map(item => {
      return (
        { value: item.id, label: item.title }
      );
    });

    let value = this.props.job ? { value: this.props.job.id, label: this.props.job.title } : null;

    return (
      <Select 
        {...this.props} 
        {...Pyr.Util.propsMergeClassName(this.props, "job-select")}
        options={options} 
        value={value}
        isClearable={false}
        isSearchable={false}
        onChange={this.onChange}
      />
    );
  }
}

class IndexSheet extends Sheet.Index {
  constructor(props) {
    super(props);

    this.onJobIdSelect = this.jobIdSelect.bind(this);
  }

  key(item) {
    return CandidatesPage.key(item);
  }

  getJobId() {
    if (this.props.jobId) {
      return this.props.jobId;
    }

    if (this.props.jobs && this.props.jobs.length) {
      return this.props.jobs[0].id;
    }

    return null;
  }

  getJobsMap() {
    return this.props.jobsMap;
  }

  renderNone() {
    return (
      <div className="empty flx-3 flx-col-stretch">
        { this.renderHeader() }
        <div className="flx-1 flx-row-stretch flx-align-center ml-auto mr-auto">
          <Pyr.UI.Icon name="user-times"/> No candidates have been submitted for this job.
        </div>
      </div>
    );
  }

  unused_sortItems(items) {
    return items;
  }

  childURL(item, isSelected) {
    return Pyr.URL(CANDIDATES_URL).push(item.job_id).push(item.id);
  }

  renderChild(item, isSelected) {

    return super.renderChild(item, isSelected);
  }

  renderItem(item, isSelected) {

    return (
      <CandidateItem 
        {...this.props}
        candidate={item} 
        isSelected={isSelected} 
      />
    );
  }

  jobIdSelect(jobId) {
    let url = Pyr.URL(CANDIDATES_URL).push(jobId);
    this.goTo(url);
  }

  renderInner() {
    let leftClasses = "scroll flx-1 flx-col inner";
    let rightClasses = "flx-col";

    let jobId = this.getJobId();
    let jobsMap = this.getJobsMap();
    let job = jobId ? jobsMap[jobId] : null;


    return (
      <div className="flx-row flx-1">
        <div className={leftClasses}>
          <div className="header flx-col">
            <div className="flx-row"><JobSelect {...this.props} job={job} className="flx-1" onSelect={this.onJobIdSelect}/></div>
          </div>
          <div className="flx-col flx-1 scroll">
            { this.renderInnerNoScroll() }
          </div>
        </div>
      </div>
    );
  }

  render() {
    if (!this.props.jobsMap) {
      return (
        <Pyr.UI.Loading />
      );
    }

    return super.render();
  }


}

class RecruiterMessage extends Component {
  render() {
    let candidate = this.props.candidate;
    if (!candidate.description) {
      return ( 
        null
      );
    }

    //console.log("message id");
    //console.log(this.props.candidate);

    let clazzes = ClassNames("recruiter-message flx-col section").push(this.props.className);

    let url = Pyr.URL(MESSAGES_URL).push(candidate.description.id);

    return (
      <div 
        className={clazzes}
      >
        <div className="title">Note from recruiter</div>
        <Pyr.UI.Scroll><div className="message">{candidate.description.body}</div></Pyr.UI.Scroll>
        <div className="ml-auto"><Link to={url.toString()}><span className="more ml-auto">More...</span></Link></div>
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
                <div className="file flx-0 flx-nowrap" key={"fi-"+pos}><Pyr.UI.Icon name="lock" /></div>
              );
            }
            return (
              <div className="file flx-0 flx-nowrap" key={"fi-"+pos}>
                <a href={item.url} download target="_blank"><Pyr.UI.ImageFile url={item.url} contentType={item.content_type}/></a>
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

    let allClass = ClassNames("cv-item flx-col");

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
        <CandidateHeader 
          candidate={candidate}
          job={job}
          onSetItem={this.props.onSetItem}
        />
        <Pyr.UI.Label className="cv-label">Experience</Pyr.UI.Label>
        <Experience experiences={candidate.works} />
        <Pyr.UI.Label className="cv-label">Education</Pyr.UI.Label>
        <Education educations={candidate.educations} />
        <Pyr.UI.Label className="cv-label">Skills</Pyr.UI.Label>
        <Skills skills={candidate.skills} />
        <Pyr.UI.Label className="cv-label">Attachments</Pyr.UI.Label>
        <Uploads uploads={candidate.uploads} />
      </div>
    );
  }
}

const StateButton = (props) =>  (
   <Pyr.UI.PrimaryButton 
    key={"state-button-" + props.state}
    className={ClassNames(props.className, "state-button").push(State.toName(props.state))} 
    onClick={props.onClick}
  >{props.children}</Pyr.UI.PrimaryButton>
);

class ShowSheet extends Sheet.Show {
  constructor(props) {
    super(props);
    this.onButtonPresses = {};
    this.buttonBinds();
  }

  buttonBinds() {
    let states = State.states();
    let bps = {};

    for(let i=0; i<states.length; i++) {
      let ns = states[i];
      bps[ns] = this.candidateStateChange.bind(this, ns);
    }

    this.onButtonPresses = bps;
  }

  candidateStateUpdate(state) {
    let candidate = this.props.selected;

    let url = Pyr.URL(CANDIDATES_URL).push(candidate.id);
    candidate = Object.assign({}, candidate, { state });

    this.getJSON({
      url: url,
      context: this,
      type: Pyr.Method.PATCH,
      data: { candidate : { state } },
      //contentType:"application/json; charset=utf-8",

    }).done((data, textStatus, jaXHR) => {
      this.setCandidate(data.candidate);

    });
  }

  candidateStateChange(sid, e) {
    //console.log("candidateStateChange");
    //console.log(sid);
    //console.log("E");
    //console.log(e);
    this.candidateStateUpdate(sid);
  }

  setCandidate(candidate) {
    this.props.loaders.candidates.replace(candidate);
    //console.log(candidate);
  }

  key(item) {
    return CandidatesPage.key(item);
  }

  renderButtons(curState) {
    let nexts = State.nexts(curState);

    return (
      <div className="state-change">
      {
        nexts.map( (state, pos) => {
          let name = State.toName(state);
          let action = State.toAction(state);

          return (
            <StateButton key={"sb-" + name} state={state} onClick={this.onButtonPresses[state]}>{action}</StateButton>
          );
        })
      }
      </div>
    );
  }

  statusTop(candidate) {
    if (!candidate) {
      return null;
    }

    //console.log("RENDER HEADER");
    //console.log(candidate);
    let stateName = State.toName(candidate.state);
    let sclz = ClassNames("state").push(stateName);
    let clazzes = ClassNames("actions flx-row p-1 flx-start").push(sclz).push("border-bottom");

    let score = candidate.score;

    return (
      <div className={clazzes}>
        <Avatar.Score className={ClassNames("flx-align-content-start mr-auto").push(sclz)}>{score}</Avatar.Score>
        <State.Bar state={candidate.state} className="ml-auto mr-auto"/>
        <div className="ml-auto">{ this.renderButtons(candidate.state) }</div>
      </div>
    );
  }

  renderHeader() {
    let job = this.props.job;
    if (!job) {
      return null;
    }

    let url = Pyr.URL(CANDIDATES_URL).push(job.id);
    let title = "Candidates for " + job.title;

    return (
      <Sheet.ShowHeader className="candidate-title" title={title} nextId={this.props.nextId} prevId={this.props.prevId} url={url} />
    );
  }

  renderItem(item, isSelected) {
    if (this.state.isLoading || !this.props.items) {
      return (<Pyr.UI.Loading />);
    }

    if (!item) {
        return null;
    }

    //console.log("MESSAGE JOB");
    //console.log(item);

    let candidate = item;
    let job = this.props.job;
    let recruiter = candidate.recruiter;


    return (
        <div className="flx-row flx-1">
          <div className="flx-col left flx-5">
            { this.statusTop(candidate) }
            <div className="flx-col flx-2 cv">
              <Pyr.UI.Scroll>
                <CandidateCVItem 
                  candidate={candidate} 
                  isSelected={isSelected} 
                  job={this.state.job}
                />
              </Pyr.UI.Scroll>
 
            </div>
          </div>
          <div className="flx-col right flx-2">
            <Recruiter.Blurb recruiter={recruiter}/>
            <RecruiterMessage candidate={candidate} job={job} recruiter={recruiter} />
          </div>
        </div>
    );
  }


  renderInner() {
    if (!this.props.items) {
      //console.log("C");
      return (
        <Pyr.UI.Loading />
      );
    }

    return super.renderInner();
  }

}

class New extends Sheet.Base {
  renderForm() { 
    return ( 
      <CandidateForm onPreSubmit={this.onPreSubmit} postSubmit={this.postSubmit} />
    );
  }
}

const CandidateRow = (props) => (
  <tr>
    <td>{props.candidate.first_name}</td>
    <td>{props.job}</td>
    <td>{props.job}</td>
  </tr>
);

class CandidateTable extends Sheet.Index {
  key(item) {
    return "candidate-row-" + item.id;
  }

  render() {
    if (!this.props.items) {
      return null;
    }

    return (
      <table id="candidate-table" className="display col-stretch">
        <thead>
          <tr>
            <th>Candidate</th>
            <th>Job</th>
            <th>Submitted At</th>
          </tr>
        </thead>
        <tbody>
          { 
            this.props.items.map((candidate, pos) => {
              let job = candidate.job_id;
              let key = "candidate-row-" + candidate.id;
              return (<CandidateRow 
                        key={key}
                        candidate={candidate} 
                        job={job} />
              );
            })
          }
        </tbody>
      </table>
    );
  }
}

class IndexShowSheet extends Sheet.IndexShow {
  renderIndex() {
    return (
        <IndexSheet
          {...this.props}
        />
    );
  }

  renderShow() {
    return (
        <ShowSheet
          {...this.props}
        />
    );
  }
}


class CandidatesPage extends Page {
  getItems() {
    let all = super.getItems();

    if (!all) {
      return null;
    }

    let jobId = this.getJobId();
    if (!jobId) {
      return  all ? [] : null;
    }

    let items = all.reduce((arr, o) => {
      if (o.job_id == jobId) {
        arr.push(o);
      }
      return arr;
    }, []);

    return all ? items : null;
  }

  getItemId() {
    return this.props.subItemId;
  }

  getJobId() {
    return this.props.itemId;
  }

  getJob() {
    let jid = this.getJobId();
    if (jid) {
      return this.props.jobsMap[jid];
    }
    return null;
  }

  name() {
    return "Candidates";
  }

  componentDidMount() {
    if (!this.props.jobs) {
      this.props.loaders.jobs.load({force: true});
    }
  }

  getIndexSheet() {
    return IndexShowSheet;
    //return IndexSheet;
  }

  getActionSheet(action) {
    if ((action || "show").toLowerCase() == "show") {
      return IndexShowSheet;
    }

    let sheet = Sheet.sheetComponent(action || "Show");
    let ActionSheet = eval(sheet);

    return ActionSheet;
  }

  pageProps() {
    let pp = super.pageProps();
    return Object.assign({}, pp, { jobId: this.getJobId(), job: this.getJob() });
  }

  render() {
    if (!this.props.jobs) {
      return (
        <Pyr.UI.Loading />
      );
    }

    return super.render();
  }

}


CandidatesPage.key = (item) => {
  return "cand-" + item.id;
}


class SearchForm extends Component {
  constructor(props) {
    super(props);
    this.onGetTarget = this.getTarget.bind(this);
    this.onRenderAge = this.renderAge.bind(this);
    this.onSuccess = this.success.bind(this);
    this.onPreSubmit = this.preSubmit.bind(this);
  }

  getTarget() {
    return this.form;
  }

  renderAge(value) {
    value = Math.floor(value);
    return RANGES[value];
  }

  success(data, textStatus, jqXHR) {
    //console.log("SUCCESSS");
    //console.log(data);
    this.props.onSetItems(data.candidates || []);
  }

  preSubmit() {
    this.props.onSetItems(null);
  }

  render() {
    return (
      <div className="position-search side-search">
        <div className="search-header">
          <div className="flx-row">
            <div className="mr-auto">Filter</div>
          </div>
        </div>
        <Pyr.Form.Form
          url={Pyr.URL(CANDIDATES_URL).push("search")}
          method={Pyr.Method.POST}
          ref={(node) =>{ this.form = node; }}
          onPreSubmit={this.onPreSubmit}
          onPostSubmit={this.props.onPostSubmit}
          onSuccess={this.onSuccess}
          onError={this.props.onError}
          object={{}}
          model="search"
          className="search-inner"
        >

          <Pyr.Form.Group name="key_words">
            <Pyr.Form.Label>Keywords</Pyr.Form.Label>
            <Pyr.Form.TextField />
          </Pyr.Form.Group>

          <Pyr.Form.Group name="companies">
            <Pyr.Form.Label>Companies</Pyr.Form.Label>
            <Pyr.Form.AutoComplete url={COMPANIES_URL} multiple valueByID bpSize="small"/>
          </Pyr.Form.Group>

          <Pyr.Form.Group name="categories">
            <Pyr.Form.Label>Categories</Pyr.Form.Label>
            <Pyr.Form.AutoComplete url={CATEGORIES_URL} multiple valueByID bpSize="small"/>
          </Pyr.Form.Group>

          <Pyr.Form.Group name="locations">
            <Pyr.Form.Label>Locations</Pyr.Form.Label>
            <Pyr.Form.AutoComplete url={LOCATIONS_URL} multiple labelKey="full_name" valueByID bpSize="small"/>
          </Pyr.Form.Group>

          <Pyr.Form.Group name="skills">
            <Pyr.Form.Label>Skills</Pyr.Form.Label>
            <Pyr.Form.AutoComplete url={SKILLS_URL} multiple bpSize="small"/>
          </Pyr.Form.Group>
        </Pyr.Form.Form>
        <div className="form-footer">
          <Pyr.Form.SubmitButton target={this.onGetTarget} disabled={this.props.isLoading}>Filter</Pyr.Form.SubmitButton>
        </div>
      </div>
    );
  }
}

CandidatesPage.SearchForm = SearchForm;


export default CandidatesPage;
