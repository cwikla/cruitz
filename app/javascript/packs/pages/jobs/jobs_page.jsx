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

import Page from '../page';
import Sheet from '../sheet';

import Job from '../shared/job';

import { 
  getLogo 
} from '../shared/user';

import {
  JOBS_URL,
  SEARCH_URL,
  CATEGORIES_URL,
  LOCATIONS_URL,
  COMPANY_URL,
  SKILLS_URL,

  NEW_ACTION,
  SHOW_ACTION
} from '../const';

function methodToName(method) {
  switch (method) {
    case Pyr.Method.PATCH:
      return "Save";
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
          <div>{job.id}:{job.title}</div>
          <div>Created: <Pyr.UI.MagicDate date={job.created_at}/></div>
        </Pyr.Grid.Column>
        <Pyr.Grid.Column className="item-content">
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

    this.onGetTarget = this.getTarget.bind(this);
  }

  renderCategories() {
    let cats = this.props.categories;

    if (!cats) {
      return null;
    }

    return cats.map( (item, pos) => {
      return (
        <Pyr.Form.Option value={item.id} key={"cat_"+item.id}>{item.name}</Pyr.Form.Option>
      );
    })

  }

  renderCompany() {
    if (!this.props.company || !this.props.company.name) {
      return (
        <Pyr.Form.Group name="company" key="company">
          <Pyr.Form.Label>Company</Pyr.Form.Label>
            <Link to={Pyr.URL(COMPANY_URL).toString()}><Pyr.UI.PrimaryButton><Pyr.UI.Icon name="plus"/> Add Company</Pyr.UI.PrimaryButton></Link>
        </Pyr.Form.Group>
      );
    }

    return (
      <h3 className="company-name">{ this.props.company.name }</h3>
    );

  }

  getTarget() {
    //console.log("GETTING TARGET");
    //console.log(this.form);
    return this.form;
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
      <div className="form-parent section">
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

          { this.renderCompany() }

          <Pyr.Form.Group name="title">
            <Pyr.Form.Label>Title</Pyr.Form.Label>
            <Pyr.Form.TextField placeholder= "Enter job title"/>
          </Pyr.Form.Group>

          <Pyr.Form.Group name="category">
            <Pyr.Form.Label>Category</Pyr.Form.Label>
            <Pyr.Form.Select>
              { this.renderCategories() }
            </Pyr.Form.Select>
          </Pyr.Form.Group>
      
          <Pyr.Form.Group name="locations">
            <Pyr.Form.Label>Location(s)</Pyr.Form.Label>
            <Pyr.Form.AutoComplete url={LOCATIONS_URL} multiple labelKey="full_name" valueByID/>
          </Pyr.Form.Group>

          <div className="flx-row">
            <Pyr.Form.Group name="salary">
              <Pyr.Form.Label>Salary</Pyr.Form.Label>
              <Pyr.Form.TextField placeholder="Salary" />
            </Pyr.Form.Group>

            <Pyr.Form.Group name="salary_doe">
              <Pyr.Form.Label>DOE</Pyr.Form.Label>
              <Pyr.Form.CheckBox />
            </Pyr.Form.Group>
          </div>

          <Pyr.Form.Group name="skills">
            <Pyr.Form.Label>Skills</Pyr.Form.Label>
            <Pyr.Form.AutoComplete url={SKILLS_URL} multiple allowNew />
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
        <Pyr.Form.SubmitButton target={this.onGetTarget} disabled={this.props.isLoading}>{methodToName(method)}</Pyr.Form.SubmitButton>
      </div>
      </div>
    );
  }
}

class EditSheet extends Sheet.Edit {
  success(data, textStatus, jqXHR) {
    this.props.onJobUpdate(data.job);
    super.success(data, textStatus, jqXHR);
    this.context.setNotice("Job Saved");
    this.goBack();
  }

  renderButton() {
    return null; // nothing here
  }

  title() {
    return "Edit Job";
  }

  renderForm() {
    return (
      <JobForm
        company={this.user().company}
        selected={this.props.selected}
        onPreSubmit={this.onPreSubmit}
        onPostSubmit={this.onPostSubmit}
        onSuccess={this.onSuccess}
        method={Pyr.Method.PATCH}
        categories={this.props.categories}
      />
    );
  }

