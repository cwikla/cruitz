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
import WebLink from '../shared/web_link';

import Avatar, {
} from '../shared/avatar';

import State from '../shared/state';
import CV from '../shared/cv';


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

    allClass.push("state");
    if (!candidate.is_unlocked) {
      allClass.push("locked");
    }

    //console.log("CANDIDATE");
    //console.log(candidate);

    return (
      <div key={id} className={allClass}>
        <div className="flx-col flx-1 title">
          <div>{candidate.first_name} {candidate.last_name}</div>
          <div>{candidate.summary}</div>
        </div>
        <State.Bubble state={candidate.state} />
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
      key = SubmittedCandidatesPage.key(this.props.candidate);
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
    return SubmittedCandidatesPage.key(item);
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
        <div className="flx-1 flx-row none">
          No candidates have been submitted for this job.
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

const Match = (props) => (
  <div className="flx-col candidate-match section">
    <Avatar.Score>{props.candidate.score}</Avatar.Score>
  </div>
);

const Fee = (props) => (
  <div className="flx-col candidate-fee section">
    <div className="title">Fee</div>
    <div className="commission">{props.candidate.commission} %</div>
  </div>
);

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

const StateButton = (props) =>  (
   <Pyr.UI.PrimaryButton 
    key={"state-button-" + props.state}
    className={ClassNames(props.className, "state-button").push(State.toName(props.state))} 
    onClick={props.onClick}
  >{props.children}</Pyr.UI.PrimaryButton>
);

class CancelModal extends Pyr.UI.Modal {
  constructor(props) {
    super(props);

    this.initState({
    });

    this.onNextStep = this.nextStep.bind(this);
  }

  title() {
    return "Cancel Candidate";
  }

  nextStep(e) {
    if (e) {
      e.preventDefault();
    }

    this.props.onClick();
    this.props.onClose();
  }

  renderInner() {
    let state = State.STATE_CANCELED;

    let name = State.toName(state);
    let action = State.toAction(state);

    return (
      <div className="cancel-modal inner">
        <div className="section">
          You are about to remove this candidate for consideration for { this.props.job.title }.
          Let us know the reason for removing this candidate.
        </div>
        <div className="section">
          <Pyr.Form.Form
            url={Pyr.URL(CANDIDATES_URL).push(this.props.candidate.id)}
            method={Pyr.Method.DELETE}
            ref={(node) =>{ this.form = node; }}
            onPreSubmit={this.onPreSubmit}
            onPostSubmit={this.props.onPostSubmit}
            onSuccess={this.onNextStep}
            object={{}}
            model="cancel"
            className="cancel-inner"
          >
            <Pyr.Form.Group name="reason">
              <Pyr.Form.Select>
                <Pyr.Form.Option value="0">Candidate has been hired</Pyr.Form.Option>
                <Pyr.Form.Option value="1">Candidate is no longer looking for another job</Pyr.Form.Option>
                <Pyr.Form.Option value="3">Candidate is not interested in this company</Pyr.Form.Option>
                <Pyr.Form.Option value="4">Candidate is not interested in this position</Pyr.Form.Option>
                <Pyr.Form.Option value="5">Unknown</Pyr.Form.Option>
              </Pyr.Form.Select>
            </Pyr.Form.Group>
          </Pyr.Form.Form>
        </div>
        <StateButton key={"sb-unlock-mod-"+name} state={state} onClick={this.onNextStep}>{action}</StateButton>
      </div>
    );
  }
}

class ShowSheet extends Sheet.Show {
  constructor(props) {
    super(props);

    this.initState({
      candidate: null,
      showCancelModal: false,
    });

    this.onCancel = this.cancel.bind(this);
    this.onHideCancel = this.hideCancel.bind(this);
    this.onShowCancel = this.showCancel.bind(this);
    this.onPusherEvent = this.pusherEvent.bind(this);
  }

  hideCancel(e) {
    if (e) {
      e.preventDefault();
    }

    this.setState({
      showCancelModal: false
    });
  }

  showCancel(e) {
    if (e) {
      e.preventDefault();
    }
    this.setState({
      showCancelModal: true
    });
  }

  cancel() {
    let state = State.STATE_CANCELED;
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
    //console.log("SETTING CANDIDATE: " + candidate.id + " = " + candidate.state);
    this.setState({
      candidate
    });

    this.props.loaders.candidates.replace(candidate);
    //console.log(candidate);
  }

  pusherEvent(data) {
    //console.log("PUSHER EVENT!");
    //console.log(data);

    this.setCandidate(data.candidate);
  }

  key(item) {
    return SubmittedCandidatesPage.key(item);
  }

  renderButtons(curState) {
    let candidate = this.props.selected;
    let nexts = State.nexts(curState);

    let state = State.STATE_CANCELED;
    let name = "cancel";
    let action = "Cancel";

    return (
      <div className="state-change">
        <StateButton key={"sb-" + name} state={state} onClick={this.onShowCancel}>{action}</StateButton>
      </div>
    );
  }

  statusTop(candidate) {
    if (!candidate) {
      return null;
    }

    let stateName = State.toName(candidate.state);
    let sclz = ClassNames("state").push(stateName);
    let clazzes = ClassNames("candidate-actions flx-row").push(sclz).push("border-bottom");

    //console.log("RENDER STATUS TOP");
    //console.log(stateName);

    let score = candidate.score;

    return (
      <div className={clazzes}>
        <State.Bar state={candidate.state} candidateStates={candidate.candidate_states} className="mr-auto"/>
        <div className="ml-auto">{ this.renderButtons(candidate.state) }</div>
      </div>
    );
  }

  loadCandidate(candyId) {
    //console.log("LOADING MAIN ITEM");
    //console.log(candyId);
    this.props.loaders.candidates.loadItem(candyId).done(candidate => {
      this.setCandidate(candidate);
    });
  }

  componentDidMount() {
    //console.log("compnent did update");
    //console.log(this.props);

    if (this.props.selected) {
      this.loadCandidate(this.props.selected.id);
    }
  }


  componentDidUpdate(prevProps, prevState) {
    //console.log("compnent did update");
    //console.log(this.props);

    let pid = this.props.selected ? this.props.selected.id : null;
    let lid = prevProps.selected ? prevProps.selected.id : null;

    if (pid && (pid != lid)) {
      this.loadCandidate(pid);
    }
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

    if (!this.state.candidate || (item.id != this.state.candidate.id)) {
      return (
        <Pyr.UI.Loading />
      );
    }

    let candidate = this.state.candidate; // use the loaded one
    //console.log("RENDER candidate state: " + candidate.state);

    //console.log("MESSAGE JOB");
    //console.log(item);

    let job = this.props.job;
    let recruiter = candidate.recruiter;

    //console.log("RECRUITER");
    //console.log(recruiter);

    let locked = !candidate.is_unlocked;

    return (
        <div className="flx-row flx-1">
          <div className="flx-col left flx-5 unlock-modal-below">
            <CancelModal 
              open={this.state.showCancelModal} 
              onClose={this.onHideCancel} 
              candidate={candidate}
              recruiter={recruiter}
              job={job}
              onClick={this.onCancel}
            />

            { this.statusTop(candidate) }
            <div className="flx-col flx-2 cv">
              <Pyr.UI.Scroll>
                <CV.CV
                  candidate={candidate} 
                  isSelected={isSelected} 
                  job={this.state.job}
                  locked={locked}
                />
              </Pyr.UI.Scroll>
 
            </div>
          </div>
          <div className="right flx-2">
            <Match candidate={candidate} job={job} recruiter={recruiter} />
            <Fee candidate={candidate} job={job} recruiter={recruiter} />
          </div>

          <Pyr.Pusher event={"candidate-" + candidate.id} onEvent={this.onPusherEvent} />
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


class SubmittedCandidatesPage extends Page {
  constructor(props) {
    super(props);

    let result = this.updateJobs(props.jobs, props.jobsMap);

    this.initState(result);
  }

  updateJobs(jobs, jobsMap) {
    let result = {
      jobs: jobs,
      jobsMap: jobsMap,
      firstCandidateMap: {},
    };

    if (!jobs || jobs.length == 0) {
      return result;
    }

    let miniJobsMap = {};
    let miniJobs = jobs;
    let candyMap = {};

    if (this.props.candidates) {
      //console.log("REDUCING");

      for(let item in this.props.candidates) {
        miniJobsMap[item.job_id] = jobsMap[item.job_id];
        candyMap[item.job_id] = candyMap[item.job_id] || item;
      }

      //console.log(miniJobsMap);

      miniJobs = [];
      for(let j of jobs) {
        if (miniJobsMap[j.id]) {
          miniJobs.push(j);
        }
      }

      result.jobs = miniJobs;
      result.jobsMap = miniJobsMap;
      result.firstCandidateMap = candyMap;
    }

    return result;
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.jobs != this.props.jobs) {
      let result = this.updateJobs(props.jobs, props.jobsMap);
      this.setState(result);
    }
  }

  getItems() {
    let all = super.getItems();

    //console.log("GET ITEMS");
    //console.log(all);

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
    if (this.props.subItemId) {
      return this.props.subItemId;
    }

    let jid = this.getJobId();
    if (jid) {
      return this.state.firstCandidateMap[jid];
    }

    return null;
  }

  getJobId() {
    if (this.props.itemId) {
      return this.props.itemId;
    }

    if (this.state.jobs && this.state.jobs.length) {
      return this.state.jobs[0].id;
    }

    return null;
  }

  getJob() {
    let jid = this.getJobId();
    if (jid) {
      return this.props.jobsMap[jid];
    }
    return null;
  }

  getJobs() {
    return this.props.jobs;
  }

  getJobsMap() {
    return this.props.jobsMap;
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

    return Object.assign({}, pp, { jobId: this.getJobId(), job: this.getJob(), jobs: this.getJobs(), jobsMap: this.getJobsMap() });
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


SubmittedCandidatesPage.key = (item) => {
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

SubmittedCandidatesPage.SearchForm = SearchForm;


export default SubmittedCandidatesPage;
