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

import HeadDetails from './head_details';
import CV from '../shared/cv';

import {
  HEADS_URL,
  SEARCH_URL,
  CATEGORIES_URL,
  LOCATIONS_URL,
  COMPANY_URL,
  SKILLS_URL,

  NEW_ACTION,
  SHOW_ACTION,

  HEADS_PAGE,

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


class HeadItem extends Component {

  render() {
    let head = this.props.head;
    
    let id = "head-" + head.id;
    let allClass = ClassNames("item head-item flx-col");
    
    if (this.props.isSelected) {
       allClass.push("selected");
    }  
    
    let description = head.description || "No Description";
   
/*  FIXME
        <div className="application-counts ml-auto">
          <div className="mr-auto submitted-count">{head.candidates.total || 0} Applications</div>
          <div className="mr-auto submitted-count">{head.candidates.waiting || 0} Waiting</div>
          <div className="mr-auto submitted-count">{head.candidates.accepted || 0} Accepted</div>
          <div className="mr-auto submitted-count">{head.candidates.rejected || 0} Rejected</div>
        </div>
*/
    return (
      <div className={allClass} id={id}>
        <div className="mr-auto full-name">{head.full_name}</div>
        <div className="mr-auto current">{head.summary}</div>

      </div>
    );
  }


}

class EditSheet extends Sheet.Edit {
  success(data, textStatus, jqXHR) {
    this.props.onHeadUpdate(data.head);
    super.success(data, textStatus, jqXHR);
    this.context.setNotice("Head Saved");
    this.goBack();
  }

  renderButton() {
    return null; // nothing here
  }

  title() {
    return "Edit Head";
  }

  renderForm() {
    return (
      <HeadDetails.Form
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

    this.onAddHead = this.addHead.bind(this);
  }

  addHead(e) {
    if (e) {
      e.preventDefault();
    }

    //this.props.onSetAction(NEW_ACTION);
  }

  key(head) {
    return HeadsPage.key(head);
  }

  renderHeader() {
    let url = Pyr.URL(HEADS_URL).push(NEW_ACTION);

    return (
      <div className="flx-row">
        <div className="mr-auto">Heads</div>
        <Link to={url.toString()}><Pyr.UI.IconButton name="plus" className="ml-auto">Add Head</Pyr.UI.IconButton></Link>
        <div className="dropdown ml-auto">
          <Pyr.UI.IconButton name="sort" className="dropdown-toggle pyr-icon-btn" id="headSortMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" />
          <div className="dropdown-menu" aria-labelledby="headSortMenuButton">
            <label className="dropdown-header">Sort</label>
            <div className="dropdown-divider"></div>
            <label className="dropdown-item" >Date</label>
            <label className="dropdown-item" >Unread</label>
            <label className="dropdown-item" >Position</label>
          </div>
        </div>
      </div>
    );
  }


  renderItem(head, isSelected) {
    //console.log("RENDER ITEM HEAD");
    //console.log(head);

    return (
      <HeadItem 
        head={head} 
        isSelected={isSelected}
        card={this.props.card}
      />
    );
  }

  renderChildrenCard(items, selected) {
    return (
      <div className="d-flex flx-wrap" key="head-stuff">
        { items.map( (item, pos) => {
            let key="head-item-"+item.id;
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
    let url = Pyr.URL(SEARCH_URL).push("heads");

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

  renderNone() {
    return (
      <div className="empty flx-col flx-align-center flx-justify-center">
        <div className="">Welcome to <b>cruitz</b>!</div>
        <p/>
        <div>You currently have no open heads. To begin receiving candidates from our recruiting network</div>
        <div>add a new head.</div>
      </div>
    );
  }


}

class ShowSheet extends Sheet.Show {
  key(head) {
    return HeadsPage.key(head);
  }

  renderHeader() {
    let url = Pyr.URL(HEADS_URL);
    let title = "Heads";

    return (
      <Sheet.ShowHeader className="candidate-title" title={title} nextId={this.props.nextId} prevId={this.props.prevId} url={url} />
    );
  }


  renderItem(item, isSelected) {
    if (this.state.isLoading || !item) {
      return (<Pyr.UI.Loading />);
    }

    let head = item;

    return (
     <div className="item flx-1 flx-row">
        <div className="flx-col flx-3 left scroll">
          <div className="section flx-5">
            <HeadDetails.Full {...this.props} head={head} />
          </div>
        </div>
        <div className="flx-1 right">
          <HeadDetails.Stats head={head} />
        </div>
      </div>
    );
  }

}

class NewSheet extends Sheet.New {

  success(data, textStatus, jqXHR) {
    this.props.onAddItem(data.head);
    super.success(data, textStatus, jqXHR);
    this.context.setNotice("Head Created");
    this.goBack();
  }

  title() {
    return "Add a New Head";
  }

  renderButton() {
    return (
      <div className="submit-button flx-row">
        <Pyr.Form.SubmitButton className="ml-auto" target={this.onGetTarget} disabled={this.props.isLoading}>Submit Candidate</Pyr.Form.SubmitButton>
      </div>
    );
  }

  getTarget() {
    return this.newForm.form; // ARRRG
  }

  renderForm() { 
    return ( 
      <CV.NewForm
        ref={e => this.newForm = e}
        company={this.user().company}
        onPreSubmit={this.onPreSubmit} 
        onPostSubmit={this.onPostSubmit} 
        onSuccess={this.onSuccess}
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


class HeadsPage extends Page {
  constructor(props) {
    super(props);
    this.initState({
    });

  }

  name() {
    return "Heads";
  }

  loader() {
    return this.props.loaders.heads;
  }

  getIndexSheet() {
    return this.getActionSheet("IndexShow");
  }

  getActionSheet(action) {
    if ((action || "show").toLowerCase() == "show") {
      return IndexShowSheet;
    }

    let sheet = Sheet.sheetComponent(action || "Show");
    let ActionSheet = eval(sheet);

    return ActionSheet;
  }

}

function key(item) {
  return item.id;
}
HeadsPage.key = key;

class SearchForm extends Component {
  render() {
    return (
      <div className="head-search">
        <Pyr.Form.Form
          url={HEADS_SEARCH_URL}
          method={Pyr.Method.POST}
          ref={(node) =>{ this.form = node; }}
          onPreSubmit={this.props.onPreSubmit}
          onPostSubmit={this.props.onPostSubmit}
          onSuccess={this.props.onSuccess}
          onError={this.props.onError}
        >
          <Pyr.Form.Group name="title">
            <Pyr.Form.Label>Title</Pyr.Form.Label>
            <Pyr.Form.TextField placeholder= "Enter head title"/>
          </Pyr.Form.Group>

        </Pyr.Form.Form>
      </div>
    );
  }
}

HeadsPage.SearchForm = SearchForm;

 

export default HeadsPage;
