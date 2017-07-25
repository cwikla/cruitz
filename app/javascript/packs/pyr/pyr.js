
import React, {
  Component as ReactComponent
} from 'react';

import { 
  PyrForm as Form, 
  POST, 
  PUT, 
  GET, 
  DELETE 
} from "./form";

import Util from './util';

const Method = { 
  POST, 
  PUT, 
  GET, 
  DELETE 
};

function ajaxError(jaXHR, textStatus, errorThrown) {
   alert(errorThrown);
}

class Component extends ReactComponent {
  getInitState(props) {
  }

  constructor(props) {
    super(props);

    this.state = this.getInitState(props);
  }
}

class Icon extends Component {
  render() {
    let name = "fa fa-" + this.props.name;
    return (
      <i {...Util.propsMergeClassName(this.props, name)}/>
    );
  }
}

const SmallLabel = (props) => (
  <label {...Util.propsMergeClassName(props, "hidden-sm-down")}>{props.children}</label>
);

const Pyr = { 
  ajaxError,
  Component,
  Icon,
  SmallLabel,
  Form, 
  Util,
  Method,
};
export default Pyr;
