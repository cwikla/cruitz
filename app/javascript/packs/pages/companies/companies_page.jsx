import React from 'react';

import PropTypes from 'prop-types';

import {
  Link,
} from 'react-router-dom';

import Pyr, {
  Component
} from '../../pyr/pyr';
const ClassNames = Pyr.ClassNames;

import Page from '../page';
import Sheet from '../sheet';

import {
  SEARCH_URL,
  COMPANY_URL,
  LOCATIONS_URL,

  EDIT_ACTION,
} from '../const';

class CompanyHeaderForm extends Component {

  render() {
    let method = Pyr.Method.PATCH;

    console.log("COMPANY");
    console.log(this.props.company);

    return (
      <div className="form-header-parent section">
        <Pyr.Form.Form
          model="Company"
          object={this.props.company}
          url={COMPANY_URL}
          method={method}
          id="company-header-form"
          key="company-header-form"
          ref={(node) => { this.form = node; }}
          onPreSubmit={this.props.onPreSubmit}
          onPostSubmit={this.props.onPostSubmit}
          onSuccess={this.props.onSuccess}
          onError={this.props.onError}
        >

        <Pyr.Grid.Row>
          <Pyr.Grid.Col className="col-2">
            <Pyr.Form.Group name="logo">
              <Pyr.Form.FileSelector imageOnly/>
            </Pyr.Form.Group>
          </Pyr.Grid.Col>

          <Pyr.Grid.Col>
            <Pyr.Form.Group name="name">
              <Pyr.Form.Label>Name</Pyr.Form.Label>
              <Pyr.Form.TextField placeholder= "Company Name"/>
            </Pyr.Form.Group>
 
           <Pyr.Form.Group name="location">
             <Pyr.Form.Label>Location</Pyr.Form.Label>
             <Pyr.Form.AutoComplete url={LOCATIONS_URL} />
           </Pyr.Form.Group>

            <Pyr.Form.Group name="url">
              <Pyr.Form.Label>Website</Pyr.Form.Label>
              <Pyr.Form.TextField placeholder="Website" />
            </Pyr.Form.Group>
          </Pyr.Grid.Col>
        </Pyr.Grid.Row>

        </Pyr.Form.Form>
      </div>
    );
  }
}

class CompanyDetailsForm extends Component {
  render() {
    let method = Pyr.Method.PATCH;

    return (
      <div className="form-details-parent section">
        <Pyr.Form.Form
          model="Company"
          object={this.props.company}
          url={COMPANY_URL}
          method={method}
          id="company-details-form"
          key="company-details-form"
          ref={(node) => { this.form = node; }}
          onPreSubmit={this.props.onPreSubmit}
          onPostSubmit={this.props.onPostSubmit}
          onSuccess={this.props.onSuccess}
          onError={this.props.onError}
        >
          <div>
            <Pyr.Form.Group name="size">
              <Pyr.Form.Label>Number of Employees</Pyr.Form.Label>
              <Pyr.Form.TextField placeholder="Size" />
            </Pyr.Form.Group>

            <Pyr.Form.Group name="description">
              <Pyr.Form.Label>Description</Pyr.Form.Label>
              <Pyr.Form.TextArea placeholder="Company description" rows="10" />
            </Pyr.Form.Group>
          </div>

          <Pyr.Form.Group name="notes">
            <Pyr.Form.Label>Notes for Recruiters</Pyr.Form.Label>
            <Pyr.Form.TextArea placeholder="Note" rows="10" />
          </Pyr.Form.Group>
        </Pyr.Form.Form>
      </div>
    );
  }
}

class CompanyLinksForm extends Component {
  constructor(props) {
    super(props);

    this.initState({
      links: []
    });

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
                  <Pyr.UI.FancyButton
                    key={"llb"+i}
                    onClick={this.removeLink.bind(this, i)}
                  >{this.state.links[i]}</Pyr.UI.FancyButton>
                );
              })
            }
          </div>
    );
  }



  render() {
    let method = Pyr.Method.PATCH;

    console.log("COMPANY");
    console.log(this.props.company);

    return (
      <div className="form-links-parent section">
        <Pyr.Form.Form
          model="Company"
          object={this.props.company}
          url={COMPANY_URL}
          method={method}
          id="company-links-form"
          key="company-links-form"
          ref={(node) => { this.form = node; }}
          onPreSubmit={this.props.onPreSubmit}
          onPostSubmit={this.props.onPostSubmit}
          onSuccess={this.props.onSuccess}
          onError={this.props.onError}
        >

          <div>
            <Pyr.Form.Group name="twitter" className="url">
              <Pyr.Form.Label>Twitter</Pyr.Form.Label>
              <Pyr.Form.TextField placeholder="Twitter" />
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
          </div>

        </Pyr.Form.Form>
      </div>
    );
  }
}

