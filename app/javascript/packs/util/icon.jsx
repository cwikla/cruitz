import React, {
  Component
} from 'react';

import ReactDOM from 'react-dom';

import Pyr from '../pyr/pyr';

const icons = ["emilia", "snow", "sophie", "thetick"];

function getIcon(uid) {
  let pos = uid % icons.length;
  return "/assets/images/thrones/" + icons[pos] + ".jpeg";
}

const UserIcon = (props) => (
  <div className="flx-col user-icon justify-content-center red">
    <div className="align-self-center blue"><img src={getIcon(props.userId)}/></div>
    <div className="align-self-center yellow">{props.name}</div>
  </div>
);


export default UserIcon;
