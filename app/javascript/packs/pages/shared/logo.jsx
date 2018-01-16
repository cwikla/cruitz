
import React, {
} from 'react';

import {
  Link,
  Redirect,
} from 'react-router-dom';


import Pyr, {
} from '../../pyr/pyr';

import Component from '../component';

const Logo = (props) => (
  <Link to="/home"><Pyr.UI.SmallLabel className="logo nav-item">cruitz</Pyr.UI.SmallLabel></Link>
);

export default Logo;
