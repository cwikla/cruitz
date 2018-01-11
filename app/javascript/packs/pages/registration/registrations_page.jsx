import React, { 
} from 'react';

import PropTypes from 'prop-types';

import Pyr, {
  Component
} from '../../pyr/pyr';
const ClassNames = Pyr.ClassNames;

import Page from '../page';
import Sheet from '../sheet';

import { 
} from '../shared/user';

import {
  USERS_URL,

  NEW_ACTION,
} from '../const';


class RegistrationCard extends Component {
  render() {
    let registration = this.props.registration;

    let id = "registration-" + registration.id;
    let allClass = ClassNames("item registration-item");

    if (this.props.selected) {
       allClass.push("selected");
    }
    let description = registration.description || "No Description";

    return (
      <div className={ClassNames("card").push(allClass)}>
        <div className="view overlay hm-white-slight">
          <img src={getLogo(id)} className="img-fluid" alt="" />
          <a>
              <div className="mask"></div>
          </a>
        </div>
        <div className="card-body">
            <a className="activator"><i className="fa fa-share-alt"></i></a>
            <h4 className="card-title">Card title</h4>
            <hr/>
            <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
            <a href="#" className="black-text d-flex flex-row-reverse">
                <h5 className="waves-effect p-2">Read more <i className="fa fa-chevron-right"></i></h5>
            </a>
        </div>
      </div>
    );
  }
}

class RegistrationItem extends Component {

  render() {
    if (this.props.card) {
      return (
        <RegistrationCard {...this.props}/>
      );
    }

    let registration = this.props.registration;
    
    let id = "registration-" + registration.id;
    let allClass = ClassNames("item registration-item flx-row");
    
    if (this.props.selected) {
       allClass.push("selected");
    }  
    
    let description = registration.description || "No Description";
    
    return (
      <div className={allClass} id={id}>
        <Pyr.Grid.Column className="registration col-6">
          <div>{registration.title}</div>
          <div>Created: <Pyr.UI.MagicDate date={registration.created_at}/></div>
        </Pyr.Grid.Column>
        <Pyr.Grid.Column className="item-content">
          <div>Total: {registration.candidate_counts.total}</div>
          <div>Accepted: {registration.candidate_counts.accepted}</div>
          <div>New: {registration.candidate_counts.waiting}</div>
          <div>Rejected: {registration.candidate_counts.rejected}</div>
        </Pyr.Grid.Column>
      </div>
    );
  }


}

class RegistrationForm extends Component {
  constructor(props) {
    super(props);

    this.initState({
      skills: []
    });

  }

  methodToName(method) {
    switch (method) {
      case Pyr.Method.PUT:
        return "Update";
        break

      default:
        return "Add";
        break;
    }
  }

  render() {
    let key = "registration-form";
    let url = Pyr.URL(JOBS_URL);

    if (this.props.selected){
      url = url.push(this.props.selected.id);
      key = key + "-" + this.props.selected.id;
    }

    let method = this.props.method || Pyr.Method.POST;

    //alert("Render FOrm Registration " + this.props.selected.id);


    return (
      <div className="form-parent">
        <Pyr.Form.Form
          model="Registration"
          object={this.props.selected}
          url={url}
          method={method}
          id="registration-form" 
          key={key}
          ref={(node) => { this.form = node; }} 
          onPreSubmit={this.props.onPreSubmit} 
          onPostSubmit={this.props.onPostSubmit}
          onSuccess={this.props.onSuccess}
          onError={this.props.onError}
        >
      
          <Pyr.Form.Group name="title">
            <Pyr.Form.Label>Title</Pyr.Form.Label>
            <Pyr.Form.TextField placeholder= "Enter registration title"/>
          </Pyr.Form.Group>
      
          <Pyr.Form.Group name="location">
            <Pyr.Form.Label>Location</Pyr.Form.Label>
            <Pyr.Form.TextField placeholder="Enter location" />
          </Pyr.Form.Group>
      
          <Pyr.Form.Group name="time_commit">
            <Pyr.Form.Label>Time Requirements</Pyr.Form.Label>
            <Pyr.Form.Select>
              <Pyr.Form.Option value="0">Full Time</Pyr.Form.Option>
              <Pyr.Form.Option value="1">Part Time</Pyr.Form.Option>
              <Pyr.Form.Option value="2">Contractor</Pyr.Form.Option>
            </Pyr.Form.Select>
          </Pyr.Form.Group>

          <Pyr.Form.Group name="skill" className="skill">
            <Pyr.Form.Label>Desired Skills</Pyr.Form.Label>
            <Pyr.Form.TextField placeholder="Add Skill" onSubmit={this.onAddSkill} ref={(node) => {this.skillField = node}}/>
          </Pyr.Form.Group>

          <Pyr.Form.Group name="skill" className="hidden">
            { Pyr.Util.times(this.state.skills.length, (i) => {
                return (
                  <Pyr.Form.Hidden key={"skill"+i} value={this.state.skills[i]} />
                );
              })
            }
          </Pyr.Form.Group>

          { this.renderSkillList() }

          <Pyr.Form.Group name="description">
            <Pyr.Form.Label>Description</Pyr.Form.Label>
            <Pyr.Form.TextArea placeholder="Enter description" rows="10" />
          </Pyr.Form.Group>

      
        </Pyr.Form.Form>
      <div className="form-footer">
        <Pyr.Form.SubmitButton target={this} disabled={this.props.isLoading}>{this.methodToName(method)}</Pyr.Form.SubmitButton>
      </div>
      </div>
    );
  }
}

