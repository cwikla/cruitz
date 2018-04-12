
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
  MESSAGES_URL,
} from '../const';

import Avatar, {
} from './avatar';


class SearchBar extends Component {
  render() {
    let rest = Pyr.Util.propsRemove(this.props, "search");
    let search = this.props.search;

    return (
      <div {...Pyr.Util.propsMergeClassName(rest, "search-blurb")} >
        <div className="icon flx-row flx-start">
          <Pyr.UI.IconButton name="flag" className="spam"/>
          <Pyr.UI.IconButton name="eye" className="ml-auto"/>
        </div>

        <Avatar.Avatar
          userId={search.id}
          name={search.first_name}
        />
        <Stars rating={3.7}/>
        <div className="rate">64% acceptance rate</div>
        <div className="company">Awesome Recruiting, Inc</div>
        <div className="location">San Francisco, CA</div>
        <div className="blurb">I specialize in recruiting software engineers
        from top 10 schools.  I have worked with Uber, Twitter,
        BobCo and SallyCo.</div>
      </div>
    );
  }
}

export default SearchBar;
