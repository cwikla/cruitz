import React, { 
  Component
} from 'react';

import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';

import Pyr from '../../pyr/pyr';
const ClassNames = Pyr.ClassNames;

import Page from '../page';
import Sheet from '../sheet';
import MessageThread from '../messages/message_thread';
import RecruiterBlurb from '../shared/recruiter_blurb';

import {
  UserAvatar,
  UserScore,
  Stars,
} from '../../util/user';

import {
  MESSAGES_URL,
  JOBS_URL,
  CANDIDATES_URL
} from '../const';

const ACCEPTED_STATE = 100;
const REJECTED_STATE = -100;

const ID_TO_STATE = {
  0: { name: "New", action: "New"},
  100 : {name: "Accepted", action: "Accept"},
  "-100" : {name: "Passed", action: "Pass"},
  1000 : {name: "Hired", action: "Hire"},
  "-666" : {name: "SPAM",action: "SPAM"},
  "-1000" : {name: "Recalled", action: "Recall"},
  "-5000" : {name: "Cancelled", action: "Cancel"},
};

const NEXT_STATES = {
  0: [100, -100],
  100: [1000, -100],
  "-100": [100],
  1000: [-1000],
  "-666": [100],
  "-5000": [],
};
  

function stateToName(sid) {
  if (sid in ID_TO_STATE) {
    return ID_TO_STATE[sid].name;
  }

  return "Unknown";
}

function stateToAction(sid) {
  if (sid in ID_TO_STATE) {
    return ID_TO_STATE[sid].action;
  }

  return "Unknown";
}

function validNextState(sid) {
  let nexts = NEXT_STATES[sid];
  return nexts ? sid in nexts : false;
}

class CandidateHeader extends Component {
  render() {
    if (!this.props.candidate) {
      return <Pyr.UI.Loading />
    }

    let candidate = this.props.candidate;
    let job = this.props.job;

    //let id ="candidate-header" + this.props.candidate.id;

    let fullName = candidate.first_name + " " + candidate.last_name;
    let phoneNumber = Pyr.Util.scramble(candidate.phone_number || "No Phone");
    let email = candidate.email || "No Email";
    let description = candidate.description || "No Description";

    let clazzes = ClassNames("candidate-header flx-noshrink");
    if (candidate.state < 100) {
      //clazzes.push("blurry-text");
    }

    return (
      <div className={clazzes} >
          <Pyr.Grid.Row className="title">
            <Pyr.Grid.ColFull className="name col col-md-12"><Pyr.UI.SmallLabel>Candidate:</Pyr.UI.SmallLabel><span className="">{fullName}</span></Pyr.Grid.ColFull>
          </Pyr.Grid.Row>
          <Pyr.Grid.Row>
            <Pyr.Grid.ColHalf className="phone-number"><Pyr.UI.SmallLabel>PhoneNumber:</Pyr.UI.SmallLabel><span className="">{phoneNumber}</span></Pyr.Grid.ColHalf>
            <Pyr.Grid.ColHalf className="email"><Pyr.UI.SmallLabel>Email:</Pyr.UI.SmallLabel>{email}</Pyr.Grid.ColHalf>
          </Pyr.Grid.Row>
          <Pyr.Grid.Row>
            <Pyr.Grid.ColHalf className="employer"><Pyr.UI.SmallLabel>Employer:</Pyr.UI.SmallLabel> Hmmmmmm</Pyr.Grid.ColHalf>
            <Pyr.Grid.ColHalf className="cost"><Pyr.UI.SmallLabel>Est. Commission:</Pyr.UI.SmallLabel> $27,000</Pyr.Grid.ColHalf>
          </Pyr.Grid.Row>
          <Pyr.Grid.Row className="flx-row-stretch">
            <Pyr.UI.Icon name="linkedin-square" className="social"/>
            <Pyr.UI.Icon name="github" className="social"/>
            <Pyr.UI.Icon name="dribbble" className="social"/>
            <Pyr.UI.Icon name="quora" className="social"/>
          </Pyr.Grid.Row>
      </div>
    );
  }
}

class CandidateItem extends Component {

