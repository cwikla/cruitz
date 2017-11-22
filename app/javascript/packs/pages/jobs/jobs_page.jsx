import React, { 
  Component
} from 'react';

import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';

import {
  BrowserRouter as Router,
  Link,
  Redirect
} from 'react-router-dom';


import Pyr from '../../pyr/pyr';
const ClassNames = Pyr.ClassNames;

import Page from '../page';
import Sheet from '../sheet';

import { 
  getLogo 
} from '../../util/user';

import {
  JOBS_URL,
  SEARCH_URL,

  NEW_ACTION,
  SHOW_ACTION
} from '../const';

function methodToName(method) {
  switch (method) {
    case Pyr.Method.PUT:
      return "Update";
      break

    default:
      return "Add";
      break;
  }
}

class JobCard extends Component {
  render() {
    let job = this.props.job;

    let id = "job-" + job.id;
    let allClass = ClassNames("item job-item");

    if (this.props.selected) {
       allClass.push("selected");
    }
    let description = job.description || "No Description";

    return (
      <div className={ClassNames("card").push(allClass)}>
        <div className="view overlay hm-white-slight">
          <img src={getLogo(id)} className="img-fluid" alt="" />
          <a>
              <div className="mask"></div>
          </a>
        </div>
        <div className="card-body">
            <a className="activator"><i className="fa fa-share-alt"></i></a>
            <h4 className="card-title">Card title</h4>
            <hr/>
            <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
            <a href="#" className="black-text d-flex flex-row-reverse">
                <h5 className="waves-effect p-2">Read more <i className="fa fa-chevron-right"></i></h5>
            </a>
        </div>
      </div>
    );
  }
}

class JobItem extends Component {

  render() {
    if (this.props.card) {
      return (
        <JobCard {...this.props}/>
      );
    }

    let job = this.props.job;
    
    let id = "job-" + job.id;
    let allClass = ClassNames("item job-item flx-row");
    
    if (this.props.selected) {
       allClass.push("selected");
    }  
    
    let description = job.description || "No Description";
    
    return (
      <div className={allClass} id={id}>
        <Pyr.Grid.Column className="job col-6">
          <div>{job.title}</div>
          <div>Created: <Pyr.MagicDate date={job.created_at}/></div>
        </Pyr.Grid.Column>
        <Pyr.Grid.Column className="content">
          <div>Total: {job.candidate_counts.total}</div>
          <div>Accepted: {job.candidate_counts.accepted}</div>
          <div>New: {job.candidate_counts.waiting}</div>
          <div>Rejected: {job.candidate_counts.rejected}</div>
        </Pyr.Grid.Column>
      </div>
    );
  }


}

class JobForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      skills: []
    };

    this.onAddSkill = this.addSkill.bind(this);
    this.onRemoveSkill = this.removeSkill.bind(this);
  }

  addSkill(e) {
    let value = e.target.value;
    if (value && value.length > 1) {
      let skills = this.state.skills.slice();

      skills.push(value);
      this.setState({
        skills
      });
      this.skillField.setText("");
    }
  }

  removeSkill(pos, e) {
    if (pos < 0 || pos >= this.state.skills.length) {
      return;
    }

    let skills = this.state.skills;
    skills = skills.slice(0,pos).concat(skills.slice(pos+1, skills.length));
    this.setState({
      skills
    });
  }


  renderSkillList() {
    return (
          <div id="skill-list">
            { Pyr.Util.times(this.state.skills.length, (i) => {
                return (
                  <Pyr.FancyButton 
                    key={"skb"+i}
                    onClick={this.removeSkill.bind(this, i)}
                  >{this.state.skills[i]}</Pyr.FancyButton>
                );
              })
            }
          </div>
    );
  }

  render() {
    let key = "job-form";
    let url = Pyr.URL(JOBS_URL);

    if (this.props.selected){
      url = url.push(this.props.selected.id);
      key = key + "-" + this.props.selected.id;
    }

    let method = this.props.method || Pyr.Method.POST;

    //alert("Render FOrm Job " + this.props.selected.id);


    return (
      <div className="form-parent">
        <Pyr.Form.Form
          model="Job"
          object={this.props.selected}
          url={url}
          method={method}
          id="job-form" 
          key={key}
          ref={(node) => { this.form = node; }} 
          onPreSubmit={this.props.onPreSubmit} 
          onPostSubmit={this.props.onPostSubmit}
          onSuccess={this.props.onSuccess}
          onError={this.props.onError}
        >
      
          <Pyr.Form.Group name="title">
            <Pyr.Form.Label>Title</Pyr.Form.Label>
            <Pyr.Form.TextField placeholder= "Enter job title"/>
          </Pyr.Form.Group>
      
          <Pyr.Form.Group name="location">
            <Pyr.Form.Label>Location</Pyr.Form.Label>
            <Pyr.Form.TextField placeholder="Enter location" />
          </Pyr.Form.Group>
      
          <Pyr.Form.Group name="time_commit">
            <Pyr.Form.Label>Time Requirements</Pyr.Form.Label>
            <Pyr.Form.Select>
              <Pyr.Form.Option value="0">Full Time</Pyr.Form.Option>
              <Pyr.Form.Option value="1">Part Time</Pyr.Form.Option>
              <Pyr.Form.Option value="2">Contractor</Pyr.Form.Option>
            </Pyr.Form.Select>
          </Pyr.Form.Group>

          <Pyr.Form.Group name="skill" className="skill">
            <Pyr.Form.Label>Desired Skills</Pyr.Form.Label>
            <Pyr.Form.TextField placeholder="Add Skill" onSubmit={this.onAddSkill} ref={(node) => {this.skillField = node}}/>
          </Pyr.Form.Group>

          <Pyr.Form.Group name="skill" className="hidden">
            { Pyr.Util.times(this.state.skills.length, (i) => {
                return (
                  <Pyr.Form.Hidden key={"skill"+i} value={this.state.skills[i]} />
                );
              })
            }
          </Pyr.Form.Group>

          { this.renderSkillList() }

          <Pyr.Form.Group name="description">
            <Pyr.Form.Label>Description</Pyr.Form.Label>
            <Pyr.Form.TextArea placeholder="Enter description" rows="10" />
          </Pyr.Form.Group>

      
        </Pyr.Form.Form>
      <div className="form-footer">
        <Pyr.Form.SubmitButton target={this} disabled={this.props.isLoading}>{methodToName(method)}</Pyr.Form.SubmitButton>
      </div>
      </div>
    );
  }
}

class EditSheet extends Sheet.Edit {
  success(data, textStatus, jqXHR) {
    this.props.onJobUpdate(data.job);
  }

  renderForm() {
    //alert("JOB EDIT " + this.props.selected.id);
    return (
      <JobForm 
        onPreSubmit={this.onPreSubmit} 
        onPostSubmit={this.onPostSubmit} 
        job={this.props.selected} 
        onSuccess={this.onSuccess}
        method={Pyr.Method.PUT} 
        isLoading={this.state.isLoading}/>
    );
  }
}

class IndexSheet extends Sheet.Index {
  constructor(props) {
    super(props);

    this.onAddJob = this.addJob.bind(this);
  }

  addJob(e) {
    if (e) {
      e.preventDefault();
    }

    this.props.onSetAction(NEW_ACTION);
  }

  key(job) {
    return JobsPage.key(job);
  }

  renderItem(job, isSelected) {
    return (
      <JobItem 
        job={job} 
        isSelected={isSelected}
        card={this.props.card}
      />
    );
  }

  renderChildrenCard(items, selected) {
    return (
      <div className="d-flex flx-wrap" key="job-stuff">
        { items.map( (item, pos) => {
            let key="job-item-"+item.id;
            let isSelected = this.same(item, selected);
            return (<div key={key} className="spacer">{this.renderItem(item, isSelected)}</div>);
          })
        }
      </div>
    );
  }

  renderChildren(items, isSelected) {
    if (this.props.card) {
      return this.renderChildrenCard(items, isSelected);
    }
    return super.renderChildren(items, isSelected);
  }

