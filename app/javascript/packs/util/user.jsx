import React, {
  Component
} from 'react';

import ReactDOM from 'react-dom';

import Pyr from '../pyr/pyr';

const avatars = ["emilia", "snow", "sophie", "thetick"];

function getAvatar(uid) {
  let pos = uid % avatars.length;
  return "/assets/images/thrones/" + avatars[pos] + ".jpeg";
}

const UserAvatar = (props) => (
  <div className="flx-col user-avatar justify-content-center">
    <div className="align-self-center"><img src={getAvatar(props.userId)}/></div>
    { props.name ? (<div className="align-self-center">{props.name}</div> ) : null }
  </div>
);

const UserScore = (props) => (
  <div className="col-stretch flx-col user-score justify-content-center">
    <div className="align-self-center">{ props.score }</div>
  </div>
);


export {
  UserAvatar,
  UserScore
}
