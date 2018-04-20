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

import HeadIndexSheet, { 
  HeadForm,
  CandidateComponent 
} from './head';

import Avatar from '../shared/avatar';

import {
  POSITIONS_URL,
  SEARCH_URL,
  CATEGORIES_URL,
  LOCATIONS_URL,
  SKILLS_URL,
  COMPANIES_URL,
  HEADS_URL,

  NEW_ACTION,
  SHOW_ACTION,

  RANGES,
} from '../const';

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
      url: POSITIONS_URL,
      method: Pyr.Method.POST,
      force: true
    };

    this.props.onLoadItems(this.props.onLoading, all);
  }

  key(position) {
    return PositionsPage.key(position);
  }

  renderItem(item, isSelected) {
    //console.log("RENDER ITEM");
    return (
      <Job.Card
        job={item}
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
          <PositionsPage.SearchForm 
            onSetItems={this.props.onSetItems}
            onPreSubmit={this.props.onPreSubmit}
            onPostSubmit={this.props.onPostSubmit}
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

class SubmitSheet extends Sheet.ShowFull {
  key(position) {
    return PositionsPage.key(position);
  }

  renderItem(position, isSelected) {
    //console.log("SUBMIT: renderItem");
    if (!this.props.head) {
      return (
        <Pyr.UI.Loading />
      );
    }

    //console.log("STATE HEAD");
    //console.log(this.props.head);

    //console.log("POSITION");
    //console.log(position);

    return (
      <HeadForm
        position={position}
        head={this.props.head}
      />
    );
  }
}

class ShowSheet extends Sheet.ShowFull {
  constructor(props) {
    super(props);
    this.initState({
      candidates: null,
    });

    this.onSetCandidates = this.setCandidates.bind(this);
    this.onAddCandidate = this.addCandidate.bind(this);
    this.onRemoveCandidate = this.removeCandidate.bind(this);
  }

  asPage() {
    return true;
  }

  setCandidates(candidates) {
    this.setState({
      candidates
    });
  }

  addCompare(a, b) {
    return a.id == b.id;
  }

  addCandidate(candidate) {
    //console.log("ITEM: " + item);
    //console.log(this.getItems());

    if (!candidate) {
      return;
    }

    let candidates = this.state.candidates || [];
    let found = false;

    let copy = candidates.map((val, pos) => {
      if (this.addCompare(val, candidate)) {
        found = true;
        return candidate;
      }
      return val;
    });

    //console.log(copy);
    //console.log("ITEM FOUND: " + found);

    if (!found) {
      copy.push(candidate);
    }
    this.setCandidates(copy);
  }

  removeCandidate(candidate) {
    if (!candidate) {
      return null;
    }

    let candidates = this.state.candidates || [];

    let copy = candidates.filter( item => {
      return item.id != candidate.id;
    });

    this.setCandidates(copy);
  }

  loadCandidates(position, onLoading, props={}) {
    if (!position) {
      //console.log("NO POSITION");
      return;
    }

    //console.log("LOADING CANDIDATES");

    let urlStuff = Object.assign({}, {
      url: Pyr.URL(POSITIONS_URL).push(position.id).push('candidates'),
      context: this,
      onLoading: this.props.onLoading,
    }, props);

    this.getJSON(
      urlStuff
    ).done((data, textStatus, jqXHR) => {
        this.onSetCandidates(data.candidates || []);

    });
  }

  componentDidMount() {
    //console.log("DIDMOUNT");
    //console.log(this.state.candidates);
    super.componentDidMount();

    if (!this.state.candidates) {
      this.loadCandidates(this.props.selected, this.props.onLoading);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    let pid = this.props.selected ? this.props.selected.id : null;
    let lid = prevProps.selected ? prevProps.selected.id : null;

    if (pid != lid) {
      this.loadCandidates(this.props.selected);
    }
  }

  key(position) {
    return PositionsPage.key(position);
  }

  renderItem(position, isSelected) {
    return (
      <Job.View
        job={position} 
        selected={isSelected}
      />
    );
  }

  renderChooser() {
    let position = this.props.selected;

    return (
      <div className="flx-col flx-1">
        <HeadIndexSheet
          position={position} 
          onAddCandidate={this.onAddCandidate}
        />
      </div>
    );
  }

  renderCandidates() {
    let position = this.props.selected;

    return (
      <div className="submitted border">
        <CandidateComponent
          position={position} 
          onSetCandidates={this.onSetCandidates}
          onAddCandidate={this.onAddCandidate}
          onRemoveCandidate={this.onRemoveCandidate}
          candidates={this.state.candidates}
        />
      </div>
    );
  }

  renderInner() {
    let position = this.props.selected;

    if (!position) {
      return (
          <Pyr.UI.Loading />
      );
    }

    return (
      <div className="inner flx-col flx-1">
        <div >
          {this.renderCandidates() }
        </div>
        <div className="flx-row flx-1">
          <div className="flx-col flx-4 border">
            {this.renderItem(position, false) }
          </div>
          <div className="flx-col flx-5 scroll">
            {this.renderChooser() }
          </div>
        </div>
      </div>
    );
  }

}

class HeadLoader extends Component {
  constructor(props) {
    super(props);

    this.initState({
      head: null // currently selected head
    });

    this.onSetHead = this.setHead.bind(this);
  }

  name() {
    return "head-loader";
  }

  setHead(head) {
    this.setState({
      head
    });
  }

  loadHead(headId) {
    this.props.loaders.heads.loadItem(headId).done(head => {
      //console.log("LOAD HEAD");
      //console.log(head);
      this.onSetHead(head);
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.headId!= this.props.headId) {
      //console.log("PAGE GOT NEW ID: " + nextProps.headId);
      this.setState({
        head: null
      });
      if (this.props.headId) {
        this.loadHead(this.props.headId);
      }
    }
  }

  componentDidMount() {
    if (this.props.headId) {
      this.loadHead(this.props.headId);
    }
  }

  actionSheet() {
    let action = this.props.action;
    let sheet = Sheet.sheetComponent(action || "Show");
    let ActionSheet = eval(sheet);

    //console.log("ACTION SHEET");
    //console.log(sheet);
    //console.log(this.props);
    //console.log(this.state.head);

    return (
      <ActionSheet
        {...this.props}
        head={this.state.head}
      />
    );
  }

  render() {
    return this.actionSheet();
  }
}

class PositionsPage extends Page {
  name() {
    return "Position";
  }

  loader() {
    return this.props.loaders.positions;
  }

  getIndexSheet() {
    return IndexSheet;
  }

  getHeadId() {
    return this.props.subItemId;
  }

  pageProps() {
    let stuff = super.pageProps();
    return Object.assign({}, stuff, { headId: this.getHeadId() });
  }

  getActionSheet(action) {
    let sheet = Sheet.sheetComponent(action || "Show");
    let ActionSheet = eval(sheet);

    //console.log("ACTION");
    //console.log(action);
    //console.log(ActionSheet);

    return HeadLoader; // ActionSheet;
  }
}

function key(item) {
  return item.id;
}
PositionsPage.key = key;

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
    this.props.onSetItems(data.jobs || []);
  }

  preSubmit() {
    this.props.onSetItems(null);
  }

  render() {
    return (
      <div className="position-search side-search">
        <div className="search-header">
          <div className="flx-row">
            <div className="mr-auto">Search</div>
          </div>
        </div>
        <Pyr.Form.Form
          url={Pyr.URL(POSITIONS_URL).push("search")}
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

          <Pyr.Form.Group name="age">
            <Pyr.Form.Label>Posting Age</Pyr.Form.Label>
            <Pyr.Form.Range
              minValue={0}
              maxValue={10}
              step={1}
              formatLabel={this.renderAge}
            />
          </Pyr.Form.Group>
        </Pyr.Form.Form>
        <div className="form-footer">
          <Pyr.Form.SubmitButton target={this.onGetTarget} disabled={this.props.isLoading}>Filter</Pyr.Form.SubmitButton>
        </div>
      </div>
    );
  }
}

PositionsPage.SearchForm = SearchForm;

 

export default PositionsPage;
