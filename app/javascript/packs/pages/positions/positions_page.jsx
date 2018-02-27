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
import ItemLoader from '../item_loader';

import HeadComponent, { 
  CandidateComponent 
} from './head';

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
  HEADS_URL,

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

class PositionItem extends Component {
  constructor(props) {
    super(props);
  }

  renderSubmitButton() {
    if (!this.props.showSubmitButton) {
      return null;
    }

    return (
      <div className="flx-row mt-auto">
        <div className="ml-auto"><Pyr.UI.PrimaryButton className="ml-auto" name="add" onClick={this.props.onShowCandidates} >Submit Candidate</Pyr.UI.PrimaryButton></div>
      </div>
    );
  }

  renderHeader() {
    let position = this.props.position;
    if (!position) {
      return null;
    }

    let company = position.company || {};
    let logo = company.logo;

    let locations = null;
    if (position.locations) {
      locations = position.locations.map(v => {
        return v.full_name;
      }).join(", ");
    }
    locations = locations || "Unknown";

    let skills = null;
    if (position.skills) {
      skills = position.skills.map(v => {
        return v.name;
      }).join(", ");
    }
    skills = skills || "None";

    let title = position.title || company.name || "No Title";
    let description = position.description || "No Description";
    let category = position.category ? position.category.name : "Other";
    let logo_url = logo ? logo.url : "";
    let companyName = company ? company.name : "Anonymous";

    let url = Pyr.URL(POSITIONS_URL).push(position.id).push("submit").set("name", "1");
    console.log("URL");
    console.log(url);
    console.log(url.searchParams.toString());

    return (
      <div className="header flx-row">
        <div className="flx-col">
          <img src={logo_url} className="logo"/>
        </div>

        <div className="flx-col flx-1">
          <div className="flx-row">
            <div className="title flx-1">{ title }</div>
            <div className="created_at"><Pyr.UI.MagicDate dateOnly date={position.created_at}/></div>
          </div>
          <div className="company">{ companyName }</div>
          <div className="locations">{ locations }</div>

          <div className="flx-row mt-auto">
            <div className="salary-range">$120,000 - $160,000</div>
          </div>

          { this.renderSubmitButton() }
        </div>
      </div>
    );
  }

  renderContent() {
    let position = this.props.position;
    if (!position) {
      return null;
    }

    let description = position.description || "No Description";
    let createdAt = position.created_at;

    let count = 0;
    return (
      <div className="description flx-1 flx-col">
        <Pyr.UI.Scroll>
          { Pyr.Util.fancyParagraph(description) }
        </Pyr.UI.Scroll>
      </div>
    );
  }

  render() {
    let position = this.props.position;

    let id = "position-" + position.id;
    let allClass = ClassNames("position flx-col flx-1");

    if (this.props.selected) {
       allClass.push("selected");
    }

    allClass.push(this.props.className);

    return (
      <div className={allClass}>
        <div className="flx-row flx-1">
          <div className="flx-col flx-1">
            { this.renderHeader() }
            { this.renderContent() }
          </div>
        </div>
      </div>
    );
  }


}

class PositionCardItem extends Component {
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
      method: Pyr.Method.POST
    };

    this.props.onLoadItems(this.props.onLoading, all);
  }

  render() {
    let item = this.props.item;
    if (!item) {
      return null;
    }

    let company = item.company || {};
    let logo = company.logo;

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
              <label className="dropdown-item" onClick={this.onItemSearch}>Company</label>
              <label className="dropdown-item" >Position</label>
              <label className="dropdown-item" >Category</label>
              <label className="dropdown-item" >Location</label>
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
      <PositionCardItem 
        item={item}
        isSelected={isSelected}
        card={this.props.card}
        onLoading={this.props.onLoading}
        onLoadItems={this.props.onLoadItems}
      />
    );
  }

  renderChildren(items, isSelected) {
    return super.renderChildren(items, isSelected, {className: "flx flx-row flx-wrap"});
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
          <div className="flx-col">
            { super.renderInnerNoScroll() }
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
    console.log("SUBMIT: renderItem");
    return (
        <PositionItem 
          position={position} 
          selected={isSelected}
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
    //console.log(this.state.items);

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
      return;
    }

    console.log("LOADING CANDIDATES");

    let urlStuff = Object.assign({}, {
      url: Pyr.URL(POSITIONS_URL).push(position.id).push('candidates'),
      context: this,
      onLoading: this.props.onLoading,
    }, props);

    this.getJSON(
      urlStuff
    ).done((data, textStatus, jqXHR) => {
        this.onSetCandidates(data.candidates || []);

    }).fail((jqXHR, textStatus, errorThrown) => {
      Pyr.Network.ajaxError(jqXHR, textStatus, errorThrown);
    });
  }

  componentDidMount() {
    if (!this.state.candidates) {
      this.loadCandidates(this.props.selected, this.props.onLoading);
    }
  }

  componentWillUpdate(nextProps, nextState) {
    let pid = this.props.selected ? this.props.selected.id : null;
    let nid = nextProps.selected ? nextProps.selected.id : null;

    if (pid != nid) {
      this.loadCandidates(nextProps.selected);
    }
  }

  key(position) {
    return PositionsPage.key(position);
  }

  renderItem(position, isSelected) {
    return (
      <PositionItem 
        position={position} 
        selected={isSelected}
        onShowCandidates={this.onShowCandidates}
      />
    );
  }

  renderChooser() {
    let position = this.props.selected;

    return (
        <div className="flx-col flx-1">
          <HeadComponent 
            position={this.props.selected}
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

class PositionsPage extends Page {
  name() {
    return "Position";
  }

  loadSelected(itemId, onLoading) {
    this.getJSON({
      url: Pyr.URL(this.props.url).push(itemId),
      onLoading: onLoading

    }).done((data, textStatus, jqXHR) => {
      console.log("GOT POSITION");
      console.log(data);

      this.onSelect(data.position);

    }).fail((jqXHR, textStatus, errorThrown) => {
      Pyr.Network.ajaxError(jqXHR, textStatus, errorThrown);
    });
  }

  loadItems(onLoading, props={}) {

    let urlStuff = Object.assign({}, {
      url: this.props.url,
      context: this,
      onLoading: this.onLoading,
    }, props);

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
        onPreSubmit={this.onNoItems}
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
        onLoadSelected={this.onLoadSelected}
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

PositionsPage.SearchForm = SearchForm;

 

export default PositionsPage;
