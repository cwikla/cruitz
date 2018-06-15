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

const ClassNames = Pyr.ClassNames;

import Page from '../page';
import Sheet from '../sheet';
import {
  MESSAGES_URL,
  CANDIDATES_URL,
  JOBS_URL,
} from '../const';


const Stat = (props) => (
  <div className={ClassNames("flx-col stat").push(props.name.toLowerCase() + "-stat")}>
    <div className="count ml-auto mr-auto flx-col flx-1">
      <div className=" ">{ props.count }</div>
    </div>
    <div className="label mt-auto mb-auto">
      { props.title }
    </div>
  </div>
);

class ShowSheet extends Sheet.Show {
  render() {
    let stats = this.user().stats;

    return (
      <div className="main-stats">
        <div className="flx-row flx-wrap">
          <Stat name="hires" count={ stats.hires_count } title="Hires"/>
          <Stat name="offers" count={ stats.offers_count } title="Open Offers" />
          <Stat name="new-candidates" count={ stats.candidates_count } title="New Candidates" />
        </div>
        <div className="flx-row flx-wrap">
          <Stat name="open-jobs" count={ stats.jobs_count } title="Open Jobs"/>
          <Stat name="recruiters" count={ stats.recruiters_count } title="Recruiters"/>
        </div>
      </div>
    );
  }
}

class MainPage extends Page {
  name() {
    return "Main";
  }

  getItems() {
    return null;
  }

  getItemsMap() {
    return null;
  }

  showActionSheet() {
    return true;
  }

  getSelected() {
    return this.user();
  }

  getActionSheet(action) {
    return ShowSheet;
  }
}

function key(item) {
  return "main-" + item.id;
}
MainPage.key = key;

export default MainPage;
