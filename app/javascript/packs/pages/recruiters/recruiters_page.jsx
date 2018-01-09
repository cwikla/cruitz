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
  UserScore,
  Stars
} from '../shared/user';

import {
  RECRUITERS_URL,
  INVITES_URL,

  SHOW_ACTION,
  INDEX_ACTION,
  NEW_ACTION
} from '../const';

class ReviewItem extends Component {
  render() {
    let review = this.props.review;

    return (
      <div key={review.id} className="review">
        <div><Stars rating={review.score} /></div>
        <div><Pyr.UI.MagicDate date={review.created_at} /></div>
        <div>{review.from_user.first_name}</div>
        <div>{review.description}</div>
      </div>
    );
  }
}

class RecruiterItem extends Component {

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
          <Stars rating={recruiter.score} />
        </Pyr.Grid.Column>
        <Pyr.Grid.Column className="item-content">
          <div className="info">
            <div>{recruiter.first_name}</div>
            <div>FakeCompany Placeholder</div>
            <div>Description goes here</div>
          </div>
          <div className="stats">
            <div>22 successful placements</div>
            <div>Last Active: 3/3/2017</div>
            <div>27 Reviews</div>
          </div>
        </Pyr.Grid.Column>
      </div>
    );
  }

}


class FullRecruiterItem extends Pyr.Network.Component {
  constructor(props) {
    super(props);
  
    this.state = {
      reviews: []
    };
  }

  setReviews(reviews) {
    this.setState({
      reviews
    });
  }

  getReviews() {
    let url = Pyr.URL(RECRUITERS_URL).push(this.props.recruiter.id).set("reviews", "1");

    console.log("REVIEWS URL");
    console.log(url);

    this.getJSON({
      url: url,

    }).done((data, textStatus, jqXHR) => {
      this.setReviews(data.recruiter.reviews);

    }).fail((jqXHR, textStatus, errorThrown) => {
      Pyr.Network.ajaxError(jqXHR, textStatus, errorThrown);

    });
  }

  componentWillMount() {
    super.componentWillMount();
    this.getReviews();
  }

  renderReviews() {
    if (!this.state.reviews || this.state.reviews.length == 0) {
      return null;
    }

    return this.state.reviews.map((review) => {
      return (
        <ReviewItem key={review.id} review={review} />
      );
    });
  }

  render() {
    return (
      <div>
        <RecruiterItem recruiter={this.props.recruiter} />
  
        <div className="reviews">
          {this.renderReviews()}
        </div>
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
      <div className="form-parent section">
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
            <Pyr.Grid.Col>
              <Pyr.Form.Group name="first_name">
                <Pyr.Form.Label>Name</Pyr.Form.Label>
                <Pyr.Form.TextField placeholder= "First"/>
              </Pyr.Form.Group>
            </Pyr.Grid.Col>
 
            <Pyr.Grid.Col> 
              <Pyr.Form.Group name="last_name">
                <Pyr.Form.Label>&nbsp;</Pyr.Form.Label>
                <Pyr.Form.TextField placeholder= "Last"/>
              </Pyr.Form.Group>
            </Pyr.Grid.Col>
          </div>
     
          <Pyr.Grid.Col> 
            <Pyr.Form.Group name="email">
              <Pyr.Form.Label>Email</Pyr.Form.Label>
              <Pyr.Form.TextField placeholder="Email"/>
            </Pyr.Form.Group>
          </Pyr.Grid.Col>

          <Pyr.Grid.Col>
            <Pyr.Form.Group name="use_default">
              <Pyr.Form.CheckBox value="1" onChange={this.onHandleChange} > Default Introduction</Pyr.Form.CheckBox>
            </Pyr.Form.Group>
          </Pyr.Grid.Col>

          <Pyr.Grid.Col>
            <Pyr.Form.Group name="body">
              <Pyr.Form.Label>Introduction</Pyr.Form.Label>
              <Pyr.Form.TextArea 
                rows="10" 
                id="body" 
                ref={node => this.body = node} 
                onChange={this.onTextChange}
              />
            </Pyr.Form.Group>
          </Pyr.Grid.Col>
        </Pyr.Form.Form>

      <div className="form-footer">
        <Pyr.Form.SubmitButton target={this} disabled={this.props.isLoading}>{this.methodToName(method)}</Pyr.Form.SubmitButton>
      </div>
      </div>
    );
  }
}


class NewSheet extends Sheet.New {

  constructor(props) {
    super(props);

    this.mergeState({
      invite: null
    });
  }

  getTemplate() {
    let url = Pyr.URL(INVITES_URL).push("new");

    this.getJSON({
      url: url,
      context: this,

    }).done((data, textStatus, jqXHR) => {
      this.setState({
        invite: data.invite
      });
    }).fail((jqXHR, textStatus, errorThrown) => {
      Pyr.Network.ajaxError(jqXHR, textStatus, errorThrown);

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
        <Pyr.UI.Loading />
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
              <Link to="/recruiters/new"><Pyr.UI.PrimaryButton><Pyr.UI.Icon name="plus"/> Invite Recruiter</Pyr.UI.PrimaryButton></Link>
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

class ShowSheet extends Sheet.ShowFull {
  key(a) {
    return RecruitersPage.key(a)
  }

  renderItem() {
    return ( <FullRecruiterItem recruiter={this.props.selected} needReviews/> );
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
      onLoading: onLoading,
    }).done((data, textStatus, jqXHR) => {
        this.onSetItems(data.recruiters || []);

    }).fail((jqXHR, textStatus, errorThrown) => {
      Pyr.Network.ajaxError(jqXHR, textStatus, errorThrown);
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
