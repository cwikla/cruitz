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

class PositionCard extends Component {
  render() {
    let item = this.props.item;

    let company = item.company || {};
    let logo = company.logo;

    console.log("POSITION-COMP");
    console.log(item);
    console.log(company);

    let id = "item-" + item.id;
    let allClass = ClassNames("item position");

    if (this.props.selected) {
       allClass.push("selected");
    }

    let title = item.title || company.name || "No Title";
    let description = item.description || "No Description";

    return (
      <div className={ClassNames("card").push(allClass)}>
        <div className="view overlay hm-white-slight">
          <img src={logo.url} className="img-fluid" alt="" />
          <a>
              <div className="mask"></div>
          </a>
        </div>
        <div className="card-body">
            <h4 className="card-title">{title}</h4>
            <h4 className="card-date"><Pyr.UI.MagicDate date={item.created_at}/></h4>
            <hr/>
            <p className="card-text">{description}</p>
            <Pyr.UI.PrimaryButton>More...</Pyr.UI.PrimaryButton>
        </div>
      </div>
    );
  }
}

class PositionItem extends Component {

  render() {
    if (this.props.card) {
      return (
        <PositionCard {...this.props}/>
      );
    }

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
    let allClass = ClassNames("item flx-col row");

    if (this.props.selected) {
       allClass.push("selected");
    }

    let title = item.title || company.name || "No Title";
    let description = item.description || "No Description";
    let category = item.category ? item.category.name : "Other";
    let locations = "San Francisco";
    let url = logo ? logo.url : "";
    let name = company ? company.name : "Anonymous";
    
    return (
      <div className={allClass} id={id}>
        <div className="flx-row header flx-align-center">
          <div className="detail title">{title}</div>
          <div className="detail ml-auto"><Pyr.UI.MagicDate short date={item.created_at}/></div>
        </div>

        <div className="row content">
          <div className="col col-2">
            <img src={url} className="avatar-size-small img-fluid rounded-circle mx-auto" />
          </div>
          <div className="col">
            <div className="detail company-name">Company: {name}</div>
            <div className="detail location">Location: {locations}</div>
            <div className="detail category">Category: {category}</div>
          </div>
        </div>

        <div className="detail description">
          {description}
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

  renderChildrenCard(items, selected) {
    return (
      <div className="d-flex flx-wrap" key="position-stuff">
        { items.map( (item, pos) => {
            let key="position-item-"+item.id;
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
          <PositionsPage.SearchForm />
        </div>
        <div className={rightClasses}>
          { super.renderInner() }
        </div>
      </div>
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
    console.log("URL:");
    console.log(this.props.url);

    this.getJSON({
      url: this.props.url,
      context: this,
      onLoading: onLoading,

    }).done((data, textStatus, jqXHR) => {
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
        onAction={this.onAction}
        onUnaction={this.onUnaction}
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
  }

  getTarget() {
    return this.form;
  }

  renderAge(value) {
    value = Math.floor(value);
    return RANGES[value];
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
          onSuccess={this.props.onSuccess}
          onError={this.props.onError}
          object={{}}
          model="Position"
        >
          <Pyr.Form.Group name="key_words">
            <Pyr.Form.Label>Keywords</Pyr.Form.Label>
            <Pyr.Form.TextField />
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
