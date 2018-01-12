import {
  Component as ReactComponent
} from 'react';

class Component extends ReactComponent {
  initState(inState) {
    this.state = Object.assign({}, this.state, inState);
  }
}

export default Component;

