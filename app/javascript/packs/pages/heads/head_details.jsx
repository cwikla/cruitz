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

import {
  HEADS_URL,
  COMPANY_URL,
  LOCATIONS_URL,
  SKILLS_URL,
} from '../const';

import CV from '../shared/cv';
import WebLink from '../shared/web_link';

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

class Full extends Component {
  constructor(props) {
    super(props);
    this.initState({
      edit: false,
      showLinkModal: false,
    });

    this.onSwap = this.swap.bind(this);

    this.onShowLinkModal = this.showLinkModal.bind(this);
    this.onCloseLinkModal = this.closeLinkModal.bind(this);
  }

  showLinkModal() {
    this.setState({
      showLinkModal: true
    });
  }

  closeLinkModal() {
    this.setState({
      showLinkModal: false
    });
  }

  swap() {
    console.log(this.state.edit);
    this.setState({
      edit: !this.state.edit
    });
  }

  render() {
    let url = HEADS_URL;

    let method = this.props.method || Pyr.Method.POST;
    let key = "head-form-" + this.props.head.id;

    return (
      <Pyr.PassThru>
        <div className="flx-row"><Pyr.UI.IconButton className="ml-auto" name={ this.state.edit ? "minus" : "plus"} onClick={this.onSwap} /></div>
        <Pyr.Form.Form
          model="Head"
          object={this.props.head}
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
          <CV.CV 
            {...this.props} 
            candidate={this.props.head} 
            edit={this.state.edit}
          />
        </Pyr.Form.Form>
      </Pyr.PassThru>
    );
  }
}

class Stats extends Component {
  render() {
    let rest = Pyr.Util.propsRemove(this.props, "head");
    let head = this.props.head;

    let views = 22;

    let acceptedCandy = 8;
    let rejectedCandy = 2;

    let total = acceptedCandy + rejectedCandy;

    return (
      <div {...Pyr.Util.propsMergeClassName(rest, "head-stats flx-col")} >
        <div className="header">Stats</div>
        <div className="guts">
          <div className="views">{views} Views</div>
          <div className="pie">
            <Pyr.UI.PieChart
              className="ml-auto mr-auto"
              slices={[
                { color: 'green', value: acceptedCandy },
                { color: 'red', value: rejectedCandy },
              ]}
            />
          </div>

          <div className="candy ml-auto mr-auto">
            <div className="total">{total} Applications</div>
            <div className="accepted">{acceptedCandy} Accepted</div>
            <div className="rejected">{rejectedCandy} Rejected</div>
          </div>
        </div>
      </div>
    );
  }
}



class FormLinks extends Component {
  render() {
    return (
      <div className="flx-row flx-wrap flx-1">
        <div className={ClassNames("web-links mr-auto")}>
          <Pyr.Form.Group name="full_name"><Pyr.Form.Label>Link</Pyr.Form.Label><div className="flx-row"><Pyr.Form.TextField /><Pyr.UI.Icon name="plus" /></div></Pyr.Form.Group>
        </div>
      </div>
    );
  }
}

class FormHeader extends Component {
  render() {
    let clazzes = ClassNames("cv-form-header flx-col flx-noshrink");

    return (
      <div className={clazzes} >
        <div className="flx-row flx-1">
          <div className={ClassNames("name mr-auto")}>
            <Pyr.Form.Group name="full_name"><Pyr.Form.Label>Name</Pyr.Form.Label><Pyr.Form.TextField /></Pyr.Form.Group>
          </div>
        </div>
        <div className="flx-row flx-1 info">
          <div className={ClassNames("phone-number flx-1")}>
            <Pyr.Form.Group name="phone_number"><Pyr.Form.Label>Phone Number</Pyr.Form.Label><Pyr.Form.TextField /></Pyr.Form.Group>
          </div>
          <div className={ClassNames("email flx-1")}>
            <Pyr.Form.Group name="email"><Pyr.Form.Label>Email</Pyr.Form.Label><Pyr.Form.TextField /></Pyr.Form.Group>
          </div>
        </div>
        <div className="flx-row flx-1 info">
          <div className={ClassNames("salary mr-auto flx-1")}>
            <Pyr.Form.Group name="salary"><Pyr.Form.Label>Salary</Pyr.Form.Label><Pyr.Form.TextField /></Pyr.Form.Group>
          </div>
        </div>
        <div className="flx-row-stretch info social-links">
          <FormLinks />
        </div>
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
    //console.log("GETTING TARGET");
    //console.log(this.form);
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
      <div className="flx-col scroll">
        <div className="section flx-1">
          <div className="form-parent cv">
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
    
              <FormHeader />
              
    
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
        </div>
      </div>
    );
  }
}

const HeadDetails = {
  Full,
  Stats,
  Form : HeadForm,
};

export default HeadDetails;