  render() {
    let candidate = this.props.candidate;
    let recruiter = candidate.recruiter;
    let state = Pyr.Util.squish(stateToName(candidate.state));

    let id = "candidate-" + candidate.id;
    let allClass = ClassNames("item candidate-item flx-row");

    if (this.props.isSelected) {
       allClass.push("selected");
    }

    allClass.push("state").push(state).push("hover");

    let fullName = candidate.first_name + " " + candidate.last_name;
    let phoneNumber = candidate.phone_number || "No Phone";
    let email = candidate.email || "No Email";
    let description = candidate.description || "No Description";

    return (
      <div className={allClass} id={id}>
        <Pyr.Grid.Column className="item-content">
          <div className="flx-row">
            <div className="state col-md-2">{state}</div>
            <div className="name col-md-3">{fullName}</div>
            <div className="email col-md-3">{email}</div>
            <div className="phone-number col-md-3">{phoneNumber}</div>
          </div>
        </Pyr.Grid.Column>
        <Pyr.Grid.Column className="recruiter col-2 d-flex">
          <UserAvatar
            className={"flx-1"}
            userId={recruiter.id}
            name={recruiter.first_name}
            small
          />
        </Pyr.Grid.Column>
      </div>
    );
  }
}

class CandidateForm extends Component {

  methodToName(method) {
    switch (method) {
      case Pyr.Method.PUT:
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
        method={Pyr.Method.PUT} 
        isLoading={this.state.isLoading}/>
    );
  }
}

class IndexSheet extends Sheet.Index {
  key(item) {
    return CandidatesPage.key(item);
  }

  renderNone() {
    return (
      <div className="empty flx-1 flx-col-stretch">
        <div className="flx-1 flx-row-stretch flx-align-center ml-auto mr-auto">
          <Pyr.UI.Icon name="user-times"/> No candidates have been submitted for this job.
        </div>
      </div>
    );
  }

  sortItems(items) {
    return items;
  }


  childURL(item, isSelected) {
    return Pyr.URL(JOBS_URL).push(item.job_id).push(CANDIDATES_URL).push(item.id);
  }

  renderItem(item, isSelected) {
    return (<CandidateItem candidate={item} isSelected={isSelected} />);
  }
}

class RecruiterMessage extends Component {
  render() {
    let candidate = this.props.candidate;
    if (!candidate.root_message_id) {
      return ( <Pyr.UI.Label>No messages</Pyr.UI.Label>);
    }

    console.log("message id");
    console.log(this.props.candidate);

    if (!this.props.job) {
      return <Pyr.UI.Loading />
    }

    let clazzes = ClassNames("recruiter-message").push(this.props.className);

    return (
      <MessageThread 
        readOnly={this.props.candidate.state < 100}
        className={clazzes}
        messageId={this.props.candidate.root_message_id}
        job={this.props.job}
        url={Pyr.URL(MESSAGES_URL)}
        onSetItem={this.props.onSetItem}
      />
    );
  }

}

const ExperienceItem = (props) => (
  <div className="item">
    <div><Pyr.UI.Label>{props.item.title} @ {props.item.organization}</Pyr.UI.Label> </div>
    <div><Pyr.UI.Label>{props.item.year_start} - {props.item.year_end || "Current"}</Pyr.UI.Label></div>
    <div>{props.item.description}</div>
  </div>
);

class Experience extends Component {
  render() {
    if (!this.props.experience || this.props.experience.length == 0) {
      return null;
    }

    let experience = this.props.experience;

    return (
      <div id="experience" className="cv-section">
      {
        experience.map( (item, pos) => {
          return (<ExperienceItem item={item} key={"exp"+pos}/>);
        })
      }
      </div>
    );
  }
}

const EducationItem = (props) => (
  <div className="item">
    <div><Pyr.UI.Label>{props.item.degree} @ {props.item.school}</Pyr.UI.Label> </div>
    <div><Pyr.UI.Label>{props.item.year_start} - {props.item.year_end || "Current"}</Pyr.UI.Label></div>
  </div>
);