  renderSearch() {
    let url = Pyr.URL(SEARCH_URL).push("jobs");

    return (
        <Pyr.Form.Form
          className="search-form d-flex flx-1"
          model="search"
          url={url}
          ref={(node) => {this.form = node;}}
        >
          <Pyr.Form.Group name="search" className="flx-row flx-1">
            <i className="fa fa-search"></i><Pyr.Form.TextField placeholder="Search..." className="flx-1"/>
          </Pyr.Form.Group>
        </Pyr.Form.Form>
    );
  }   

  renderButtons() {
    return(
      <div className="d-flex flx-row flx-1 flx-end">
        <Pyr.Button onClick={this.onAddJob}><Pyr.Icon name="plus">Add Job</Pyr.Icon></Pyr.Button>
      </div>
    );
  }


  renderHeader() {
    return (
      <div className="jobs-index-header">
          <div className="job-new p-1 d-flex flx-end">
              <Link to="/jobs/new"><Pyr.PrimaryButton><Pyr.Icon name="plus"/> Add Job</Pyr.PrimaryButton></Link>
          </div>
      </div>
    );
  }

  renderNone() {
    return (
      <div className="empty flx-col flx-align-center flx-justify-center">
        <div className="">Welcome to <b>cruitz</b>!</div>
        <p/>
        <div>You currently have no open jobs. To begin receiving candidates from our recruiting network</div>
        <div>add a new job.</div>
      </div>
    );
  }


}

class ShowSheet extends Sheet.Show {
  key(job) {
    return JobsPage.key(job);
  }

  renderItem(job, isSelected) {
    return (
        <JobItem 
          job={job} 
          selected={isSelected}
        />
    );
  }
}

class NewSheet extends Sheet.New {
  getInitState(props) {
    return {
    };
  }

  success(data, textStatus, jqXHR) {
    this.props.onJobCreate(data.job);
    super.success(data, textStatus, jqXHR);
    this.context.setNotice("Job Created");
  }

  title() {
    return "Add a New Job";
  }

  renderForm() { 
    return ( 
      <JobForm 
        onPreSubmit={this.onPreSubmit} 
        onPostSubmit={this.onPostSubmit} 
        onSuccess={this.onSuccess}
      />
    );
  }
}

class JobsPage extends Page {
  name() {
    return "Jobs";
  }

  getItems() {
    return this.props.jobs;
  }

  loadItems() {
    this.onSetItems(this.props.jobs);
  }

  indexSheet() {
    return (
      <IndexSheet
        {...this.props}
        items={this.props.jobs}
        jobs={this.props.jobs}
        jobMap={this.props.jobMap}
        onSelect={this.onSelect}
        onSetAction={this.props.onSetAction}
        onSetUnaction={this.props.onSetUnaction}
        onLoadItems={this.onLoadItems}
        card={false}
      />
    );
  }

  actionSheet(action) {
    let sheet = Sheet.sheetComponent(action || "Show");
    let ActionSheet = eval(sheet);

    return (
      <ActionSheet
        {...this.props}
        selected={this.getSelected()}
        jobs={this.props.jobs}
        jobMap={this.props.jobMap}
        onSetAction={this.props.onSetAction}
        onSetUnaction={this.props.onSetUnaction}
        onLoadSelected={this.onLoadSelected}
      />
    );

  }

}

function key(item) {
  return item.id;
}
JobsPage.key = key;

class SearchForm extends Component {
  render() {
    return (
      <div className="job-search">
        <Pyr.Form.Form
          url={JOBS_SEARCH_URL}
          method={Pyr.Method.POST}
          ref={(node) =>{ this.form = node; }}
          onPreSubmit={this.props.onPreSubmit}
          onPostSubmit={this.props.onPostSubmit}
          onSuccess={this.props.onSuccess}
          onError={this.props.onError}
        >
          <Pyr.Form.Group name="title">
            <Pyr.Form.Label>Title</Pyr.Form.Label>
            <Pyr.Form.TextField placeholder= "Enter job title"/>
          </Pyr.Form.Group>

        </Pyr.Form.Form>
      </div>
    );
  }
}

JobsPage.SearchForm = SearchForm;

 

export default JobsPage;
