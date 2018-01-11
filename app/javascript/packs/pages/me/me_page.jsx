import React, { 
} from 'react';

import {
  Link,
  Redirect
} from 'react-router-dom';


import PropTypes from 'prop-types';

import Pyr, {
  Component
} from '../../pyr/pyr';
import Page from '../page';
import Sheet from '../sheet';
import {
  USERS_URL,
  EDIT_ACTION,
  DESTROY_SESSION_URL,
} from '../const';

class PasswordModal extends Pyr.UI.Modal {
  constructor(props) {
    super(props);

    this.initState({
      same: true
    });

    this.onCheckValid = this.checkValid.bind(this);
  }

  same() {
    let curVal = this.passwordField.value();

    if (curVal.length && (curVal == this.verifyField.value())) {
      return true;
    }

    return false;
  }

  valid() {
    let curVal = this.passwordField.value();
    return (curVal.length > 6);
  }
  
  checkValid() {
    this.setState({
      valid: this.valid()
    });
  }

  checkSame() {
    this.setState({
      same: this.same()
    });
  }

  renderInner() {
    return (
      <div>
        <Pyr.Form.Form
          model="User"
          object={this.props.me}
          url={this.props.url}
          method={Pyr.Method.PUT}
          id="password-form"
          ref={(node) => { this.form = node; }}
          onPreSubmit={this.props.onPreSubmit}
          onPostSubmit={this.props.onPostSubmit}
          onSuccess={this.props.onSuccess}
          onError={this.props.onError}
          className={Pyr.Util.ClassNames("form-parent section").push(!this.state.same ? "unmatches" : "")}
        >
          <div className="flx-row">
            <Pyr.Grid.Col>
              <Pyr.Form.Group name="password">
                <Pyr.Form.PasswordField 
                  placeholder= "Password"
                  ref={node => this.passwordField = node}
                  onChange={this.onCheckValid}
                />
              </Pyr.Form.Group>
            </Pyr.Grid.Col>

            <Pyr.Grid.Col>
              <Pyr.Form.Group name="verify_password">
                <Pyr.Form.PasswordField 
                  placeholder= "Verify Password"
                  ref={node => this.verifyField = node}
                  onChange={this.onCheckSame}
                />
              </Pyr.Form.Group>
            </Pyr.Grid.Col>
          </div>
        </Pyr.Form.Form>
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
          url={url}
          me={this.props.me}
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
    this.initState({
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
