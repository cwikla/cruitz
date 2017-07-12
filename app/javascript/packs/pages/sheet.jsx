import React, {
  Component
} from 'react';

import Pyr from '../pyr/pyr';

function ajaxError(jaXHR, textStatus, errorThrown) {
   alert(errorThrown);
}

class Sheet extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false
    };

    this.onClicks = [];
    this.onPreSubmit = this.preSubmit.bind(this);
    this.onPostSubmit = this.postSubmit.bind(this);
  }

  bindClicks(items, f) {
    this.onClicks = [];
    for(let item of items) {
      this.onClicks.push(f.bind(this, item));
    }
  }

  preSubmit() {
    this.setState({
      isLoading: true
    });
  }

  postSubmit() {
    this.setState({
      isLoading: false
    });
  }
}

function sheetName(name, action) {
  action = action || "Index";
  let nameAction = Pyr.Util.capFirstLetter(name) + Pyr.Util.capFirstLetter(action) + "Sheet";
  return nameAction;
}


export default Sheet;
export { ajaxError, sheetName };
