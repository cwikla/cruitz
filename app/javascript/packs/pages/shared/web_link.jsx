import React from 'react';
import PropTypes from 'prop-types';

import {
  Link,
} from 'react-router-dom';

import Pyr, {
  Component
} from '../../pyr/pyr';

const ClassNames = Pyr.ClassNames;

const WEB_LINK_WEB = 0;
const WEB_LINK_IN = 1;
const WEB_LINK_GITHUB = 2;
const WEB_LINK_DRIBBBLE = 3;
const WEB_LINK_QUORA = 4;
const WEB_LINK_FACEBOOK = 5;
const WEB_LINK_TWITTER = 6;
const WEB_LINK_ANGELIST = 7;

const WEB_LINK_TO = {
  [WEB_LINK_IN] : "linkedin-in",
  [WEB_LINK_GITHUB] : "github",
  [WEB_LINK_DRIBBBLE] : "dribbble",
  [WEB_LINK_QUORA] : "quora",
  [WEB_LINK_FACEBOOK] : "facebook-f",
  [WEB_LINK_TWITTER] : "twitter",
  [WEB_LINK_ANGELIST] : "angellist",
};


const Font = (props) => (
  <a href={props.webLink.url} target="_cruitz"><Pyr.UI.Icon brand={!!WEB_LINK_TO[props.webLink.ltype]} name={WEB_LINK_TO[props.webLink.ltype] ? WEB_LINK_TO[props.webLink.ltype] : "link"} /></a>
);

const Lock = (props) => (
  <Pyr.UI.Icon brand={!!WEB_LINK_TO[props.webLink.ltype]}  name={WEB_LINK_TO[props.webLink.ltype] ? WEB_LINK_TO[props.webLink.ltype] : "link"} className="locked"/>
);

class Links extends Component {
  render() {
    if (!this.props.links) {
      return null;
    }

    let webLinks = this.props.links;
    if (!webLinks) {
      return null;
    }

    let locked = this.props.locked;

    let WebLinkComp = locked ? Lock : Font;

    return (
      <div id="web-links" className="cv-section web-links flx-row">
        {
          webLinks.map( (item, pos) => {
            return (<div className="web-link flx-0 flx-nowrap" key={"web-lnk"+item.id}><WebLinkComp key={"web-lnk2"+item.id}webLink={item} /></div>);
          })
        }
      </div>
    );
  }
}

const WebLink = {
  Font,
  Lock,
  Links,
};

export default WebLink;

