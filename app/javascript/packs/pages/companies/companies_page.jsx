import React, { 
  Component
} from 'react';

import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';

import {
  BrowserRouter as Router,
  Link,
  Redirect
} from 'react-router-dom';


import Pyr from '../../pyr/pyr';
const ClassNames = Pyr.ClassNames;

import Page from '../page';
import Sheet from '../sheet';

import {
  SEARCH_URL,
  COMPANY_URL,

  NEW_ACTION,
  SHOW_ACTION
} from '../const';

class CompanyForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      links: []
    };

    this.onAddLink = this.addLink.bind(this);
    this.onRemoveLink = this.removeLink.bind(this);
  }

  addLink(e) { 
    let value = e.target.value; 
    if (value && value.length > 1) {
      let links = this.state.links.slice();
      
      links.push(value);
      this.setState({
        links 
      });
      this.linkField.setText("");
    }
  }

  removeLink(pos, e) {
    if (pos < 0 || pos >= this.state.links.length) {
      return;
    }

    let links = this.state.links;
    links = links.slice(0,pos).concat(links.slice(pos+1, links.length));
    this.setState({
      links
    });
  }


  renderLinkList() {
    return (
          <div id="link-list">
            { Pyr.Util.times(this.state.links.length, (i) => {
                return (
                  <Pyr.FancyButton
                    key={"llb"+i}
                    onClick={this.removeLink.bind(this, i)}
                  >{this.state.links[i]}</Pyr.FancyButton>
                );
              })
            }
          </div>
    );
  }


  render() {
    let method = Pyr.Method.PUT;

    console.log("COMPANY");
    console.log(this.props.company);

    return (
      <div className="form-parent">
        <Pyr.Form.Form
          model="Company"
          object={this.props.company}
          url={COMPANY_URL}
          method={method}
          id="company-form" 
          key="company-form"
          ref={(node) => { this.form = node; }} 
          onPreSubmit={this.props.onPreSubmit} 
          onPostSubmit={this.props.onPostSubmit}
          onSuccess={this.props.onSuccess}
          onError={this.props.onError}
        >
      
          <Pyr.Form.Group name="name">
            <Pyr.Form.Label>Name</Pyr.Form.Label>
            <Pyr.Form.TextField placeholder= "Company Name"/>
          </Pyr.Form.Group>

          <Pyr.Form.Group name="location">
            <Pyr.Form.Label>Location</Pyr.Form.Label>
            <Pyr.Form.TextField placeholder="Location" />
          </Pyr.Form.Group>
      
          <Pyr.Form.Group name="url" className="url">
            <Pyr.Form.Label>Website</Pyr.Form.Label>
            <Pyr.Form.TextField placeholder="Website" />
          </Pyr.Form.Group>

          <Pyr.Collapse label="Social">
            <Pyr.Form.Group name="twitter" className="url">
              <Pyr.Form.Label>Twitter Handle</Pyr.Form.Label>
              <Pyr.Form.TextField placeholder="Twitter Handle" />
            </Pyr.Form.Group>
  
            <Pyr.Form.Group name="linked_in" className="url">
              <Pyr.Form.Label>Linked In Company Page</Pyr.Form.Label>
              <Pyr.Form.TextField placeholder="Linked In" />
            </Pyr.Form.Group>
  
            <Pyr.Form.Group name="facebook" className="url">
              <Pyr.Form.Label>Facebook Company Page</Pyr.Form.Label>
              <Pyr.Form.TextField placeholder="Facebook" />
            </Pyr.Form.Group>
  
            <Pyr.Form.Group name="link" className="hidden">
              { Pyr.Util.times(this.state.links.length, (i) => {
                  return (
                    <Pyr.Form.Hidden key={"link"+i} value={this.state.links[i]} />
                  );
                })
              }
            </Pyr.Form.Group>
        
            { this.renderLinkList() }
          </Pyr.Collapse>


          <Pyr.Collapse label="Optional Details">
            <Pyr.Form.Group name="size">
              <Pyr.Form.Label>Number of Employees</Pyr.Form.Label>
              <Pyr.Form.TextField placeholder="Size" />
            </Pyr.Form.Group>
  
            <Pyr.Form.Group name="description">
              <Pyr.Form.Label>Description</Pyr.Form.Label>
              <Pyr.Form.TextArea placeholder="Company description" rows="10" />
            </Pyr.Form.Group>
          </Pyr.Collapse>
  
          <Pyr.Form.Group name="notes">
            <Pyr.Form.Label>Notes for Recruiters</Pyr.Form.Label>
            <Pyr.Form.TextArea placeholder="Note" rows="10" />
          </Pyr.Form.Group>

          </Pyr.Form.Form>
            <div className="form-footer">
          <Pyr.Form.SubmitButton target={this} disabled={this.props.isLoading}>Next</Pyr.Form.SubmitButton>
        </div>
      </div>
      
    );
  }
}


class NewSheet extends Sheet.New {
  getInitState(props) {
    company: null
  }

  success(data, textStatus, jqXHR) {
    let company = data.company;

    console.log("COMPANY");
    console.log(company);

    this.user().company = company;
    super.success(data, textStatus, jqXHR);
    this.setState({
      company: company
    });
  }

  title() {
    return "Company";
  }

  message() {
    return (
      <div className="helper">
        <div>Before posting your first job, tell us a bit about your company.</div>
        <div>The more information you can provide, the better recruiters can sell</div>
        <div>your company to candidates.</div>
      </div>
    );
  }

  renderForm() { 
    let company = this.user() ? this.user().company : null;
    company = company || {};

    return ( 
      <Pyr.Grid.Row>
        <Pyr.Grid.Col className="col-3">
          { this.message() }
        </Pyr.Grid.Col>
        <Pyr.Grid.Col>
        <CompanyForm 
          company={company}
          onPreSubmit={this.onPreSubmit} 
          onPostSubmit={this.onPostSubmit} 
          onSuccess={this.onSuccess}
        />
        </Pyr.Grid.Col>
      </Pyr.Grid.Row>
    );
  }

  render() {
    if (this.state.company) {
      return (
        <Redirect to="/jobs/new" />
      );
    }

    return super.render();

  }
}

class CompaniesPage extends Page {

  actionSheet(action) {
    let sheet = Sheet.sheetComponent(action || SHOW_ACTION);
    let ActionSheet = eval(sheet);

    return (
      <ActionSheet
        {...this.props}
      />
    );
  }

}

export default CompaniesPage;
