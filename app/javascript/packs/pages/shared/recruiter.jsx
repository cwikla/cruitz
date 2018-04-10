
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
  getLogo,
} from '../shared/user';

import {
  MESSAGES_URL,
} from '../const';


class Blurb extends Component {
  render() {
    let recruiter = this.props.recruiter;
    let rest = Pyr.Util.propsRemove(this.props, "recruiter");

    let inlineStyle = {
      backgroundImage: "url(" + getLogo(recruiter.id) + ")",
      backgroundRepeat: "no-repeat",
      backgroundAttachment: "local",
      backgroundPosition: "center",
      backgroundSize: "contain",
    };

 //   console.log(inlineStyle);


    return (
      <div {...Pyr.Util.propsMergeClassName(rest, "recruiter-blurb ")} style={inlineStyle}>
        <div className="rec-blurb-inner fifty">
          <div>
          <div className="icon flx-row flx-start" >
            <Pyr.UI.IconButton name="flag" className="spam"/>
            <Pyr.UI.IconButton name="eye" className="ml-auto"/>
          </div>

          <UserAvatar
            userId={recruiter.id}
            name={recruiter.first_name}
          />
          <Stars rating={3.7}/>
          <div className="rate">64% acceptance rate</div>
          <div className="company">Awesome Recruiting, Inc</div>
          <div className="location">San Francisco, CA</div>
          <div className="blurb">I specialize in recruiting software engineers
          from top 10 schools.  I have worked with Uber, Twitter,
          BobCo and SallyCo.</div>
          </div>
        </div>
      </div>
    );
  }
}

class Header extends Component {
  render() {
    let rest = Pyr.Util.propsRemove(this.props, "recruiter");
    let recruiter = this.props.recruiter;

    return (
      <div {...Pyr.Util.propsMergeClassName(rest, "recruiter-header flx-row")} >
        <div className="flx-col flx-align-center">
          <UserAvatar
            userId={recruiter.id}
            name={recruiter.first_name}
          />
          <Stars rating={3.7}/>
        </div>
        <div className="flx-col">
          <div className="rate">64% acceptance rate</div>
          <div className="company">Awesome Recruiting, Inc</div>
          <div className="location">San Francisco, CA</div>
          <div className="blurb">I specialize in recruiting software engineers
          from top 10 schools.  I have worked with Uber, Twitter,
          BobCo and SallyCo.</div>
        </div>
      </div>
    );
  }
}

const Recruiter = {
  Blurb,
  Header,
}

export default Recruiter;
