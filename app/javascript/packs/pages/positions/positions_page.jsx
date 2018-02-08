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

import { 
  getLogo 
} from '../shared/user';

import {
  POSITIONS_URL,
  SEARCH_URL,
  CATEGORIES_URL,
  LOCATIONS_URL,
  COMPANY_URL,
  SKILLS_URL,
  COMPANIES_URL,

  NEW_ACTION,
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

class CategorySheet extends Sheet.Index {
  key(position) {
    return PositionsPage.key(position);
  }

  constructor(props) {
    super(props);
    this.initState({
      categories : null
    });

    this.onLoadItems = this.loadItems.bind(this);
    this.onSetCategories = this.setCategories.bind(this);
  }

  items() {
    return this.state.categories;
  }

  setCategories(categories) {
    console.log("CATEGORIES");
    console.log(categories);

    this.setState({
      categories
    });
  }

  loadItems(onLoading) {
    console.log("URL:");
    console.log(this.props.url);

    this.getJSON({
      url: CATEGORIES_URL,
      context: this,
      onLoading: onLoading,

    }).done((data, textStatus, jqXHR) => {
        this.onSetCategories(data.categories || []);

    }).fail((jqXHR, textStatus, errorThrown) => {
      Pyr.Network.ajaxError(jqXHR, textStatus, errorThrown);
    });
  }

  componentDidMount() {
    if (!this.state.categories) {
      this.onLoadItems(this.onLoading);
    }
  }

  renderItem(item) {
    return (
      <label key={"cat-" + item.id}>{item.name}</label>
    );
  }
}

class PositionItem extends Component {
  render() {
    let item = this.props.item;
    if (!item) {
      return null;
    }

    let company = item.company || {};
    let logo = company.logo;

    console.log("POSITION-COMP");
    console.log(item);
    console.log(company);

    let id = "item-" + item.id;
    let allClass = ClassNames("item flx-col");

    if (this.props.selected) {
       allClass.push("selected");
    }

    let locations = null;
    if (item.locations) {
      locations = item.locations.map(v => {
        return v.full_name;
      }).join(", ");
    }
    locations = locations || "Unknown";

    let skills = null;
    if (item.skills) {
      skills = item.skills.map(v => {
        return v.name;
      }).join(", ");
    }
    skills = skills || "None";

    let title = item.title || company.name || "No Title";
    let description = item.description || "No Description";
    let category = item.category ? item.category.name : "Other";
    let url = logo ? logo.url : "";
    let companyName = company ? company.name : "Anonymous";
    let createdAt = item.created_at;

    return (
      <div className={allClass}>
        <div className="category flx-row">
          <span className="flx-1">{ category }</span>

          <div className="dropdown">
            <Pyr.UI.Icon name="bars" className="dropdown-toggle" id="dropdownFilterMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" />
            <div className="dropdown-menu" aria-labelledby="dropdownFilterMenuButton">
              <label className="dropdown-header">Filter with same</label>
              <div className="dropdown-divider"></div>
              <a className="dropdown-item" href="#">Company</a>
              <a className="dropdown-item" href="#">Position</a>
              <a className="dropdown-item" href="#">Category</a>
              <a className="dropdown-item" href="#">Location</a>
            </div>
          </div>
        </div>
        <div className="company flx-row">
          <Pyr.UI.Image src={url} className="mr-auto" />
          <div className="flx-1 mr-auto mt-auto mb-auto">{ companyName }</div>
        </div>
        <div className="position">
          { title }
        </div>
        <div className="location">
          { locations }
        </div>
        <div className="age">
          <Pyr.UI.MagicFuzzyDate short date={item.created_at}/>
        </div>
        <div className="more flx-row mt-auto">
          <span className="ml-auto">More...</span>
        </div>
      </div>
    );

  }
}

class IndexSheet extends Sheet.Index {
  key(position) {
    return PositionsPage.key(position);
  }

  renderItem(item, isSelected) {
    return (
      <PositionItem 
        item={item}
        isSelected={isSelected}
        card={this.props.card}
      />
    );
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
    return super.renderChildren(items, isSelected, {className: "flx flx-row flx-wrap"});
  }

  unused_renderSearch() {
    let url = Pyr.URL(SEARCH_URL).push("position");

    return (
        <Pyr.Form.Form
          className="search-form d-flex flx-1"
          model="search"
          url={url}
          ref={(node) => {this.form = node;}}
        >
          <Pyr.Form.Group name="search" className="flx-row flx-1">
            <i className="fa fa-search"></i><Pyr.Form.TextField placeholder="Filter" className="flx-1"/>
          </Pyr.Form.Group>
        </Pyr.Form.Form>
    );
  }   

  renderInner() {
    let leftClasses = "col col-3";
    let rightClasses = "col flx-col";

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
          { super.renderInner() }
        </div>
      </div>
    );
  }

  renderHmmm() {
    return (
      <CategorySheet {...this.props}/>
    );
  }
}


class ShowSheet extends Sheet.ShowFull {
  key(position) {
    return PositionsPage.key(position);
  }

  renderItem(position, isSelected) {
    return (
        <PositionItem 
          position={position} 
          selected={isSelected}
        />
    );
  }
}

class PositionsPage extends Page {
  name() {
    return "Position";
  }

  unusedrenderHeader() {
    return (
      <div className="flx-row header">
        <Pyr.UI.Label className="mr-auto">Filter</Pyr.UI.Label>
        <Pyr.UI.Label className="ml-auto">Results</Pyr.UI.Label>
      </div>
    );
  }

  loadItems(onLoading) {
//    console.log("URL:");
//    console.log(this.props.url);

    let urlStuff = Object.assign({
      url: this.props.url,
      context: this,
      onLoading: this.onLoading,
    });

    this.getJSON(
      urlStuff
    ).done((data, textStatus, jqXHR) => {
        this.onSetItems(data.jobs || []);

    }).fail((jqXHR, textStatus, errorThrown) => {
      Pyr.Network.ajaxError(jqXHR, textStatus, errorThrown);
    });
  }


  indexSheet() {
    return (
      <IndexSheet
        {...this.props}
        items={this.state.items}
        onSelect={this.onSelect}
        onLoading={this.onLoading}
        onLoadItems={this.onLoadItems}
        onSetItems={this.onSetItems}
        card={false}
      />
    );
  }

  actionSheet(action) {
    let sheet = Sheet.sheetComponent(action || "Show");
    let ActionSheet = eval(sheet);

        //onAction={this.onAction}
        //onUnaction={this.onUnaction}
    return (
      <ActionSheet
        {...this.props}
        selected={this.getSelected()}
        onLoading={this.onLoading}
        onSetItems={this.onSetItems}
      />
    );

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
          url={POSITIONS_URL}
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

PositionsPage.SearchForm = SearchForm;

 

export default PositionsPage;
