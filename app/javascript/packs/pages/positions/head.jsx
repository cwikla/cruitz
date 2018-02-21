import React, { 
} from 'react';

import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';

import Sheet from '../sheet';

import {
  Link,
  Redirect
} from 'react-router-dom';


import Pyr, {
  Component
} from '../../pyr/pyr';
const ClassNames = Pyr.ClassNames;

import {
  POSITIONS_URL,
  SEARCH_URL,
  CANDIDATES_URL,
  CATEGORIES_URL,
  LOCATIONS_URL,
  COMPANY_URL,
  SKILLS_URL,
  COMPANIES_URL,
  HEADS_URL,


  SHOW_ACTION
} from '../const';

const RANGES = {
  0 : 'Recent',
  1 : '1 week',
  2 : '2 weeks',
  3 : '3 weeks',
  4 : '1 month',
  5 : '2 month',
  6 : '3 month',
  7 : '4 month',
  8 : '5 month',
  9 : '6 month',
  10 : 'All Time'
};

class CandidateComponent extends Component {
  constructor(props) {
    super(props);
  
    this.initState({
      candidates: null
    });

    this.onSetCandidates = this.setCandidates.bind(this);
    this.onLoadItems = this.loadItems.bind(this);
  }

  setCandidates(candidates) {
    this.setState({
      candidates
    });
  }

  loadItems(onLoading) {

    this.getJSON({
      url: Pyr.URL(POSITIONS_URL).push(this.props.position.id).push("candidates"),
      context: this,
      onLoading: onLoading,

    }).done((data, textStatus, jqXHR) => {
        this.onSetCandidates(data.candidates || []);

    }).fail((jqXHR, textStatus, errorThrown) => {
      Pyr.Network.ajaxError(jqXHR, textStatus, errorThrown);
    });
  }

  componentDidMount() {
    if (!this.state.candidates) {
      this.onLoadItems();
    }
  }

  render() {
    return (
      <div className="candidates">
        Candidates
      </div>
    );
      
  }
}


class SearchForm extends Component {
  constructor(props) {
    super(props);
    this.onGetTarget = this.getTarget.bind(this);
    this.onRenderAge = this.renderAge.bind(this);
    this.onSuccess = this.success.bind(this);
  }

  getTarget() {
    return this.form;
  }

  renderAge(value) {
    value = Math.floor(value);
    return RANGES[value];
  }

  success(data, textStatus, jqXHR) {
    this.props.onSetItems(data.jobs || []);
  }

  render() {
    return (
      <div className="position-search">
        <Pyr.Form.Form
          url={Pyr.URL(POSITIONS_URL).push("search")}
          method={Pyr.Method.POST}
          ref={(node) =>{ this.form = node; }}
          onPreSubmit={this.props.onPreSubmit}
          onPostSubmit={this.props.onPostSubmit}
          onSuccess={this.onSuccess}
          onError={this.props.onError}
          object={{}}
          model="search"
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


class HeadPlaceholderItem extends Component {
  render() {
    return (
      <div className="placeholder border flx-col">
        <Pyr.UI.Icon name="plus" className="fa-align-center"/>
      </div>
    );
  }
}

class HeadItem extends Component {
  constructor(props) {
    super(props);

    this.onSetMe = this.setMe.bind(this);
  }

  setMe() {
    if (this.props.onSetSelected) {
      this.props.onSetSelected(this.props.head);
    }
  }

  render() {
    let head = this.props.head;

    let full_name = head.full_name;
    let email = head.email;
    let title = "Sr. Programmer";
    let company = "Google";

    let phone_number = head.phone_number;

    let key = "head-" + head.id;

    return (
      <div 
        className="head flx-col flx-1" 
        key={key}
        onClick={this.onSetMe}
      >
        <div className="full_name">{ full_name }</div>
        <div className="current_title">{ title }</div>
        <div className="company">{ company }</div>
        <div className="phone_number">{ phone_number }</div>
        <div className="email">{ email }</div>
        <Pyr.UI.PrimaryButton className="mt-auto">Submit Me</Pyr.UI.PrimaryButton>
      </div>
    );
  }
}

class HeadModal extends Pyr.UI.Modal {
  constructor(props) {
    super(props);
  }

  renderInner() {
    return (
      <div className="flx-col flx-1">
        <HeadItem head={this.props.head} />
      </div>
    );
  }
}


class HeadComponent extends Sheet.Index {
  key(item) {
    return item.id;
  }

  constructor(props) {
    super(props);
    this.initState({
      heads : null,
      selected: null
    });

    this.onLoadItems = this.loadItems.bind(this);
    this.onSetHeads = this.setHeads.bind(this);
    this.onSetSelected = this.setSelected.bind(this);
  }

  items() {
    return this.state.heads;
  }

  setSelected(selected) {
    console.log("SET SELECTED");
    console.log(selected);

    this.setState({
      selected
    });
    if (selected) {
      this.modal.open();
    }
    else
    {
      this.modal.close();
    }
  }

  setHeads(heads) {
    console.log("HEADS");
    console.log(heads);

    this.setState({
      heads
    });
  }

  loadItems(onLoading) {

    this.getJSON({
      url: HEADS_URL,
      context: this,
      onLoading: onLoading,

    }).done((data, textStatus, jqXHR) => {
        this.onSetHeads(data.heads || []);

    }).fail((jqXHR, textStatus, errorThrown) => {
      Pyr.Network.ajaxError(jqXHR, textStatus, errorThrown);
    });
  }

  componentDidMount() {
    if (!this.state.heads) {
      this.onLoadItems(this.onLoading);
    }
  }

  renderChild(item, isSelected) {
    let url = this.childURL(item, isSelected);

    return (
      <li
        key={this.key(item)}
      >{this.renderItem(item, isSelected)}</li>
    );
  }

  renderChildren(items, isSelected) {
    return super.renderChildren(items, isSelected, {className: "heads flx flx-row flx-wrap"})
  }

  renderItem(item) {
    return (
      <HeadItem 
        head={item} 
        onSetSelected={this.onSetSelected}
      />
    );
  }

  renderInner() {
    if (!this.items()) {
      return this.renderLoading();
    }

    if (this.items().length == 0) {
      return this.renderNone();
    }

    let leftClasses = "flx-col scroll chooser-search";
    let rightClasses = "flx-3 flx-col scroll chooser-heads";

    let url = Pyr.URL(HEADS_URL).push("new");

    return (
      <div className="chooser flx-row">
        <div className={leftClasses}>
          <SearchForm
            onSetItems={this.props.onSetItems}
            onPreSubmit={this.props.onPreSubmit}
            onPostSubmit={this.props.onPostSubmit}
            onError={this.props.onError}
          />
        </div>
        <div className={rightClasses}>
          { super.renderInnerNoScroll() }
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className="flx-col flx-1">
        { this.renderInner() }
        <HeadModal 
          head={this.state.selected} 
          ref={node => this.modal = node}
        />
      </div>
    );
  }
}

export {
  CandidateComponent,
};

export default HeadComponent;
