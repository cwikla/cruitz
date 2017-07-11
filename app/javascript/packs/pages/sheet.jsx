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
  }

  bindClicks(items, f) {
    this.onClicks = [];
    for(let item of items) {
      this.onClicks.push(f.bind(this, item));
    }
  }

  preSubmit() {
    this.isLoading();
    if (this.props.preSubmit) {
      this.props.preSubmit();
    }
  }

  postSubmit() {
    this.isLoading(false);
    if (this.props.postSubmit) {
      this.props.postSubmit();
    }
  }

}

export default Sheet;
export { ajaxError };