class CompanyForm extends Component {
  constructor(props) {
    super(props);

    this.initState({
      links: []
    });

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
                  <Pyr.UI.FancyButton
                    key={"llb"+i}
                    onClick={this.removeLink.bind(this, i)}
                  >{this.state.links[i]}</Pyr.UI.FancyButton>
                );
              })
            }
          </div>
    );
  }


  render() {
    let method = Pyr.Method.PATCH;

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
      
          <Pyr.Form.Group name="logo">
            <Pyr.Form.Label>Logo</Pyr.Form.Label>
            <Pyr.Form.TextField placeholder= "Logo"/>
          </Pyr.Form.Group>

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

          <Pyr.UI.Collapse label="Social">
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
          </Pyr.UI.Collapse>


          <Pyr.UI.Collapse label="Optional Details">
            <Pyr.Form.Group name="size">
              <Pyr.Form.Label>Number of Employees</Pyr.Form.Label>
              <Pyr.Form.TextField placeholder="Size" />
            </Pyr.Form.Group>
  
            <Pyr.Form.Group name="description">
              <Pyr.Form.Label>Description</Pyr.Form.Label>
              <Pyr.Form.TextArea placeholder="Company description" rows="10" />
            </Pyr.Form.Group>
          </Pyr.UI.Collapse>
  
          <Pyr.Form.Group name="notes">
            <Pyr.Form.Label>Notes for Recruiters</Pyr.Form.Label>
            <Pyr.Form.TextArea placeholder="Note" rows="10" />
          </Pyr.Form.Group>

          </Pyr.Form.Form>
            <div className="form-footer">
          <Pyr.Form.SubmitButton target={this} disabled={this.props.isLoading}>Save</Pyr.Form.SubmitButton>
        </div>
      </div>
      
    );
  }
}


class EditSheet extends Sheet.Edit {
  constructor(props, context) {
    super(props, context);

    this.initState({ 
      company : context.user.company 
    });
  }

  success(data, textStatus, jqXHR) {
    let company = data.company;

    console.log("COMPANY");
    console.log(company);

    let user = this.user();
    user.company = company;

    console.log("COMPANY 2");
    console.log(this.user().company);

    super.success(data, textStatus, jqXHR);
    this.setState({
      company: company
    });
  }

  title() {
    return "Company Information";
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
    let company = this.state.company;

    company = company || {};

    return ( 
      <div className="company">
        <Pyr.Grid.Row>
          <Pyr.Grid.Col>
          <CompanyHeaderForm 
            company={company}
            onPreSubmit={this.onPreSubmit} 
            onPostSubmit={this.onPostSubmit} 
            onSuccess={this.onSuccess}
          />
          <CompanyDetailsForm 
            company={company}
            onPreSubmit={this.onPreSubmit} 
            onPostSubmit={this.onPostSubmit} 
            onSuccess={this.onSuccess}
          />
          <CompanyLinksForm 
            company={company}
            onPreSubmit={this.onPreSubmit} 
            onPostSubmit={this.onPostSubmit} 
            onSuccess={this.onSuccess}
          />
          </Pyr.Grid.Col>
        </Pyr.Grid.Row>
      </div>
    );
  }

}

class CompaniesPage extends Page {

  name() {
    return "Company";
  }

  showActionSheet() {
    return true;
  }

  getAction() {
    return EDIT_ACTION;
  }

  loadSelected(unused, onLoading) {
    this.onSelect(this.user());
  }

  actionSheet(action) {
    return (
      <EditSheet
        {...this.props}
        selected={this.getSelected()}
        onAction={this.onAction}
        onUnaction={this.onUnaction}
        onLoadSelected={this.onLoadSelected}
      />
    );

  }



}

export default CompaniesPage;