  render() {
/*
    if (!this.user().company || !this.user().company.name) {
      return (
        <Redirect to="/company/new" />
      );
    }
*/

    return super.render();
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

    //this.props.onSetAction(NEW_ACTION);
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

  renderHeader() {
    let url = Pyr.URL(JOBS_URL).push(NEW_ACTION);

    return (
      <div className="flx-row">
        <div className="mr-auto">Jobs</div>
        <Link to={url.toString()}><Pyr.UI.IconButton name="plus" className="ml-auto">Add Job</Pyr.UI.IconButton></Link>
        <div className="dropdown ml-auto">
          <Pyr.UI.IconButton name="sort" className="dropdown-toggle pyr-icon-btn" id="jobSortMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" />
          <div className="dropdown-menu" aria-labelledby="jobSortMenuButton">
            <label className="dropdown-header">Sort</label>
            <div className="dropdown-divider"></div>
            <label className="dropdown-item" >Newest</label>
            <label className="dropdown-item" >Oldest</label>
            <label className="dropdown-item" >Most Candidates</label>
          </div>
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
      <div className="flx-row">
        <div className="flx-col flx-3 left">
          <Job.View job={job} />
        </div>
        <div className="flx-col flx-1 right">
          <Job.Stats job={job} />
        </div>
      </div>
    );
  }

  render() {
    console.log("JOBS SHOW SHEET");
    console.log(this.props);
    return super.render();
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


class NewSheet extends Sheet.New {
  success(data, textStatus, jqXHR) {
    this.props.onJobCreate(data.job);
    super.success(data, textStatus, jqXHR);
    this.context.setNotice("Job Created");
    this.goBack();
  }

  title() {
    return "Add a New Job";
  }

  renderButton() {
    return null; //
  }

  renderForm() { 
    return ( 
      <JobForm 
        company={this.user().company}
        onPreSubmit={this.onPreSubmit} 
        onPostSubmit={this.onPostSubmit} 
        onSuccess={this.onSuccess}
        categories={this.props.categories}
      />
    );
  }
}

class JobsPage extends Page {
  constructor(props) {
    super(props);
    this.initState({
      categories: null
    });

  }

  name() {
    return "Jobs";
  }

  //getItems() {
   // return this.props.jobs;
  //}

  loadItems() {
    this.onSetItems(this.props.jobs);
    if (this.props.jobs && this.props.jobs.length) {
      this.onSelect(this.props.jobs[0]);
    }
  }

  getSelected() {
    if (this.props.itemId) {
      return this.props.jobMap[this.props.itemId];
    }

    return null;
  }

  loadSelected(sid) {
    return; // nothing to see here

    console.log("JOB LOAD SELECTED JOB " + sid);
    console.log(this.props);
    console.log(this.props.jobMap);

    let job = this.props.jobMap[sid];

    console.log("JOB JOB");
    console.log(job);

    this.onSelect(job);
    //this.props.jobMap[sid];
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextProps.jobs != this.props.jobs) {
      this.onSetItems(nextProps.jobs);
    }
  }

  componentWillMount() {
    this.getJSON({
      url: CATEGORIES_URL

    }).done((data, textStatus, jqXHR) => {

      this.setState({
        categories: data.categories
      });
    });
  }

        //jobs={this.props.jobs}
  indexSheet() {
    console.log("JOB INDEX");

    return (
      <IndexShowSheet
        {...this.props}
        items={this.getItems()}
        onSelect={this.onSelect}
        onLoadItems={this.onLoadItems}
        selected={this.getSelected()}
        onLoadSelected={this.onLoadSelected}
        categories={this.state.categories}
        card={false}
      />
    );
  }

  actionSheet(action) {
    action = action || "Show";
    console.log("JOB " + action);

    //if (action.toLowerCase() == "show") {
     // action = 'Edit';
    //}

    let sheet = Sheet.sheetComponent(action || "Show");
    let ActionSheet = eval(sheet);

    return (
      <ActionSheet
        {...this.props}
        items={this.getItems()}
        onSelect={this.onSelect}
        onLoadItems={this.onLoadItems}
        selected={this.getSelected()}
        onLoadSelected={this.onLoadSelected}
        categories={this.state.categories}
        card={false}
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
