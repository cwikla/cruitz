import React from 'react';
import PropTypes from 'prop-types';

import Pyr, {
  Component
} from '../../pyr/pyr';

const ClassNames = Pyr.ClassNames;

import Page from '../page';
import Sheet from '../sheet';
import MessageThread from '../messages/message_thread';
import Recruiter from '../shared/recruiter';

import {
  UserAvatar,
  UserScore,
  Stars,
} from '../shared/user';

import State from '../shared/state';

import {
  MESSAGES_URL,
  JOBS_URL,
  CANDIDATES_URL
} from '../const';

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
    let state = State.toClassName(candidate.state);

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
    console.log("CANDIDATE RENDER ITEM");
    console.log(item);

    return (
      <CandidateItem 
        candidate={item} 
        isSelected={isSelected} 
      />
    );
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
        <Pyr.UI.Label className="cv-label">Files</Pyr.UI.Label>
      </div>
    );
  }
}

class ShowSheet extends Sheet.ShowFull {
  constructor(props) {
    super(props);
    this.initState({
      job: null,
      showMessages: true
    });

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

    }).fail((jaXHR, textStatus, errorThrown) => {
      Pyr.Network.ajaxError(jaXHR, textStatus, errorThrown);

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
      Pyr.Network.ajaxError(jaXHR, textStatus, errorThrown);

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
    let nexts = State.nexts(curState);
    let name = State.toName(curState);

    return (
      <div className="ml-auto">
      {
        nexts.map( (state, pos) => {
          let nextName = State.toName(state);
          let action = State.toAction(state);
  
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
    let stateName = State.toName(candidate.state);
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
      <Pyr.Grid.Row className="item flx-1">
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
          <Recruiter.Blurb recruiter={recruiter}/>
        </Pyr.Grid.Col>
      </Pyr.Grid.Row>
    );
  
  }

  renderUnused() {
    return (
    <div>
      <Pyr.Grid.Row className="flx-1 high">
        <Pyr.Grid.Col>
          <Pyr.UI.Label className="cv-label">Messages</Pyr.UI.Label>
          <RecruiterMessage 
            className=""
            job={this.state.job}
            candidate={candidate} 
            onSetItem={this.props.onSetItem}
          />
        </Pyr.Grid.Col>
      </Pyr.Grid.Row>
      </div>
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
  constructor(props) {
    super(props);

    this.initState({
      job: props.jobMap[props.itemId], // placeholder until we can fetch the full one
      fullDetail: false
    });
  }

  getItemId() {
    return this.props.subItemId;
  }

  getJobId() {
    return this.props.itemId;
  }

  name() {
    return "Candidates";
  }

  render_table() {
    return (
      <CandidateTable 
        {...this.props}
        items={this.getItems()}
        selected={this.getSelected()}
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
        itemId={this.getItemId()}
        items={this.getItems()}
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

    let jobId = this.getJobId();
    let candyId = this.getItemId();

    return (
      <ActionSheet
        {...this.props}
        itemId={candyId}
        items={this.getItems()}
        jobId={jobId}
        selected={this.getSelected()}
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
      onLoading: onLoading,

    }).done((data, textStatus, jaXHR) => {
        me.onSelect(data.candidate);

    }).fail((jaXHR, textStatus, errorThrown) => {
      Pyr.Network.ajaxError(jaXHR, textStatus, errorThrown);
    });
  }

  loadItems() {
    this.getCandidates(this.getJobId());
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

    //url.set("candidates", 1);

    this.getJSON({
      url: url,
      context: this,
      onLoading: this.onLoading,

    }).done((data, textStatus, jaXHR) => {
      this.jobLoad(data.job, data.candidates || data.job.candidates);

    }).fail((jaXHR, textStatus, errorThrown) => {
      Pyr.Network.ajaxError(jaXHR, textStatus, errorThrown);

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
