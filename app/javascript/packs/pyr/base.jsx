import {
  Component as ReactComponent
} from 'react';

class BaseComponent extends ReactComponent {
  initState(inState) {
    this.state = Object.assign({}, this.state, inState);
  }
}

export default BaseComponent;

