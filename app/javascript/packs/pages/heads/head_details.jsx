import React, {
} from 'react';

import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';

import {
  Link,
  Redirect
} from 'react-router-dom';


import Pyr, {
  Component
} from '../../pyr/pyr';
const ClassNames = Pyr.ClassNames;

import CV from '../shared/cv';

class Full extends Component {
  render() {
    return (
      <CV.CV {...this.props} candidate={this.props.head} />
    );
  }
}

class Stats extends Component {
  render() {
    let rest = Pyr.Util.propsRemove(this.props, "head");
    let head = this.props.head;

    let views = 22;

    let acceptedCandy = 8;
    let rejectedCandy = 2;

    let total = acceptedCandy + rejectedCandy;

    return (
      <div {...Pyr.Util.propsMergeClassName(rest, "head-stats flx-col")} >
        <div className="header">Stats</div>
        <div className="guts">
          <div className="views">{views} Views</div>
          <div className="pie">
            <Pyr.UI.PieChart
              className="ml-auto mr-auto"
              slices={[
                { color: 'green', value: acceptedCandy },
                { color: 'red', value: rejectedCandy },
              ]}
            />
          </div>

          <div className="candy ml-auto mr-auto">
            <div className="total">{total} Applications</div>
            <div className="accepted">{acceptedCandy} Accepted</div>
            <div className="rejected">{rejectedCandy} Rejected</div>
          </div>
        </div>
      </div>
    );
  }
}


const HeadDetails = {
  Full,
  Stats,
};

export default HeadDetails;
