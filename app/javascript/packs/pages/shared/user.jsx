import React, {
  Component
} from 'react';

import ReactDOM from 'react-dom';

import Pyr from '../../pyr/pyr';

const logos = ["/Dropbox-Logo-High-Res_1.jpg",
              "google-logo-1200x630.jpg",
              "github-512.png",
              "slack-logo-vector-download.jpg",
              "Chase_logo_2007.svg.png",
              ];

const avatars = ["emilia", "snow", "sophie", "thetick"];

function getLogo(uid) {
  let pos = Math.abs(Pyr.Util.hash(uid)) % logos.length;
  let av = "/assets/images/" + logos[pos];
  return av;
}

function getAvatar(uid) {
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
      <Pyr.UI.Icon name="star-half" key={"star"+pos} className="star"/>
    );
  }
  render() {
    let half = (this.props.rating * 10 % 10) > 0;
    let rating = Math.floor(this.props.rating);

    return (
      <div className="rating">
        { Pyr.Util.times(rating, (i) => {
              return (<Pyr.UI.Icon name="star" key={"star"+i} className="star"/>);
          })
        }
        {
          this.renderHalf(half, rating+1)
        }
      </div>
    );
  }
}

const UserAvatar = (props) => (
  <div className={Pyr.ClassNames("flx-col user-avatar justify-content-center").push(props.small ? "small" : "").push(props.className)}>
    <div className="align-self-center"><img src={getAvatar(props.userId)}/></div>
    { props.name ? (<div className="align-self-center">{props.name}</div> ) : null }
  </div>
);

const UserScore = (props) => (
  <div className={Pyr.ClassNames("user-score justify-content-center flx-col-stretch").push(props.className)}>
    <div className="align-self-center">{ Pyr.Util.firstKid(props.children) }</div>
  </div>
);


export {
  UserAvatar,
  UserScore,
  Stars,
  getLogo,
  getAvatar
}
