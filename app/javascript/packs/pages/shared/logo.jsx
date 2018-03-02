
import React, {
} from 'react';

import {
  Link,
  Redirect,
} from 'react-router-dom';


import Pyr, {
  Component
} from '../../pyr/pyr';

const Logo = (props) => (
  <Link to="/home" replace><Pyr.UI.SmallLabel className="logo nav-item">cruitz</Pyr.UI.SmallLabel></Link>
);

export default Logo;
