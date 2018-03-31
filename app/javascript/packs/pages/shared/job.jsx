
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
  UserAvatar,
  UserScore,
  Stars,
} from '../shared/user';

import {
  MESSAGES_URL,
} from '../const';


class Card extends Component {
  render() {
    let item = this.props.job;
    if (!item) {
      return null;
    }

    let company = item.company || {};
    let logo = company.logo;

    let id = "item-" + item.id;
    let allClass = ClassNames("job-card flx-col");

    if (this.props.selected) {
       allClass.push("selected");
    }
    allClass.push(this.props.className);

    let locations = null;
    if (item.locations) {
      locations = item.locations.map(v => {
        return v.full_name;
      }).join(", ");
    }
    locations = locations || "Unknown";

    let skills = null;
    if (item.skills) {
      skills = item.skills.map(v => {
        return v.name;
      }).join(", ");
    }
    skills = skills || "None";

    let title = item.title || company.name || "No Title";
    let description = item.description || "No Description";
    let category = item.category ? item.category.name : "Other";
    let url = logo ? logo.url : "";
    let companyName = company ? company.name : "Anonymous";
    let createdAt = item.created_at;

    return (
      <div className={allClass}>
        <div className="category flx-row">
          <span className="flx-1">{ category }</span>

          <div className="dropdown">
            <Pyr.UI.Icon name="bars" className="dropdown-toggle" id="dropdownFilterMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" />
            <div className="dropdown-menu" aria-labelledby="dropdownFilterMenuButton">
              <label className="dropdown-header">Filter with same</label>
              <div className="dropdown-divider"></div>
              <label className="dropdown-item" onClick={this.props.onClick}>Company</label>
              <label className="dropdown-item" >Position</label>
              <label className="dropdown-item" >Category</label>
              <label className="dropdown-item" >Location</label>
            </div>
          </div>
        </div>
        <div className="company flx-row">
          <Pyr.UI.Image src={url} className="mr-auto" />
          <div className="flx-1 mr-auto mt-auto mb-auto">{ companyName }</div>
        </div>
        <div className="job">
          { title }
        </div>
        <div className="location">
          { locations }
        </div>
        <div className="age">
          <Pyr.UI.MagicFuzzyDate short date={item.created_at}/>
        </div>
        <div className="more flx-row mt-auto">
          <span className="ml-auto">More...</span>
        </div>
      </div>
    );

  }
}

class Blurb extends Component {
  render() {
    let job = this.props.job;
    if (!job) {
      return null;
    }

    let company = job.company || {};
    let logo = company.logo;

    console.log("BLURB");
    console.log(company);

    let locations = null;
    if (job.locations) {
      locations = job.locations.map(v => {
        return v.full_name;
      }).join(", ");
    }
    locations = locations || "Unknown";

    let skills = null;
    if (job.skills) {
      skills = job.skills.map(v => {
        return v.name;
      }).join(", ");
    }
    skills = skills || "None";

    let title = job.title || company.name || "No Title";
    let description = job.description || "No Description";
    let category = job.category ? job.category.name : "Other";
    let logo_url = logo ? logo.url : "";
    let companyName = company ? company.name : "Anonymous";

    return (
      <div className="header job-blurb flx-col" id={"job-" + job.id}>
        <div className="flx-col">
          <img src={logo_url} className="logo"/>
        </div>

        <div className="flx-col flx-1">
          <div className="flx-row">
            <div className="title flx-1">{ title }</div>
            <div className="created_at"><Pyr.UI.MagicDate dateOnly date={job.created_at}/></div>
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

class Header extends Component {
  render() {
    let job = this.props.job;
    if (!job) {
      return null;
    }

    let company = job.company || {};
    let logo = company.logo;

    let locations = null;
    if (job.locations) {
      locations = job.locations.map(v => {
        return v.full_name;
      }).join(", ");
    }
    locations = locations || "Unknown";

    let skills = null;
    if (job.skills) {
      skills = job.skills.map(v => {
        return v.name;
      }).join(", ");
    }
    skills = skills || "None";

    let title = job.title || company.name || "No Title";
    let description = job.description || "No Description";
    let category = job.category ? job.category.name : "Other";
    let logo_url = logo ? logo.url : "";
    let companyName = company ? company.name : "Anonymous";

    return (
      <div className="job-header job-blurb flx-row">
        <div className="flx-col">
          <img src={logo_url} className="logo"/>
        </div>

        <div className="flx-col flx-1">
          <div className="flx-row">
            <div className="title flx-1">{ title }</div>
            <div className="created_at"><Pyr.UI.MagicDate dateOnly date={job.created_at}/></div>
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

class View extends Component {

  renderContent() {
    let job = this.props.job;
    if (!job) {
      return null;
    }

    let description = job.description || "No Description";
    let createdAt = job.created_at;

    let count = 0;
    return (
      <div className="description flx-1 flx-col">
        <Pyr.UI.Scroll>
          { Pyr.Util.fancyParagraph(description) }
        </Pyr.UI.Scroll>
      </div>
    );
  }

  render() {
    let job = this.props.job;

    let id = "job-" + job.id;
    let allClass = ClassNames("job-view flx-col flx-1");

    if (this.props.selected) {
       allClass.push("selected");
    }

    allClass.push(this.props.className);

    return (
      <div className={allClass} id={id} key={id}>
        <div className="flx-row flx-1">
          <div className="flx-col flx-1">
            <Header {...this.props} job={job}/>
            { this.renderContent() }
          </div>
        </div>
      </div>
    );
  }


}

class Stats extends Component {
  render() {
    let rest = Pyr.Util.propsRemove(this.props, "job");
    let job = this.props.job;

    let views = 22;

    let newCandy = 2;
    let acceptedCandy = 8;
    let rejectedCandy = 2;

    let total = newCandy + acceptedCandy + rejectedCandy;

    return (
      <div {...Pyr.Util.propsMergeClassName(rest, "job-stats flx-col")} >
        <div className="header">Stats</div>
        <div className="guts">
          <div className="views">{views} Views</div>
          <div className="pie">
            <Pyr.UI.PieChart
              slices={[
                { color: 'orange', value: newCandy },
                { color: 'green', value: acceptedCandy },
                { color: 'red', value: rejectedCandy },
              ]}
            />
          </div>

          <div className="total">{total} Candidates</div>
          <div className="new">{newCandy} New</div>
          <div className="accepted">{acceptedCandy} Accepted</div>
          <div className="rejected">{rejectedCandy} Rejected</div>
        </div>
      </div>
    );
  }
}




const Job = {
  Blurb,
  Header,
  Card,
  View,
  Stats,
};

export default Job;
