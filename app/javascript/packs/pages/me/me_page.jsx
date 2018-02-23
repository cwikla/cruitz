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
  EDIT_ACTION,
  DESTROY_SESSION_URL,
  PASSWORD_URL,
  ME_URL,
} from '../const';

const MIN_PWD_LENGTH = 8;

class PasswordModal extends Pyr.UI.Modal {
  constructor(props) {
    super(props);

    this.initState({
      same: false,
      validLength: false,
      validLetters: false,
      validNumbers: false,
      visible: false
    });

    this.onCheckValidPassword = this.checkValidPassword.bind(this);
    this.onCheckSame = this.checkSame.bind(this);
    this.onSetVisible = this.setVisible.bind(this);
  }

  setVisible() {
    this.setState({
      visible: !this.state.visible
    });
  }

  isSame(verify) {
    let curVal = this.passwordField.value();

    if (curVal.length && (curVal == verify)) {
      return true;
    }

    return false;
  }

  checkValidPassword(e) {
    let pwd = e.target.value;
    if (pwd) {
      pwd = $.trim(pwd);
    }

    let validLength = pwd && (pwd.length >= MIN_PWD_LENGTH);
    let validLetters = pwd && (pwd.match(/[a-zA-Z]/) != null);
    console.log(pwd.match(/[a-zA-Z]/));
    console.log(validLetters);
    let validNumbers = pwd && (pwd.match(/[0-9]/) != null);

    this.setState({
      validLength,
      validLetters,
      validNumbers,
    });
  }

  checkSame(e) {
    let pwd = e.target.value;
    this.setState({
      same: this.isSame(pwd)
    });
  }

  valid() {
    return (
      this.state.validLength && 
      this.state.validLetters &&
      this.state.validNumbers &&
      this.state.same
    );
  }

  renderInner() {
    let AField = this.state.visible ? Pyr.Form.TextField : Pyr.Form.PasswordField;
    let disabled = !this.valid();

    let goodLength = this.state.validLength;
    let oneLetter = this.state.validLetters;
    let oneNumber = this.state.validNumbers;
    let same = this.state.same;

    return (
      <div className="password-modal">
        <div className="flx-0" >
          <h3 className="title">Change Password</h3>
        </div>

        <Pyr.Form.Form
          model="User"
          object={this.props.me}
          url={PASSWORD_URL}
          method={Pyr.Method.PATCH}
          id="password-form"
          ref={(node) => { this.form = node; }}
          onPreSubmit={this.props.onPreSubmit}
          onPostSubmit={this.props.onPostSubmit}
          onSuccess={this.props.onSuccess}
          onError={this.props.onError}
          className={Pyr.Util.ClassNames("form-parent section").push(!same ? "unmatches" : "")}
        >
          <div className="flx-row">
            <Pyr.Grid.Col className="">
              <Pyr.Form.Group name="password">
                <AField
                  placeholder= "Password"
                  ref={node => this.passwordField = node}
                  onChange={this.onCheckValidPassword}
                />
              </Pyr.Form.Group>
            </Pyr.Grid.Col>

            <Pyr.Grid.Col className="">
              <Pyr.Form.Group name="password_confirmation">
                <AField
                  placeholder= "Verify Password"
                  ref={node => this.verifyField = node}
                  onChange={this.onCheckSame}
                  className={same ? "good" : ""}
                />
              </Pyr.Form.Group>
            </Pyr.Grid.Col>
          </div>
          <div className="flx-col password-hint">
            Your password must:
            <ul>
              <li className={goodLength ? "good" : ""}>be {MIN_PWD_LENGTH} characters or longer</li>
              <li className={oneLetter ? "good" : ""}>contain 1 letter</li>
              <li className={oneNumber ? "good" : ""}>contain 1 number</li>
            </ul>
          </div>
        </Pyr.Form.Form>
        <div className="form-footer">
          <Pyr.Form.SubmitButton target={this} disabled={disabled}>Save</Pyr.Form.SubmitButton>
        </div>
      </div>
    );
  }
}


class MeForm extends Component {
  //static contextTypes = Pyr.UI.NoticeContextTypes;

  constructor(props) {
    super(props);

    this.onShowPassword = this.showPassword.bind(this);
    this.onHidePassword = this.hidePassword.bind(this);
    this.onSuccess = this.success.bind(this);

    this.initState({
      showPassword: false
    });
  }

  showPassword(e) {
    if (e) {
      e.preventDefault();
    }
    this.setState({
      showPassword: true
    });
  }

  hidePassword() {
    this.setState({
      showPassword: false
    });
  }

  success() {
    this.hidePassword();
    this.context.setNotice("Password Updated");
  }

  
  render() {
    let key = "me-form";
    let url = Pyr.URL(ME_URL);

    let method = this.props.method || Pyr.Method.PATCH;

     let logo = this.props.me.logo;

    return (
      <div className="form-parent section">
        <PasswordModal
          ref={node => this.password = node}
          url={url}
          me={this.props.me}
          onSuccess={this.onSuccess}
          open={this.state.showPassword}
          onClose={this.onHidePassword}
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
               <Pyr.Form.FileSelector imageOnly uploads={logo}/>
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

  success(data, textStatus, jqXHR) {
    let user = data.user;

    this.setUser(user);

    super.success(data, textStatus, jqXHR);

    this.setNotice("Profile updated");
    this.goBack();
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

  getTarget() {
    console.log("GET TARGET");
    return this.me_form.form;
  }

  renderForm() {
    return (
      <div className="me-index-header">
        <MeForm 
          me={this.user()} 
          ref={(node) => this.me_form = node}
          onSuccess={this.onSuccess}
        />
        <div className="me-info p-1 d-flex flx-end">
          <Pyr.UI.PrimaryButton onClick={this.onLogout}><Pyr.UI.Icon name="sign-out"/>Logout</Pyr.UI.PrimaryButton>
        </div>
      </div>
    );
  }

  unused_renderTitle() {
    return (
      <h3 className="mr-auto title flx-row"><span className="mt-auto mb-auto mr-auto">{this.title()}</span> {this.renderButton()}</h3>
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
