
import React, {
} from 'react';

import Pyr from '../pyr/pyr';

class Component extends Pyr.Network.Component {
  static contextTypes = Object.assign({}, Pyr.UserContextTypes, Pyr.UI.NoticeContextTypes, Pyr.UI.RouterContextTypes);

 initState(inState) {
    this.state = Object.assign({}, this.state, inState);
  }

  user() {
    return this.context.user;
  }

  setCompany(company) {
    this.context.setCompany(company);
  }

  setUser(user) {
    this.context.setUser(user);
  }

  goBack() {
    return this.context.history.goBack();
  }

  setNotice(notice) {
    this.context.setNotice(notice);
  }
}

export default Component;
