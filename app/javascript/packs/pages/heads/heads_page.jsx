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
  HEADS_URL,
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

class HeadItem extends Component {

  render() {
    let head = this.props.head;
    
    let id = "head-" + head.id;
    let allClass = ClassNames("item head-item flx-row");
    
    if (this.props.selected) {
       allClass.push("selected");
    }  
    
    let description = head.description || "No Description";
    
    return (
      <div className={allClass} id={id}>
        <Pyr.Grid.Column className="head col-6">
          <div>{head.id}:{head.title}</div>
          <div>Created: <Pyr.UI.MagicDate date={head.created_at}/></div>
        </Pyr.Grid.Column>
        <Pyr.Grid.Column className="item-content">
          <div>Total: {head.candidate_counts.total}</div>
          <div>Accepted: {head.candidate_counts.accepted}</div>
          <div>New: {head.candidate_counts.waiting}</div>
          <div>Rejected: {head.candidate_counts.rejected}</div>
        </Pyr.Grid.Column>
      </div>
    );
  }


}

class HeadForm extends Component {
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
      <Pyr.Form.Group name="company" key="company">
        <Pyr.Form.Label>Company</Pyr.Form.Label> 
        <div>
          <Pyr.UI.Label>{ this.props.company.name } <Link to={Pyr.URL(COMPANY_URL).toString()}> <Pyr.UI.Icon name="pencil" /></Link></Pyr.UI.Label>
        </div>
      </Pyr.Form.Group>
    );

  }

  getTarget() {
    console.log("GETTING TARGET");
    console.log(this.form);
    return this.form;
  }

  render() {
    let key = "head-form";
    let url = Pyr.URL(HEADS_URL);

    if (this.props.selected){
      url = url.push(this.props.selected.id);
      key = key + "-" + this.props.selected.id;
    }

    let method = this.props.method || Pyr.Method.POST;

    //alert("Render FOrm Head " + this.props.selected.id);


    return (
      <div className="form-parent section">
        <Pyr.Form.Form
          model="Head"
          object={this.props.selected}
          url={url}
          method={method}
          id="head-form" 
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
            <Pyr.Form.TextField placeholder= "Enter head title"/>
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
      <HeadForm
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

  renderItem(head, isSelected) {
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

  renderHeader() {
    return (
      <div className="heads-index-header">
          <div className="head-new p-1 d-flex flx-end">
              <Link to={Pyr.URL(HEADS_URL).push("new").toString()}><Pyr.UI.PrimaryButton><Pyr.UI.Icon name="plus"/> Add Head</Pyr.UI.PrimaryButton></Link>
          </div>
      </div>
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

class ShowSheet extends Sheet.ShowFull {
  key(head) {
    return HeadsPage.key(head);
  }

  renderItem(head, isSelected) {
    return (
        <HeadItem 
          head={head} 
          selected={isSelected}
        />
    );
  }
}

class NewSheet extends Sheet.New {
  success(data, textStatus, jqXHR) {
    this.props.onHeadCreate(data.head);
    super.success(data, textStatus, jqXHR);
    this.context.setNotice("Head Created");
    this.goBack();
  }

  title() {
    return "Add a New Head";
  }

  renderButton() {
    return null; //
  }

  renderForm() { 
    return ( 
      <HeadForm 
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

class HeadsPage extends Page {
  constructor(props) {
    super(props);
    this.initState({
      categories: null
    });

  }

  name() {
    return "Heads";
  }

  //getItems() {
   // return this.props.heads;
  //}

  loadItems() {
    this.onSetItems(this.props.heads);
  }

  loadSelected(sid) {
    this.onSelect(this.props.headMap[sid]);
    //this.props.headMap[sid];
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextProps.heads != this.props.heads) {
      this.onSetItems(nextProps.heads);
    }
  }

  componentWillMount() {
    this.getJSON({
      url: CATEGORIES_URL

    }).done((data, textStatus, jqXHR) => {

      this.setState({
        categories: data.categories
      });
    }).fail((jqXHR, textStatus, errorThrown) => {
      Pyr.Network.ajaxError(jqXHR, textStatus, errorThrown);
    });
  }

        //heads={this.props.heads}
  indexSheet() {
    return (
      <IndexSheet
        {...this.props}
        items={this.state.items}
        heads={this.props.heads}
        headMap={this.props.headMap}
        onSelect={this.onSelect}
        onLoadItems={this.onLoadItems}
        card={false}
      />
    );
  }

  actionSheet(action) {
    action = action || "Show";

    if (action.toLowerCase() == "show") {
      action = 'Edit';
    }

    let sheet = Sheet.sheetComponent(action || "Show");
    let ActionSheet = eval(sheet);

    return (
      <ActionSheet
        {...this.props}
        selected={this.getSelected()}
        items={this.state.items}
        heads={this.props.heads}
        headMap={this.props.headMap}
        onLoadSelected={this.onLoadSelected}
        categories={this.state.categories}
      />
    );

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
