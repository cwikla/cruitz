
import React, {
} from 'react';

import {
  Link,
} from 'react-router-dom';

import PropTypes from 'prop-types';

import Pyr, {
  Component
} from '../../pyr/pyr';
const ClassNames = Pyr.ClassNames;

import {
  JOBS_URL,
  MESSAGES_URL,
  POSITIONS_URL,
} from '../const';

class Card extends Component {
  render() {
    let item = this.props.job;
    if (!item) {
      return null;
    }

    let company = this.getCompany(item.company || {});
    let logo = company.logo;

    let id = "jci-" + item.id;
    let allClass = ClassNames("card-item job-card flx-col");

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
    let url = logo ? logo.url : null;
    let companyName = company ? company.name : "Anonymous";
    let createdAt = item.created_at;

    return (
      <div className={allClass}>
        <div className="menu category flx-row">
          <span className="flx-1">{ category }</span>

          <Pyr.UI.MenuToggle title="Filter" name="bars">
              <Pyr.UI.MenuToggleItem onClick={this.props.onClick}>Company</Pyr.UI.MenuToggleItem>
              <Pyr.UI.MenuToggleItem>Position</Pyr.UI.MenuToggleItem>
              <Pyr.UI.MenuToggleItem>Category</Pyr.UI.MenuToggleItem>
              <Pyr.UI.MenuToggleItem>Location</Pyr.UI.MenuToggleItem>
          </Pyr.UI.MenuToggle>
        </div>
        <div className="card-inner">
          <div className="company flx-row">
            { url ? <Pyr.UI.Image src={url} className="mr-auto" /> : null }
            <div className="flx-1 mr-auto mt-auto mb-auto name">{ companyName }</div>
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

    let company = this.getCompany(job.company || {});
    let logo = company.logo;

    //console.log("BLURB");
    //console.log(company);

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
    let logoUrl = logo ? logo.url : null;
    let companyName = company ? company.name : "Anonymous";

    let url = Pyr.URL(POSITIONS_URL).push(job.id);

    return (
      <Link to={url.toString()}>
        <div className="job-blurb flx-col" id={"jbrb-" + job.id}>
          <div className="created_at ml-auto"><Pyr.UI.MagicDate dateOnly date={job.created_at} medium/></div>
          <div className="company flx-row">
            { logoUrl ? <Pyr.UI.Image src={logoUrl} className="logo mr-auto" /> : null }
            <div className="flx-1 mr-auto mt-auto mb-auto name">{ companyName }</div>
          </div>
  
          <div className="flx-col">
            <div className="title mr-auto">{ title }</div>
            <div className="locations mr-auto">{ locations }</div>
            <div className="salary-range mr-auto">$120,000 - $160,000</div>
          </div>
  
          <div className="more flx-row mt-auto">
            <span className="ml-auto">More...</span>
          </div>
        </div>
      </Link>
    );
  }
}

class Header extends Component {
  renderEdit() {
    if (!this.props.edit) {
      return null;
    }

    let url = Pyr.URL(JOBS_URL).push(this.props.job.id).push("edit");

    return (
      <Link to={url.toString()}><div className="edit ml-auto"><Pyr.UI.IconButton name="edit"/></div></Link>
    );
  }

  render() {
    let job = this.props.job;
    if (!job) {
      return null;
    }

    let company = this.getCompany(job.company || {});
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
    let logoUrl = logo ? logo.url : "";
    let companyName = company ? company.name : "Anonymous";

    return (
      <div className="job-header job-blurb flx-row">
        <div className="flx-col">
          <img src={logoUrl} className="logo"/>
        </div>

        <div className="flx-col flx-1">
          <div className="flx-row">
            <div className="title flx-1">{ title }</div>
            <div className="created_at"><Pyr.UI.MagicDate dateOnly date={job.created_at}/></div>
          </div>
          <div className="company">{ companyName }</div>
          <div className="locations">{ locations }</div>

          <div className="flx-row mt-auto">
            <div className="salary-range mr-auto">$120,000 - $160,000</div>
            { this.renderEdit() }
          </div>
        </div>
      </div>
    );
  }
}

class Uploads extends Component {
  render() {
    if (!this.props.uploads || this.props.uploads.length == 0) {
      return (
        <div className="none"></div>
      );
    }
    
    let uploads = this.props.uploads;
    
    return (
      <div id="uploads" className="job-section uploads flx-row">
        { 
          uploads.map( (item, pos) => {
            if (!item.url) {
              return null;
            }
            return (
              <div className="file mt-auto flx-0 flx-nowrap" key={"fi-"+pos}>
                <a href={item.url} download target="_blank">
                  <Pyr.UI.ImageFile url={item.url} contentType={item.content_type}/>
                  <div className="file-name">{item.file_name}</div>
                </a>
              </div>
            );
          })
        }
      </div>
    );
  }
}

class Content extends Component {
  render() {
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

}

class View extends Component {

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
            <Content {...this.props} job={job}/>
            <Uploads {...this.props} job={job} uploads={job.uploads}/>
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
              className="ml-auto mr-auto"
              slices={[
                { color: 'orange', value: newCandy },
                { color: 'green', value: acceptedCandy },
                { color: 'red', value: rejectedCandy },
              ]}
            />
          </div>

          <div className="candy ml-auto mr-auto">
            <div className="total">{total} Candidates</div>
            <div className="new">{newCandy} New</div>
            <div className="accepted">{acceptedCandy} Accepted</div>
            <div className="rejected">{rejectedCandy} Rejected</div>
          </div>
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
