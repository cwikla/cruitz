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

    Pyr.getJSON({
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
          <div className="me-info p-1 d-flex flx-end">
            <Pyr.PrimaryButton onClick={this.onLogout}><Pyr.Icon name="sign-out"/>Logout</Pyr.PrimaryButton>
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
