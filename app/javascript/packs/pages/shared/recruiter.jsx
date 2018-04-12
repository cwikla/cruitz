
import React, {
} from 'react';

import PropTypes from 'prop-types';

import Pyr, {
  Component
} from '../../pyr/pyr';
const ClassNames = Pyr.ClassNames;

import Page from '../page';
import Sheet from '../sheet';

import Avatar from '../shared/avatar';

import {
  MESSAGES_URL,
} from '../const';


class Card extends Component {
  render() {
    let recruiter = this.props.recruiter;
    if (!recruiter) {
      return null;
    }

    let company = recruiter.company;
    let logo = company.logo;

    let id = "item-" + recruiter.id;
    let allClass = ClassNames("card-item recruiter-card flx-col");

    if (this.props.selected) {
       allClass.push("selected");
    }
    allClass.push(this.props.className);

    let locations = null;
    if (company.locations) {
      locations = company.locations.map(v => {
        return v.full_name;
      }).join(", ");
    }
    locations = locations || "Unknown";


    let description = recruiter.description || "No Description";
    let companyName = company ? company.name : "Anonymous";
    let createdAt = recruiter.created_at;
    let fullName = recruiter.full_name;
    let category = "None";

    let url = recruiter.logo ? recruiter.logo.url : (logo ? logo.url : null);
/*
    console.log("URL");
    console.log(recruiter);
    console.log(logo);
    console.log(url);
*/

    return (
      <div className={allClass}>
        <div className="menu flx-row">
            <Avatar.Avatar
              url={url}
              id={recruiter.id}
            />
            <Avatar.Stars rating={3.7} className="mt-auto mb-auto"/>

            <div className="dropdown ml-auto">
              <Pyr.UI.Icon name="bars" className="dropdown-toggle" id="recCardFilterMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" />
              <div className="dropdown-menu" aria-labelledby="recCardFilterMenuButton">
                <label className="dropdown-header">Filter with same</label>
                <div className="dropdown-divider"></div>
                <label className="dropdown-item" onClick={this.props.onClick}>Company</label>
                <label className="dropdown-item" >Category</label>
                <label className="dropdown-item" >Location</label>
              </div>
            </div>
        </div>
        <div className="card-inner">
          <div className="name flx-row">
              { fullName }
          </div>
          <div className="company flx-row">
              { companyName }
          </div>
        </div>
        <div className="more flx-row mt-auto">
          <span className="ml-auto">More...</span>
        </div>
      </div>
    );

  }
}

///// HERE

class Blurb extends Component {
  render() {
    let recruiter = this.props.recruiter;
    let rest = Pyr.Util.propsRemove(this.props, "recruiter");

    let company = recruiter.company

    let reviews = this.props.reviews;
    let count = reviews ? reviews.length : 0;

    let fullName = recruiter.full_name;
    let companyName = company.name;

    let description = recruiter.description || "";


    let url = recruiter.logo ? recruiter.logo.url : (logo ? logo.url : null);

    return (
      <div {...Pyr.Util.propsMergeClassName(rest, "recruiter-blurb ")} >
        <Pyr.UI.BackgroundImage className="fifty" url={Avatar.getLogo(recruiter.id)}>
          <Pyr.UI.Fifty>
            <div className="rec-blurb-inner">
              <div>
                <div className="icon flx-row flx-start" >
                  <Pyr.UI.IconButton name="flag" className="spam"/>
                  <Pyr.UI.IconButton name="eye" className="ml-auto"/>
                </div>
    
                <Avatar.Avatar
                  userId={recruiter.id}
                  name={recruiter.first_name}
                />
                <Avatar.Stars rating={3.7}/>
                <div className="rate">64% acceptance rate</div>
                <div className="company">{companyName}</div>
                <div className="blurb">{description}</div>
              </div>
            </div>
          </Pyr.UI.Fifty>
        </Pyr.UI.BackgroundImage>
      </div>
    );
  }
}

const FAKE_STARS = 3.7;
const FAKE_RATE = 64;

class Header extends Component {
  render() {
    let rest = Pyr.Util.propsRemove(this.props, ["recruiter", "reviews"]);
    let recruiter = this.props.recruiter;
    let company = recruiter.company;

    let reviews = this.props.reviews;
    let count = reviews ? reviews.length : 0;

    let fullName = recruiter.full_name;
    let companyName = company.name;

    let description = recruiter.description || "";

    return (
      <div {...Pyr.Util.propsMergeClassName(rest, "recruiter-header flx-row")} >
        <div className="flx-col flx-align-center">
          <Avatar.Avatar
            userId={recruiter.id}
          />
        </div>
        <div className="flx-col">
          <div className="name">{fullName}</div>
          <div className="company">{companyName}</div>

          <div className="rate">{FAKE_RATE}% acceptance rate</div>

        </div>
        <div className="flx-col ml-auto">
          <Avatar.Stars rating={FAKE_STARS} />
          <div className="review-count">{count} Reviews</div>
        </div>
        <div className="blurb">{ description }</div>
      </div>
    );
  }
}

const Recruiter = {
  Blurb,
  Header,
  Card,
}

export default Recruiter;
