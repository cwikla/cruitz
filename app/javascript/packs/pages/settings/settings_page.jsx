import React, { 
} from 'react';

import PropTypes from 'prop-types';

import Pyr, {
  Component
} from '../../pyr/pyr';

import Page from '../page';
import Sheet from '../sheet';
import {
  SETTINGS_URL,
  EDIT_ACTION
} from '../const';

class SettingsForm extends Component {

  render() {
    let key = "settings-form";
    let url = Pyr.URL(SETTINGS_URL);

    let method = Pyr.Method.PATCH;

    let settings = this.props.settings;

    return (
      <div 
        id="settings-form-parent" 
        className="flx-col flx-1 section"
      >
        <Pyr.Form.Form
          model="Setting"
          object={settings}
          url={url}
          method={method}
          id="setting-form"
          key={key}
          ref={(node) => { this.form = node; }}
          onPreSubmit={this.props.onPreSubmit}
          onPostSubmit={this.props.onPostSubmit}
          onSuccess={this.props.onSuccess}
          onError={this.props.onError}
        >
          <div className="flx-row">
            <Pyr.Form.Group name="use_ignore_recruiters" className="">
              <Pyr.Form.CheckBox className="">Ignore recruiters with score under</Pyr.Form.CheckBox>
            </Pyr.Form.Group>
            <Pyr.Form.Group name="minimum_recruiter_score" data-checkbox="use_ignore_recruiters" className="">
              <Pyr.Form.TextField />
            </Pyr.Form.Group>
          </div>

          <div className="flx-row">
            <Pyr.Form.Group name="use_ignore_agencies">
              <Pyr.Form.CheckBox> Ignore agencies with score under</Pyr.Form.CheckBox>
            </Pyr.Form.Group>
            <Pyr.Form.Group name="minimum_agency_score" data-checkbox="use_ignore_agencies">
              <Pyr.Form.TextField />
            </Pyr.Form.Group>
          </div>

          <div className="flx-row">
            <Pyr.Form.Group name="use_reject_candidates">
              <Pyr.Form.CheckBox> Pass on candidates after</Pyr.Form.CheckBox>
            </Pyr.Form.Group>
            <Pyr.Form.Group name="reject_candidate_days" data-checkbox="use_reject_candidates">
              <Pyr.Form.TextField />
            </Pyr.Form.Group>
            <Pyr.Form.Group>
                <label className="detail">days of no response</label>
            </Pyr.Form.Group>
          </div>

          <div className="flx-row">
            <Pyr.Form.Group name="use_auto_spam">
              <Pyr.Form.CheckBox>Automatic spam detection</Pyr.Form.CheckBox>
            </Pyr.Form.Group>
          </div>

          <div className="flx-row">
            <Pyr.Form.Group name="use_recruiter_limit">
              <Pyr.Form.CheckBox>Limit recruiter to</Pyr.Form.CheckBox>
            </Pyr.Form.Group>
            <Pyr.Form.Group name="recruiter_limit" data-checkbox="use_recruiter_limit">
              <Pyr.Form.TextField />
            </Pyr.Form.Group>
            <Pyr.Form.Group>
              <label className="detail">candidates per day</label>
            </Pyr.Form.Group>
          </div>

          <div className="flx-row">
            <Pyr.Form.Group name="use_agency_limit">
              <Pyr.Form.CheckBox>Limit agency to</Pyr.Form.CheckBox>
            </Pyr.Form.Group>
            <Pyr.Form.Group name="agency_limit" data-checkbox="use_agency_limit">
              <Pyr.Form.TextField />
            </Pyr.Form.Group>
            <Pyr.Form.Group>
              <label className="detail">candidates per day</label>
            </Pyr.Form.Group>
          </div>

        </Pyr.Form.Form>
      </div>

    );
  }
}

class EditSheet extends Sheet.Edit {

  title() {
    return "Settings";
  }


  renderForm() {
    return (
      <SettingsForm 
        settings={this.props.selected}
        ref={(node) => this.target = node}
      />
    );
  }
}

class SettingsPage extends Page {
  name() {
    return "Settings";
  }

  showActionSheet() {
    return true;
  }

  getAction() {
    return EDIT_ACTION;
  }

  loadSelected(unused, onLoading) {
    this.getJSON({
      url: this.props.url,
      context: this,
      onLoading: onLoading,

    }).done((data, textStatus, jqXHR) => {
        this.onSelect(data.setting);

    }).fail((jqXHR, textStatus, errorThrown) => {

      Pyr.Network.ajaxError(jqXHR, textStatus, errorThrown);
    });
  }


  actionSheet(action) {
    return (
      <EditSheet
        {...this.props}
        onSelect={this.onSelect}
        onAddItem={this.onAddItem}
        onLoadSelected={this.onLoadSelected}

        selected={this.getSelected()}
        loading={this.state.loading}
      />
    );
    
  }
}

function key(item) {
  return "set-" + item.id;
}
SettingsPage.key = key;

export default SettingsPage;
