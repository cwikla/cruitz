import React, { 
  Component
} from 'react';

import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';

import {
  Link,
  Redirect
} from 'react-router-dom';



import Pyr from '../../pyr/pyr';
const ClassNames = Pyr.ClassNames;
const Grid = Pyr.Grid;

import Page from './../page';
import Sheet from './../sheet';
import {
  UserAvatar,
  UserScore
} from '../../util/user';

import {
  RECRUITERS_URL,
  INVITES_URL,

  SHOW_ACTION,
  INDEX_ACTION,
  NEW_ACTION
} from '../const';

class RecruiterItem extends Component {
  render() {
    let recruiter = this.props.recruiter;

    return (
      <div id={"recruiter-item-" + recruiter.id} className="recruiter-item row-stretch flx-row">
        <div className="score col-md-1 col-sm-2 blue">
          <UserScore score={recruiter.id} />
        </div>
        <div className="icon hidden-md-down col-md-1 red">
          <UserAvatar userId={recruiter.id} />
        </div>
      </div>
    );
  }

  render() {
    let recruiter = this.props.recruiter;

    let id = "recruiter-" + recruiter.id;
    let allClass = ClassNames("item recruiter-item flx-row");

    if (this.props.selected) {
       allClass.push("selected");
    }

    let fullName = recruiter.first_name + " " + recruiter.last_name;
    let phoneNumber = recruiter.phone_number || "No Phone";
    let email = recruiter.email || "No Email";
    let description = recruiter.description || "No Description";

    return (
      <div className={allClass} id={id}>
        <Pyr.Grid.Column className="recruiter col-2 d-flex">
          <UserAvatar
            className={"flx-1"}
            userId={recruiter.id}
            name={recruiter.first_name}
            small
          />
        </Pyr.Grid.Column>
        <Pyr.Grid.Column className="content">
          <div className="info col-md-5 col-sm-5">
            <div>{recruiter.first_name}</div>
            <div>FakeCompany Placeholder</div>
            <div>Description goes here</div>
          </div>
          <div className="stats col-5">
            <div>22 successful placements</div>
            <div>Last Active: 3/3/2017</div>
            <div>27 Reviews</div>
          </div>
        </Pyr.Grid.Column>
      </div>
    );
  }

}


class InviteForm extends Component {
  constructor(props) {
    super(props);

    this.onHandleChange = this.handleChange.bind(this);
  }

  methodToName(method) {
    return "Invite";
  }

  handleChange(e) {
    if (e.target.checked) {
      this.body.setText(this.body.modelValue());
    } 
    else {
      this.body.setText("");
    }
  }

  render() {
    let key = "invite-form";
    let url = Pyr.URL(INVITES_URL);

    let method = Pyr.Method.POST;

    return (
      <div className="form-parent">
        <Pyr.Form.Form
          model="Invite"
          object={this.props.invite}
          url={url}
          method={method}
          id="invite-form" 
          key={key}
          ref={(node) => { this.form = node; }} 
          onPreSubmit={this.props.onPreSubmit} 
          onPostSubmit={this.props.onPostSubmit}
          onSuccess={this.props.onSuccess}
          onError={this.props.onError}
        >
     
          <div className="flx-row"> 
            <Pyr.Form.Group name="first_name">
              <Pyr.Form.Label>Name</Pyr.Form.Label>
              <Pyr.Form.TextField placeholder= "First"/>
            </Pyr.Form.Group>
  
            <Pyr.Form.Group name="last_name">
              <Pyr.Form.Label>&nbsp;</Pyr.Form.Label>
              <Pyr.Form.TextField placeholder= "Last"/>
            </Pyr.Form.Group>
          </div>
      
          <Pyr.Form.Group name="email">
            <Pyr.Form.Label>Email</Pyr.Form.Label>
            <Pyr.Form.TextField placeholder="Email"/>
          </Pyr.Form.Group>

          <Pyr.Form.Group name="use_default">
            <Pyr.Form.CheckBox value="1" onChange={this.onHandleChange} > Default Introduction</Pyr.Form.CheckBox>
          </Pyr.Form.Group>

          <Pyr.Form.Group name="body">
            <Pyr.Form.Label>Introduction</Pyr.Form.Label>
            <Pyr.Form.TextArea 
              rows="10" 
              id="body" 
              ref={node => this.body = node} 
              onChange={this.onTextChange}
            />
          </Pyr.Form.Group>
        </Pyr.Form.Form>

      <div className="form-footer">
        <Pyr.Form.SubmitButton target={this} disabled={this.props.isLoading}>{this.methodToName(method)}</Pyr.Form.SubmitButton>
      </div>
      </div>
    );
  }
}


class NewSheet extends Sheet.New {

  getInitState(props) {
    return  {
      invite: null
    };
  }

  getTemplate() {
    let url = Pyr.URL(INVITES_URL).push("new");

    this.getJSON({
      url: url,
      context: this,

    }).done((data, textStatus, jaXHR) => {
      this.setState({
        invite: data.invite
      });
    }).fail((jaXHR, textStatus, errorThrown) => {
      Pyr.ajaxError(jaXHR, textStatus, errorThrown);

    });
  }

  componentWillMount() {
    this.getTemplate();
  }

  title() {
    return "Invite a Recruiter";
  }

  success(data, textStatus, jqXHR) {
    super.success(data, textStatus, jqXHR);
    this.context.setNotice("Invite Sent!");
  }

  renderForm() {
    if (!this.state.invite) {
      return (
        <Pyr.Loading />
      );
    }

    return (
      <div>
        <InviteForm
          onPreSubmit={this.onPreSubmit}
          onPostSubmit={this.onPostSubmit}
          onSuccess={this.onSuccess}
          invite={this.state.invite}
        />
      </div>
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

  key(a) {
    return RecruitersPage.key(a)
  }

  renderHeader() {
    return (
      <div className="recruiters-index-header">
          <div className="recruiter-new p-1 d-flex flx-end">
              <Link to="/recruiters/new"><Pyr.PrimaryButton><Pyr.Icon name="plus"/> Invite Recruiter</Pyr.PrimaryButton></Link>
          </div>
      </div>
    );
  }


  renderItem(item, isSelected) {
    return ( <RecruiterItem recruiter={item} isSelected={isSelected} /> );
  }

  renderNone() {
    return (
      <h2> Recruiters Empty</h2>
    );
  }

}

class ShowSheet extends Sheet.Show {
  key(a) {
    return RecruitersPage.key(a)
  }

  renderItem() {
    return ( <RecruiterItem recruiter={this.props.selected}/> );
  }
}

class RecruitersPage extends Page {
  name() {
    return "Recruiters";
  }

  loadItems(onLoading) {
    this.getJSON({
      url: this.props.url,
      context: this,
      loading: onLoading,
    }).done(function(data, textStatus, jaXHR) {
        this.onSetItems(data.recruiters || []);

    }).fail(function(jaXHR, textStatus, errorThrown) {
      Pyr.ajaxError(jaXHR, textStatus, errorThrown);
    });
  }

  indexSheet() {
    return (
      <IndexSheet
        {...this.props}
        items={this.state.items}
        recruiter={this.state.selected}
        onSetAction={this.props.onSetAction}
        onSetUnaction={this.props.onSetUnaction}
        onSelect={this.onSelect}
        onUnselect={this.onUnselect}
        onLoadItems={this.onLoadItems}
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
        onAction={this.onAction}
        onUnaction={this.onUnaction}
      />
    );
    
  }
}
function key(item) {
  return "rec-" + item.id;
}
RecruitersPage.key = key;

export default RecruitersPage;