class Education extends Component {
  render() {
    if (!this.props.education || this.props.education.length == 0) {
      return null;
    }

    let education = this.props.education;

    return (
      <div id="education" className="cv-section">
      {
        education.map( (item, pos) => {
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
      return null;
    }

    let skills = this.props.skills;

    return (
      <div id="skills" className="cv-section">
        {
          skills.map( (item, pos) => {
            return (<Pyr.UI.FancyLabel key={"sk"+pos}>{item}</Pyr.UI.FancyLabel>);
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

    return (
      <div className={allClass} id={id}>
        <CandidateHeader 
          candidate={candidate}
          job={job}
          onSetItem={this.props.onSetItem}
        />
        <Pyr.UI.Label className="cv-label">Experience</Pyr.UI.Label>
        <Experience experience={candidate.experience} />
        <Pyr.UI.Label className="cv-label">Education</Pyr.UI.Label>
        <Education education={candidate.education} />
        <Pyr.UI.Label className="cv-label">Skills</Pyr.UI.Label>
        <Skills skills={candidate.skills} />
        <Pyr.UI.Label className="cv-label">Messages</Pyr.UI.Label>
        <RecruiterMessage 
          className=""
          job={job}
          candidate={candidate} 
          onSetItem={this.props.onSetItem}
        />
      </div>
    );
  }
}

class ShowSheet extends Sheet.Show {
  constructor(props) {
    super(props);
    this.state = {
      job: null,
      showMessages: true
    };

  }

  candidateStateUpdate(state) {
    let candidate = this.props.selected;

    let url = Pyr.URL(CANDIDATES_URL).push(candidate.id);
    candidate = Object.assign({}, candidate, { state });

    this.getJSON({
      url: url,
      context: this,
      type: Pyr.Method.PUT,
      data: { candidate : { state } },
      //contentType:"application/json; charset=utf-8",

    }).done((data, textStatus, jaXHR) => {
      this.setCandidate(data.candidate);

    }).fail((jaXHR, textStatus, errorThrown) => {
      Pyr.ajaxError(jaXHR, textStatus, errorThrown);

    });
  }

  candidateStateChange(sid, e) {
    console.log("F");
    console.log(sid);
    console.log("E");
    console.log(e);
    this.candidateStateUpdate(sid);
  }

  setCandidate(candidate) {
    console.log(candidate);
    this.props.onAddItem(candidate);
    this.props.onSelect(candidate);
  }

  setJob(job) {
    this.setState({
      job
    });
  }

  getJob(jobId) {
    let url = Pyr.URL(JOBS_URL).push(jobId);

    this.setState({
      job: null
    });

    this.getJSON({
      url: url,
      context: this,

    }).done((data, textStatus, jaXHR) => {
      this.setJob(data.job);

    }).fail((jaXHR, textStatus, errorThrown) => {
      Pyr.ajaxError(jaXHR, textStatus, errorThrown);

    });
  }

  componentDidUpdate(prevProps, prevUpdate) {
    let pid = prevProps.jobId;
    let cid = this.props.jobId;

    if (pid != cid) {
      this.getJob(cid);
    }
  }

  componentWillMount() {
    console.log("WILL MOUNT");
    console.log(this.props);
    this.getJob(this.props.jobId);
  }

  key(item) {
    return CandidatesPage.key(item);
  }

  renderButtons(curState) {
    let self = this;
    let nexts = NEXT_STATES[curState];
    let name = stateToName(curState);

    return (
      <div className="ml-auto">
      {
        nexts.map( (state, pos) => {
          let nextName = stateToName(state);
          let action = stateToAction(state);
  
          if (pos == 0) {
            return (
              <Pyr.UI.PrimaryButton key={state} className={"ml-auto "+ nextName} onClick={self.candidateStateChange.bind(self, state)}>{action}</Pyr.UI.PrimaryButton>
            );
          }
          return ( 
            <Pyr.UI.Button key={state} className={nextName} onClick={self.candidateStateChange.bind(self, state)}>{action}</Pyr.UI.Button>
          );
        })
      }
      </div>
    );
  }

  renderHeader(candidate) {
    if (!candidate) {
      return null;
    }

    console.log("RENDER HEADER");
    console.log(candidate);
    let stateName = stateToName(candidate.state);
    let clazzes = ClassNames("actions flx-row p-1 flx-start").push("state").push(stateName).push("background");


    return (
      <div className={clazzes}>
        <UserScore className="flx-align-content-start">88</UserScore>
        { this.renderButtons(candidate.state) }
      </div>
    );
  }

  renderItem(candidate, isSelected) {
    let clazzes = ClassNames(this.state.showMessages ? "" : "hide");
    let recruiter = candidate.recruiter;

    console.log("RECRUITER ITEM CANDIDATE");
    console.log(candidate);

    if (!this.state.job) {
      return ( <Pyr.UI.Loading /> );
    }

    return (
      <Pyr.Grid.Row className="candidate-item">
        <Pyr.Grid.Col className="flx-col left">
          <Pyr.UI.Scroll>
            <CandidateCVItem 
              candidate={candidate} 
              isSelected={isSelected} 
              job={this.state.job}
            />
          </Pyr.UI.Scroll>
 
        </Pyr.Grid.Col>
        <Pyr.Grid.Col className="col-3 right">
          <RecruiterBlurb recruiter={recruiter}/>
        </Pyr.Grid.Col>
      </Pyr.Grid.Row>
    );
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

class CandidatesPage extends Page {
  getInitState(props) {
    return {
      job: props.jobMap[props.itemId], // placeholder until we can fetch the full one
      fullDetail: false
    };
  }

  name() {
    return "Candidates";
  }

  render_table() {
    return (
      <CandidateTable 
        {...this.props}
        items={this.state.items}
        selected={this.getSelected()}
        onSetAction={this.props.onSetAction}
        onSetUnaction={this.props.onSetUnaction}
        onSelect={this.onSelect}
        onUnselect={this.onUnselect}
        onLoadItems={this.onLoadItems}
      />
    );
  }

  indexSheet() {
    console.log("CANDINDEX");

    return (
      <IndexSheet
        {...this.props}
        items={this.state.items}
        onSetAction={this.props.onSetAction}
        onSetUnaction={this.props.onSetUnaction}
        onSelect={this.onSelect}
        onUnselect={this.onUnselect}
        onLoadItems={this.onLoadItems}
      />
    );
  }

  actionSheet(action) {
    console.log("ACDTION SHEET?: ");
    let sheet = Sheet.sheetComponent(action || "Show");
    let ActionSheet = eval(sheet);

    return (
      <ActionSheet
        {...this.props}
        itemId={this.props.subItemId}
        jobId={this.props.itemId}
        selected={this.getItem(this.props.subItemId)}
        jobMap={this.props.jobMap}
        onAction={this.onAction}
        onUnaction={this.onUnaction}
        onSelect={this.onSelect}
        onUnselect={this.onUnselect}
        onLoadSelected={this.onLoadSelected}
        onAddItem={this.onAddItem}
      />
    );

  }

  loadSelected(itemId, onLoading) {
    console.log("GET ITEM: " + itemId);

    let me = this;

    this.getJSON({
      url: Pyr.URL(CANDIDATES_URL).push(itemId),
      context: me,
      loading: onLoading,

    }).done((data, textStatus, jaXHR) => {
        me.onSelect(data.candidate);

    }).fail((jaXHR, textStatus, errorThrown) => {
      Pyr.ajaxError(jaXHR, textStatus, errorThrown);
    });
  }

  loadItems() {
    this.getCandidates(this.props.itemId);
  }

  getCandidates(jobId) {
    console.log("GET CANDIDATES: " + jobId);
    let url = null;

    if (jobId) {
      url = Pyr.URL(JOBS_URL).push(jobId).push(CANDIDATES_URL);
    }
    else {
      url = Pyr.URL(CANDIDATES_URL);
    }

    this.getJSON({
      url: url,
      context: this,
      loading: this.onLoading,

    }).done((data, textStatus, jaXHR) => {
      this.jobLoad(data.job, data.candidates);

    }).fail((jaXHR, textStatus, errorThrown) => {
      Pyr.ajaxError(jaXHR, textStatus, errorThrown);

    });
  }

  jobLoad(job, candidates) {
    this.setItems(candidates);
    this.setState({
      job
    });
  }

  componentDidUpdate(prevProps, prevState) {
     console.log("Did Update");
    //alert(this.props.job);
    if(this.props.job){
     //alert(this.props.job.uuid);
    }
    let prevId = prevProps.itemId;
    let nextId = this.props.itemId;

    console.log("PREV: " + prevId);
    console.log("NEXT: " + nextId);

    if (prevId != nextId) {
      this.setItems(null);
      this.getCandidates(nextId);
    }
  }
}

function key(item) {
  return "cand-" + item.id;
}

CandidatesPage.key = key;


export default CandidatesPage;
