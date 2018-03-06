import React, { 
} from 'react';

import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';


import Pyr, {
  Component
} from '../../pyr/pyr';
const ClassNames = Pyr.ClassNames;

class Blurb extends Component {
  render() {
    let position = this.props.position;
    if (!position) {
      return null;
    }

    let company = position.company || {};
    let logo = company.logo;

    let locations = null;
    if (position.locations) {
      locations = position.locations.map(v => {
        return v.full_name;
      }).join(", ");
    }
    locations = locations || "Unknown";

    let skills = null;
    if (position.skills) {
      skills = position.skills.map(v => {
        return v.name;
      }).join(", ");
    }
    skills = skills || "None";

    let title = position.title || company.name || "No Title";
    let description = position.description || "No Description";
    let category = position.category ? position.category.name : "Other";
    let logo_url = logo ? logo.url : "";
    let companyName = company ? company.name : "Anonymous";

    return (
      <div className="header blurb flx-row">
        <div className="flx-col">
          <img src={logo_url} className="logo"/>
        </div>

        <div className="flx-col flx-1">
          <div className="flx-row">
            <div className="title flx-1">{ title }</div>
            <div className="created_at"><Pyr.UI.MagicDate dateOnly date={position.created_at}/></div>
          </div>
          <div className="company">{ companyName }</div>
          <div className="locations">{ locations }</div>

          <div className="flx-row mt-auto">
            <div className="salary-range">$120,000 - $160,000</div>
          </div>
        </div>
      </div>
    );
  }
}
export default Blurb;
