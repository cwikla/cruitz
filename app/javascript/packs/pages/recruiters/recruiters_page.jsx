import React, { 
} from 'react';

import PropTypes from 'prop-types';

import {
  Link,
  Redirect
} from 'react-router-dom';

import Pyr, {
  Component
} from '../../pyr/pyr';
const ClassNames = Pyr.ClassNames;
const Grid = Pyr.Grid;

import Page from '../page';
import Sheet from '../sheet';
import Avatar, {
} from '../shared/avatar';

import Recruiter, {
} from '../shared/recruiter';

import {
  RECRUITERS_URL,
  INVITES_URL,
  COMPANIES_URL,
  CATEGORIES_URL,
  LOCATIONS_URL,
  SKILLS_URL,

  SHOW_ACTION,
  INDEX_ACTION,
  NEW_ACTION,

  RANGES,
} from '../const';

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

    this.initState({
      invite: null
    });
  }

  renderButton() {}

  getTemplate() {
    let url = Pyr.URL(INVITES_URL).push("new");

    this.getJSON({
      url: url,
      context: this,

    }).done((data, textStatus, jqXHR) => {
      this.setState({
        invite: data.invite
      });
    });
  }

  componentDidMount() {
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

    this.onItemSearch = this.itemSearch.bind(this);
  }

  itemSearch(name) {
    this.props[name];
    let data = {
      search: {
        companies: [ this.props.item.company.id ]
      }
    };

    let all = {
      data,
      url: RECRUITERS_URL,
      method: Pyr.Method.POST,
      force: true
    };

    this.props.onLoadItems(this.props.onLoading, all);
  }

  key(recruiter) {
    return RecruitersPage.key(recruiter);
  }

  renderItem(item, isSelected) {
    //console.log("RENDER ITEM");
    return (
      <Recruiter.Card
        recruiter={item}
        isSelected={isSelected}
        onLoading={this.props.onLoading}
        onLoadItems={this.props.onLoadItems}
        className="item"
      />
    );
  }

  renderChildren(items, isSelected) {
    //console.log("RENDER CHILDREN");
    return super.renderChildren(items, isSelected, {className: "flx flx-row flx-wrap"});
  }

  renderInnerNoScroll() {
    let items = this.getItems();

    if (!items) {
      //console.log("POS RENDER LOADING");
      //console.log(this.props);
      return this.renderLoading();
    }

    if (items.length == 0) {
      return this.renderNone();
    }

    return super.renderInnerNoScroll();
  }

  renderInner() {

    let leftClasses = "col col-3 flx-col scroll";
    let rightClasses = "col flx-col scroll";

    return (
      <div className="row">
        <div className={leftClasses}>
          <RecruitersPage.SearchForm
            onSetItems={this.onSetSearchItems}
            onError={this.props.onError}
          />
        </div>
        <div className={rightClasses}>
          <div className="flx-col flx-1">
            { this.renderInnerNoScroll() }
          </div>
        </div>
      </div>
    );
  }
}

class ShowSheet extends Sheet.Show {
  key(a) {
    return RecruitersPage.key(a)
  }

  renderItem() {
    return ( <Recruiter.Reviews recruiter={this.props.selected} needReviews/> );
  }
}

class RecruitersPage extends Page {
  name() {
    return "Recruiters";
  }

  loader() {
    return this.props.loaders.recruiters;
  }

  getIndexSheet() {
    return IndexSheet;
  }

  getActionSheet(action) {
    let sheet = Sheet.sheetComponent(action || "Show");
    let ActionSheet = eval(sheet);

    return ActionSheet;
  }
}
function key(item) {
  return "rec-" + item.id;
}
RecruitersPage.key = key;

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
    console.log("SUCCESSS");
    console.log(data);
    this.props.onSetItems(data.recruiters || []);
  }

  preSubmit() {
    this.props.onSetItems(null);
  }

  render() {
    let newUrl = Pyr.URL(RECRUITERS_URL).push(NEW_ACTION);

    return (
      <div className="recruiter-search side-search">
        <div className="search-header">
          <div className="flx-row">
            <div className="mr-auto">Search</div>
              <Link to={newUrl.toString()}><Pyr.UI.IconButton name="plus" className="ml-auto">Invite Recruiter</Pyr.UI.IconButton></Link>
          </div>
        </div>
        <Pyr.Form.Form
          url={Pyr.URL(RECRUITERS_URL).push("search")}
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

        </Pyr.Form.Form>
        <div className="form-footer">
          <Pyr.Form.SubmitButton target={this.onGetTarget} disabled={this.props.isLoading}>Filter</Pyr.Form.SubmitButton>
        </div>
      </div>
    );
  }
}

RecruitersPage.SearchForm = SearchForm;


export default RecruitersPage;
