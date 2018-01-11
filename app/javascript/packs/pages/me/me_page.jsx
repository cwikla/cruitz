import React, { 
  Component
} from 'react';

import {
  Link,
  Redirect
} from 'react-router-dom';


import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';

import Pyr from '../../pyr/pyr';
import Page from '../page';
import Sheet from '../sheet';
import {
  USERS_URL,
  EDIT_ACTION,
  DESTROY_SESSION_URL,
} from '../const';

class PasswordModal extends Pyr.UI.Modal {

  renderInner() {
    return (
        <div >
          Put a password form here.
          <div>ANother one</div>
          <div>ANother one</div>
          <div>ANother one</div>
          <div>ANother one</div>
          <div>ANother one</div>
          <div>ANother one</div>
          <div>ANother one</div>
        </div>
    );
  }
}


class MeForm extends Component {
  constructor(props) {
    super(props);

    this.onShowPassword = this.showPassword.bind(this);
  }

  showPassword(e) {
    if (e) {
      e.preventDefault();
    }
    this.password.show();
  }
  
  render() {
    let key = "me-form";
    let url = Pyr.URL(USERS_URL);

    let method = this.props.method || Pyr.Method.PUT;

    return (
      <div className="form-parent section">
        <PasswordModal
          ref={node => this.password = node}
        />
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

         <Pyr.Grid.Row>
           <Pyr.Grid.Col className="col-2">
             <Pyr.Form.Group name="logo">
               <Pyr.Form.FileSelector imageOnly/>
             </Pyr.Form.Group>
           </Pyr.Grid.Col>
 
           <Pyr.Grid.Col>
             <div className="flx-row">
               <Pyr.Grid.Col>
               <Pyr.Form.Group name="first_name">
                 <Pyr.Form.Label>First Name</Pyr.Form.Label>
                 <Pyr.Form.TextField placeholder= "First Name"/>
               </Pyr.Form.Group>
               </Pyr.Grid.Col>
 
               <Pyr.Grid.Col>
               <Pyr.Form.Group name="last_name">
                 <Pyr.Form.Label>Last Name</Pyr.Form.Label>
                 <Pyr.Form.TextField placeholder= "Last Name"/>
               </Pyr.Form.Group>
               </Pyr.Grid.Col>
             </div>
 
             <Pyr.Grid.Col>
               <Pyr.Form.Group name="email">
                 <Pyr.Form.Label>Email</Pyr.Form.Label>
                 <Pyr.Form.TextField placeholder= "Email"/>
               </Pyr.Form.Group>
             </Pyr.Grid.Col>
 
             <Pyr.Grid.Col>
               <Pyr.Form.Group name="password">
                 <Pyr.Form.Label>Password</Pyr.Form.Label>
                 <Pyr.UI.PrimaryButton onClick={this.onShowPassword}>Change Password</Pyr.UI.PrimaryButton>
               </Pyr.Form.Group>
             </Pyr.Grid.Col>
            </Pyr.Grid.Col>
          </Pyr.Grid.Row>
        </Pyr.Form.Form>
      </div>
    );
  }
}

class EditSheet extends Sheet.Edit {

  constructor(props) {
    super(props);
    this.mergeState({
      open: false
    });

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
    return "My Profile";
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
    console.log("GET ACTION");
    console.log(this.props.action);
    if (this.props.action && (this.props.action.toLowerCase() == 'password')) {
      console.log("RETURNING PASSWORD");
      return this.props.action;
    }

    return EDIT_ACTION;
  }

  loadSelected(unused, onLoading) {
    this.onSelect(this.user());
  }

  actionSheet(action) {
    let sheet = Sheet.sheetComponent(action || EDIT_ACTION);
    let ActionSheet = eval(sheet);

    return (
      <ActionSheet
        {...this.props}
        selected={this.getSelected()}
        onAction={this.onAction}
        onUnaction={this.onUnaction}
        onLoadSelected={this.onLoadSelected}
      />
    );
    
  }
}

function key(item) {
  return "me-" + item.id;
}
MePage.key = key;

export default MePage;
