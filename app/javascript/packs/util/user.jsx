import React, {
  Component
} from 'react';

import ReactDOM from 'react-dom';

import Pyr from '../pyr/pyr';

const avatars = ["emilia", "snow", "sophie", "thetick"];

function getAvatar(uid) {
  let pos = uid % avatars.length;
  let av = "/assets/images/thrones/" + avatars[pos] + ".jpeg";
  console.log(av);
  return av;
}

const UserAvatar = (props) => (
  <div className="flx-col user-avatar justify-content-center">
    <div className="align-self-center"><img src="/assets/images/thrones/thetick.jpeg"/></div>
    { props.name ? (<div className="align-self-center">{props.name}</div> ) : null }
  </div>
);

const UserScore = (props) => (
  <div className="user-score justify-content-center flx-col-stretch">
    <div className="align-self-center">{ props.score }</div>
  </div>
);


export {
  UserAvatar,
  UserScore
}
