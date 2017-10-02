import React, { 
  Component
} from 'react';

import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';

import Pyr from '../../pyr/pyr';
import Page from '../page';
import Sheet from '../sheet';
import {
  SETTINGS_URL,
  SHOW_ACTION
} from '../const';

class SettingsForm extends Component {

  render() {
    let key = "settings-form";
    let url = Pyr.URL(SETTINGS_URL);

    console.log("SAVE BUTTON: " + this.props.saveButton);
    console.log("SAVE URL: " + url);

    let method = Pyr.Method.PUT;

    return (
      <div id="settings-form-parent" className="flx-col flx-1">
        <Pyr.Form.Form
          model="Setting"
          object={this.props.settings}
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
            </Pyr.Form.Group> days of no response
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
            </Pyr.Form.Group> candidates per day
          </div>

          <div className="flx-row">
            <Pyr.Form.Group name="use_agency_limit">
              <Pyr.Form.CheckBox>Limit agency to</Pyr.Form.CheckBox>
            </Pyr.Form.Group>
            <Pyr.Form.Group name="agency_limit" data-checkbox="use_agency_limit">
              <Pyr.Form.TextField />
            </Pyr.Form.Group> candidates per day
          </div>

        </Pyr.Form.Form>
      </div>

    );
  }
}

class ShowSheet extends Sheet.Show {

  renderHeader() {
    return (
      <div className="settings-index-header">
          <div className="info p-1 d-flex flx-end">
            <Pyr.Form.SubmitButton 
              target={this.target}
            ><Pyr.Icon name="save"/> Save</Pyr.Form.SubmitButton>
          </div>
      </div>
    );
  }


  renderItem(item) {
    console.log(item);
    return (
      <SettingsForm 
        settings={item}
        ref={(node) => this.target = node}
      />
    );
  }
}

class SettingsPage extends Page {
  showActionSheet() {
    return true;
  }

  getAction() {
    console.log("SENDING BCK SHOW_ACTION");
    return SHOW_ACTION;
  }

  loadSelected(unused, onLoading) {
    Pyr.getJSON({
      url: this.props.url,
      context: this,
      loading: onLoading,

    }).done(function(data, textStatus, jaXHR) {
        this.onSelect(data.setting);

    }).fail(function(jaXHR, textStatus, errorThrown) {

      Pyr.ajaxError(jaXHR, textStatus, errorThrown);
    });
  }


  actionSheet(action) {
    console.log("SETTINGS ACTION SHEET");
    return (
      <ShowSheet
        {...this.props}
        items={this.state.items}
        selected={this.state.selected}
        onAction={this.onAction}
        onUnaction={this.onUnaction}
        onLoadSelected={this.onLoadSelected}
      />
    );
    
  }
}

function key(item) {
  return "set-" + item.id;
}
SettingsPage.key = key;

export default SettingsPage;