class EditSheet extends Sheet.Edit {
  success(data, textStatus, jqXHR) {
    this.props.onRegistrationUpdate(data.registration);
  }

  renderForm() {
    //alert("JOB EDIT " + this.props.selected.id);
    return (
      <RegistrationForm 
        onPreSubmit={this.onPreSubmit} 
        onPostSubmit={this.onPostSubmit} 
        registration={this.props.selected} 
        onSuccess={this.onSuccess}
        method={Pyr.Method.PUT} 
        isLoading={this.state.isLoading}/>
    );
  }
}



class UserForm extends Component {
  render() {
    return (
      <div className="fullscreen">
        <Pyr.Form.Form
          url="#"
          model="registration"
          method={Pyr.Method.POST}
          ref={(node) =>{ this.form = node; }}
          onPreSubmit={this.props.onPreSubmit}
          onPostSubmit={this.props.onPostSubmit}
          onSuccess={this.props.onSuccess}
          onError={this.props.onError}
        >
          <Pyr.Form.Group name="title">
            <Pyr.Form.Label>Title</Pyr.Form.Label>
            <Pyr.Form.TextField placeholder= "Enter job title"/>
          </Pyr.Form.Group>
        </Pyr.Form.Form>
      </div>
    );
  }
}

const ChooseButton = (props) => (
  <div className="choose-button">
    <img src={props.src} className="image" />
    <div className="middle">
      <div className="text btn-primary">{props.text}</div>
    </div>
  </div>
);

class Choose extends Component {
  render() {
    console.log(this.props);

    return (
      <div className="registration fullscreen">
        <Pyr.Grid.Row className="blurb">
          <Pyr.Grid.Col>
            <h3>Welcome to Cruitz!</h3>
          </Pyr.Grid.Col>
        </Pyr.Grid.Row>

        <Pyr.Grid.Row className="choices">
          <Pyr.Grid.Col />
          <Pyr.Grid.Col className="choice hirer flx-col flx-align-center flx-justify-center" onClick={(e) => this.props.toPage(1) }>
            <div className="title">
            Do you have jobs to fill? Sign up here to get our network of independent recruiters and agencies to start immediately sending you
            highly qualified candidates.</div>
            <ChooseButton src="/assets/images/hiring.jpg" text="Hiring"/>
          </Pyr.Grid.Col>

          <Pyr.Grid.Col className="choice recruiter flx-col flx-align-center flx-justify-center" onClick={(e) => this.props.toPage(2) }>
            <div className="title">
              Are you a recruiter or agency who wants access to the best companies and openings for your candidates?
            </div>
            <ChooseButton src="/assets/images/recruiting.jpg" text="Recruiting"/>
          </Pyr.Grid.Col>
          <Pyr.Grid.Col />
        </Pyr.Grid.Row>
      </div>
    );
  }
}

class WizardSheet extends Sheet.Wizard {
  pageCount() {
    return 3;
  }

  render() {
    let kidProps = {
      onNext: this.onNext,
      onPrev: this.onPrev,
      toPage: this.toPage,
    };

    return (
      <Pyr.UI.ChildSelector page={this.state.page}>
        <Choose {...kidProps}/>
        <div className="fullscreen">
          <label onClick={this.onPrev}>Prev</label>
          <label onClick={this.onNext}>Next</label>
        </div>
        <UserForm {...kidProps}/>
      </Pyr.UI.ChildSelector>
    );
  }
}

class ShowSheet extends Sheet.Show {
  key(registration) {
    return RegistrationsPage.key(registration);
  }

  renderItem(registration, isSelected) {
    return (
        <RegistrationItem 
          registration={registration} 
          selected={isSelected}
        />
    );
  }
}

class NewSheet extends Sheet.New {

  success(data, textStatus, jqXHR) {
    this.props.onRegistrationCreate(data.registration);
    super.success(data, textStatus, jqXHR);
    this.context.setNotice("Registration Created");
  }

  title() {
    return "Add a New Registration";
  }

  renderForm() { 
    return ( 
      <div>
        <RegistrationForm 
          onPreSubmit={this.onPreSubmit} 
          onPostSubmit={this.onPostSubmit} 
          onSuccess={this.onSuccess}
        />
      </div>
    );
  }
}

class RegistrationsPage extends Page {
  name() {
    return "Registrations";
  }

  indexSheet() {
    return (
      <WizardSheet
        {...this.props}
        items={this.props.registrations}
        registrations={this.props.registrations}
        registrationMap={this.props.registrationMap}
        onSelect={this.onSelect}
        onSetAction={this.props.onSetAction}
        onSetUnaction={this.props.onSetUnaction}
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
        registrations={this.props.registrations}
        registrationMap={this.props.registrationMap}
        onSetAction={this.props.onSetAction}
        onSetUnaction={this.props.onSetUnaction}
        onLoadSelected={this.onLoadSelected}
      />
    );

  }

}

function key(item) {
  return item.id;
}
RegistrationsPage.key = key;

export default RegistrationsPage;
