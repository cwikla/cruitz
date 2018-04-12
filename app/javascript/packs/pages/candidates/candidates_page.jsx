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

import Avatar, {
} from '../shared/avatar';

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
    let company = candidate.company || "No Company";
    let salary = candidate.salary || "No Salary";

    let clazzes = ClassNames("candidate-header flx-col flx-noshrink");
    if (candidate.state < 100) {
      //clazzes.push("blurry-text");
    }

    return (
      <div className={clazzes} >
        <div className="flx-row flx-1">
          <div className="name mr-auto">{fullName}</div>
        </div>
        <div className="flx-row flx-1">
          <div className="phone-number mr-auto flx-1">{phoneNumber}</div>
          <div className="email mr-auto flx-1">{email}</div>
        </div>
        <div className="flx-row flx-1">
          <div className="employer mr-auto flx-1">{company}</div>
          <div className="cost mr-auto flx-1">{salary}</div>
        </div>
        <div className="social-links flx-row-stretch">
          <Pyr.UI.Icon name="linkedin-square" className="social"/>
          <Pyr.UI.Icon name="github" className="social"/>
          <Pyr.UI.Icon name="dribbble" className="social"/>
          <Pyr.UI.Icon name="quora" className="social"/>
        </div>
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
    let allClass = ClassNames("item candidate-item flx-row");

    if (this.props.isSelected) {
       allClass.push("selected");
    }

    allClass.push("state").push(stateName).push("hover");

    let fullName = candidate.first_name + " " + candidate.last_name;
    let phoneNumber = candidate.phone_number || "No Phone";
    let email = candidate.email || "No Email";
    let description = candidate.description || "No Description";
    let position = "Sr. Software Engineer";
    let company = "Google";
    let yearsExp = "4 years exp";

    return (
      <div className={allClass} id={id}>
        <div className="flx-1 flx-align-center">
          { State.toName(candidate.state) }
        </div>
        <div className="flx-row flx-3 item-content">
          <div className="flx-col flx-1">
            <div className="name">{fullName}</div>
            <div className="position">{position}</div>
            <div className="company">{company}</div>
          </div>
          <div className="flx-col flx-1">
            <div className="email">{email}</div>
            <div className="phoneNumber">{phoneNumber}</div>
            <div className="years">{yearsExp}</div>
          </div>
        </div>
        <div className="flx-col flx-1 recruiter">
          <Avatar.Avatar
            className={"flx-1"}
            userId={recruiter.id}
            name={recruiter.first_name}
            small
          />
        </div>
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

  size() {
    return 5;
  }

  getJobId() {
    return this.props.jobId;
  }

  getJobsMap() {
    return this.props.jobsMap;
  }

  componentDidUpdate(prevProps, prevState) {
    let pid = prevProps.jobId;
    let cid = this.getJobId();

    if (pid != cid) {
      if (cid) {
        this.props.onLoadItems(this.onLoading, {force: true});
      }
    }
  }



  renderHeader() {
    let jobId = this.getJobId();
    let jobsMap = this.getJobsMap();
    

    let job = jobId ? jobsMap[jobId] : null;
    let title = "Candidates";
  
    if (job) {
      title = title + " for " + job.title;
    }

    return (
      <div className="flx-row">
        <div className="mr-auto">{ title } </div>
        <div className="dropdown ml-auto">
          <Pyr.UI.IconButton name="sort" className="dropdown-toggle" id="candySortMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" />
          <div className="dropdown-menu dropdown-menu-right" aria-labelledby="candySortMenuButton">
            <label className="dropdown-header">Sort</label>
            <div className="dropdown-divider"></div>
            <label className="dropdown-item" >Date</label>
            <label className="dropdown-item" >State</label>
            <label className="dropdown-item" >Position</label>
          </div>
        </div>
      </div>
    );
  }


  renderNone() {
    return (
      <div className="empty flx-3 flx-col-stretch">
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
    return (
      <CandidateItem 
        candidate={item} 
        isSelected={isSelected} 
      />
    );
  }

  render() {
    //console.log("CANDIDATES INDEX");
    //console.log(this.props);

    return super.render();
  }
}

class JobItem extends Component {

  render() {
    let job = this.props.job;

    let id = "job-" + job.id;
    let allClass = ClassNames("item job-item flx-col");

    if (this.props.isSelected) {
       allClass.push("selected");
    }

    let description = job.description || "No Description";

    return (
      <div className={allClass} id={id}>
        <div className="flx-row">
          <div className="ml-auto created-at"><Pyr.UI.MagicDate date={job.created_at} mini/></div>
        </div>
        <div className="flx-row">
          <div className="flx-1 title">{job.title}</div>
        </div>
        <div className="flx-row item-content">
          <div className="flx-row">
            <div className="state total">({job.candidate_counts.total})</div>
            <div className="state accepted">({job.candidate_counts.accepted})</div>
            <div className="state new">({job.candidate_counts.waiting})</div>
            <div className="state rejected">({job.candidate_counts.rejected})</div>
          </div>
        </div>
      </div>
    );
  }
}


class JobIndexSheet extends Sheet.Index {
  key(item) {
    return JobsInnerPage.key(item);
  }

  size() {
    return 2;
  }

  renderHeader() {
    return (
      <div className="flx-row">
        <div className="mr-auto">Jobs</div>
        <div className="dropdown ml-auto">
          <Pyr.UI.IconButton name="sort" className="dropdown-toggle" id="jobSortMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" />
          <div className="dropdown-menu" aria-labelledby="jobSortMenuButton">
            <label className="dropdown-header">Sort</label>
            <div className="dropdown-divider"></div>
            <label className="dropdown-item" >Date</label>
            <label className="dropdown-item" >Unread</label>
            <label className="dropdown-item" >Position</label>
          </div>
        </div>
      </div>
    );
  }

  sortItems(items) {
    return items;
  }

  childURL(item, isSelected) {
    //console.log("CHILD URL");
    //console.log(item);

    return Pyr.URL(JOBS_URL).push(item.id).push(CANDIDATES_URL);
  }

  renderItem(item, isSelected) {
    //console.log("CANDIDATE RENDER ITEM");
    //console.log(item);
    //console.log(isSelected);

    return (
      <JobItem 
        job={item} 
        isSelected={isSelected} 
      />
    );
  }

  render() {
    //console.log("JOBS INDEX RENDER");
    //console.log(this.props.items);
    return super.render();
  }
}

class RecruiterMessage extends Component {
  render() {
    let candidate = this.props.candidate;
    if (!candidate.root_message_id) {
      return ( <Pyr.UI.Label>No messages</Pyr.UI.Label>);
    }

    //console.log("message id");
    //console.log(this.props.candidate);

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
    <div className="title">{props.item.title} @ {props.item.organization}</div>
    <div className="years">{props.item.year_start} - {props.item.year_end || "Current"}</div>
    <div className="description">{props.item.description}</div>
  </div>
);

class Experience extends Component {
  render() {
    if (!this.props.experience || this.props.experience.length == 0) {
      return null;
    }

    let experience = this.props.experience;

    return (
      <div id="experience" className="cv-section experience">
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
    <div className="degree">{props.item.degree} @ {props.item.school}</div>
    <div className="years">{props.item.year_start} - {props.item.year_end || "Current"}</div>
  </div>
);

class Education extends Component {
  render() {
    if (!this.props.education || this.props.education.length == 0) {
      return null;
    }

    let education = this.props.education;

    return (
      <div id="education" className="cv-section education">
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
      <div id="skills" className="cv-section skills flx-row">
        {
          skills.map( (item, pos) => {
            return (<div className="skill flx-0 flx-nowrap" key={"sk"+pos}>{item}</div>);
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

class ShowSheet extends Sheet.Show {
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

    });
  }

  candidateStateChange(sid, e) {
    //console.log("F");
    //console.log(sid);
    //console.log("E");
    //console.log(e);
    this.candidateStateUpdate(sid);
  }

  setCandidate(candidate) {
    //console.log(candidate);
    this.props.onAddItem(candidate);
    this.props.onSelect(candidate);
  }

  setJob(job) {
    this.setState({
      job
    });
  }

  getJob(jobId) {
    //console.log("CANDY GET JOB ID: " + jobId);
    if (!jobId) {
      return;
    }

    let url = Pyr.URL(JOBS_URL).push(jobId).set("candidates", "1");

    this.setState({
      job: null
    });

    this.getJSON({
      url: url,
      context: this,

    }).done((data, textStatus, jaXHR) => {
      this.setJob(data.job);
      //console.log("GOT THE JOB");
      //console.log(data);

    });
  }

  componentDidUpdate(prevProps, prevState) {
    let pid = prevProps.jobId;
    let cid = this.props.jobId;

    if (pid != cid) {
      this.getJob(cid);
    }
  }

  componentWillMount() {
    //console.log("WILL MOUNT");
    //console.log(this.props);
    super.componentWillMount();
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
      <div className="">
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

    //console.log("RENDER HEADER");
    //console.log(candidate);
    let stateName = State.toName(candidate.state);
    let sclz = ClassNames("state").push(stateName);
    let clazzes = ClassNames("actions flx-row p-1 flx-start").push(sclz).push("background");

    let score = "88";

    return (
      <div className={clazzes}>
        <Avatar.Score className={ClassNames("flx-align-content-start").push(sclz)}>{score}</Avatar.Score>
        <div className={ClassNames("status ml-auto mr-auto mt-auto mb-auto").push(sclz)}>{stateName}</div>
        { this.renderButtons(candidate.state) }
      </div>
    );
  }

  renderItem(candidate, isSelected) {
    let recruiter = candidate.recruiter;

    //console.log("RECRUITER ITEM CANDIDATE");
    //console.log(candidate);

    if (!this.state.job) {
      //console.log("NO JOB");
      return ( <Pyr.UI.Loading /> );
    }

    let sclass = State.toClassName(candidate.state);

    let clazzes = ClassNames("flx-row item flx-1");
    clazzes.push(this.state.showMessages ? "" : "hide");

    return (
      <div className={clazzes}>
        <div className="flx-col flx-3 section left">
          <Pyr.UI.Scroll>
            <CandidateCVItem 
              candidate={candidate} 
              isSelected={isSelected} 
              job={this.state.job}
            />
          </Pyr.UI.Scroll>
 
        </div>
        <div className="flx-col flx-1 right">
          <Recruiter.Blurb recruiter={recruiter}/>
        </div>
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

class JobsInnerPage extends Page {
  constructor(props) {
    super(props);
  }

  name() {
    return "JobsInner";
  }

  loader() {
    return this.props.loaders.jobs;
  }

  getItemId() {
    return this.props.jobId;
  }

  getSubItemId() {
    return this.props.itemId;
  }
//

  getIndexSheet() {
    return JobIndexSheet;
  }

  render() {
    console.log("JOBS PAGE INNER RENDER");
    console.log(this.props);

    return (
      <div className="flx-col flx-2">
        { this.renderInner() }
      </div>
    );
   }
}
JobsInnerPage.key = (item) => {
  return ('jobs-inner-' + item.id);
}


class JobIndexAndIndexSheet extends Component {
  getJobId() {
    return this.props.itemId;
  }

  getCandidateId() {
    return this.props.subItemId;
  }

  render() {
    let jobId = this.getJobId();
    let candyId = this.getCandidateId();

    let firstCandy = this.props.items && this.props.items.length > 0 ? this.props.items[0] : null;
    candyId = candyId ? candyId : (firstCandy ? firstCandy.id : null);

    console.log("JOBINDEXANDINDEX");
    console.log(this.props);

    return (
      <div className="flx-row flx-1">
        <JobsInnerPage 
          {...this.props} 
          itemId={jobId}
        />
        <IndexSheet
          {...this.props}
          itemId={candyId}
        />
      </div>
    )
  }

}

class CandidatesPage extends Page {
  constructor(props) {
    super(props);
  }

  name() {
    return "Candidates";
  }

  // the ol' switcheroo
  getItemId() {
    return this.props.subItemId;
  }

  getSubItemId() {
    return this.props.itemId;
  }
  //

  loader() {
    return this.props.loaders.candidates;
  }

  getAllJobs() {
    return this.props.jobs;
  }

  getJobId() {
    let jid = this.props.itemId;
    let jobs = this.getAllJobs();

    if (!jid) {
      jid = jobs && jobs.length > 0 ? jobs[0].id : undefined;
    }

    return jid;
  }

  getJob() {
    let jobsMap = this.props.jobsMap;
    let jobId = this.getJobId();

    if (!jobsMap || !jobId) {
      return null;
    }

    return jobsMap[jobId];
  }

  pageProps() {
    let stuff = Object.assign({}, super.pageProps());
    stuff['job'] = this.getJob();
    stuff['jobId'] = this.getJobId();

    return stuff;
  }

  loadItems(onLoading, extra={}) {
    let jobId = this.getJobId();

    if (!jobId) {
      this.loader().reset();
      return; // nothing to see here
    }

    return super.loadItems(onLoading, Object.assign({}, {jobId}, extra));
  }

  getIndexSheet() {
    return JobIndexAndIndexSheet;
  }

  getActionSheet(action) {
    let sheet = Sheet.sheetComponent(action || "Show");
    let ActionSheet = eval(sheet);

    return ActionSheet;
  }

}


CandidatesPage.key = (item) => {
  return "cand-" + item.id;
}


export default CandidatesPage;
