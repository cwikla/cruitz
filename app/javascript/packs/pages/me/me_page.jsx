import React, { 
  Component
} from 'react';

import {
  Redirect
} from 'react-router-dom';


import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';

import Pyr from '../../pyr/pyr';
import Page from '../page';
import Sheet from '../sheet';
import {
  USERS_URL,
  NEW_ACTION,
  DESTROY_SESSION_URL,
} from '../const';

class MeForm extends Component {
  
  render() {
    let key = "me-form";
    let url = Pyr.URL(USERS_URL);

    let method = this.props.method || Pyr.Method.PUT;

    return (
      <div className="form-parent">
        <Pyr.Form.Form
          model="User"
          object={this.props.me}
          url={url}
          method={method}
          id="me-form"
          key={key}
          ref={(node) => { this.form = node; }}
          onPreSubmit={this.props.onPreSubmit}
          onPostSubmit={this.props.onPostSubmit}
          onSuccess={this.props.onSuccess}
          onError={this.props.onError}
        >

          <div className="flx-row">
            <Pyr.Form.Group name="first_name">
              <Pyr.Form.Label>First Name</Pyr.Form.Label>
              <Pyr.Form.TextField placeholder= "First Name"/>
            </Pyr.Form.Group>

            <Pyr.Form.Group name="last_name">
              <Pyr.Form.Label>Last Name</Pyr.Form.Label>
              <Pyr.Form.TextField placeholder= "Last Name"/>
            </Pyr.Form.Group>
          </div>

          <Pyr.Form.Group name="email">
            <Pyr.Form.Label>Email</Pyr.Form.Label>
            <Pyr.Form.TextField placeholder= "Email"/>
          </Pyr.Form.Group>

          <Pyr.Form.Group name="password">
            <Pyr.Form.Label>Password</Pyr.Form.Label>
            <Pyr.Form.PasswordField />
          </Pyr.Form.Group>

        </Pyr.Form.Form>

        <div className="form-footer">
          <Pyr.Form.SubmitButton target={this} disabled={this.props.isLoading}>Save</Pyr.Form.SubmitButton>
        </div>
      </div>
    );
  }
}

class NewSheet extends Sheet.New {
  getInitState(props) {
    return {
      open: false
    };
  }
  constructor(props) {
    super(props);

    this.onLogout = this.logout.bind(this);
  }

  componentWillMount() {
    this.setState({
      open: true
    });
  }

  toRoot() {
    window.location = "/"; // HMMMm
  }

  logout(e) {
    if (e) {
      e.preventDefault();
    }

    this.getJSON({
      remote: "/", // don't use /api/v1
      url: DESTROY_SESSION_URL,
      type: Pyr.Method.DELETE
    }).done(() => {
      this.toRoot();
    });
  }

  close(e) {
    this.setState({
      open: false
    });

    super.close(e);
  }

  render() {
    if (!this.state.open) {
      return (<Redirect to="/messages" />);
    }
    return super.render();
  }

  renderForm() {

    return (
      <div className="me-index-header">
        <MeForm me={this.user()}/>
        <div className="me-info p-1 d-flex flx-end">
          <Pyr.UI.PrimaryButton onClick={this.onLogout}><Pyr.UI.Icon name="sign-out"/>Logout</Pyr.UI.PrimaryButton>
        </div>
      </div>
    );
  }


  title() {
    let me = this.user();
    return me.first_name + " " + me.last_name;
  }
}

class MePage extends Page {
  name() {
    return "Me";
  }

  showActionSheet() {
    return true;
  }

  getAction() {
    return NEW_ACTION;
  }

  loadSelected(unused, onLoading) {
    this.onSelect(this.user());
  }

  actionSheet(action) {
    return (
      <NewSheet
        {...this.props}
        selected={this.getSelected()}
        onAction={this.onAction}
        onUnaction={this.onUnaction}
      />
    );
    
  }
}

function key(item) {
  return "me-" + item.id;
}
MePage.key = key;

export default MePage;
