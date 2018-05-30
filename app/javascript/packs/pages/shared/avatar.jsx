import React, {
} from 'react';

import Pyr, {
  Component
} from '../../pyr/pyr';

const logos = ["/Dropbox-Logo-High-Res_1.jpg",
              "google-logo-1200x630.jpg",
              "github-512.png",
              "slack-logo-vector-download.jpg",
              "Chase_logo_2007.svg.png",
              ];

const avatars = ["emilia", "snow", "sophie", "thetick"];

function unused_getLogo(uid) {
  let pos = Math.abs(Pyr.Util.hash(uid)) % logos.length;
  let av = "/assets/images/" + logos[pos];
  return av;
}

function unused_getAvatar(uid) {
  let pos = Math.abs(Pyr.Util.hash(uid)) % avatars.length;
  let av = "/assets/images/thrones/" + avatars[pos] + ".jpeg";
  return av;
}

class Stars extends Component {
  renderHalf(half, pos) {
    if (!half) {
      return null;
    }

    return (
      <Pyr.UI.Icon name="star-half" key={"star"+pos} className={Pyr.ClassNames("star")}/>
    );
  }
  render() {
    let half = (this.props.rating * 10 % 10) > 0;
    let rating = Math.floor(this.props.rating);

    return (
      <div className={Pyr.ClassNames("rating").push(this.props.className)}>
        { Pyr.Util.times(rating, (i) => {
              return (<Pyr.UI.Icon name="star" key={"star"+i} className={Pyr.ClassNames("star")}/>);
          })
        }
        {
          this.renderHalf(half, rating+1)
        }
      </div>
    );
  }
}

const Label = (props) => (
  <div
    className="nav-item"
    id="user"
    onClick={props.onClick}
  ><Pyr.UI.Icon name="user" className="fa-fw" /><Pyr.UI.Icon id="arrow" name="arrow-down" className="fa-fw"/></div>
);

const Simple = (props) => (
  <div className={Pyr.ClassNames("flx-col avatar user-avatar justify-content-center").push(props.small ? "small" : "").push(props.className)}>
    <div className="align-self-center">{ props.logo ? <img src={props.logo.url}/> : <Pyr.UI.Icon name="user"/> }</div>
    { props.name ? (<div className="align-self-center">{props.name}</div> ) : null }
  </div>
);

const Score = (props) => (
  <div className={Pyr.ClassNames("user-score").push(props.className)}>
    <Pyr.UI.Icon name="bullseye" />&nbsp;{ Pyr.Util.firstKid(props.children) }
  </div>
);

class UserAvatar extends Component {
  render() {
    let logo = this.props.user.logo || (this.props.userOnly ? null : this.props.user.company.logo);
    return (
      <Simple {...this.props} logo={logo} name={!this.props.imageOnly ? this.props.user.first_name : null}/>
    );
  }
}



const Avatar = {
  Label,
  Avatar: UserAvatar,
  Simple,
  Score,
  Stars,
}

export default Avatar;
