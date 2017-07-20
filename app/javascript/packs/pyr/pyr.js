
import React, {
  Component
} from 'react';

import { PyrForm as Form, POST, PUT, GET, DELETE } from "./form";
import Util from './util';

const Method = { POST, PUT, GET, DELETE };

function ajaxError(jaXHR, textStatus, errorThrown) {
   alert(errorThrown);
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
  Icon,
  SmallLabel,
  Form, 
  Util,
  Method,
};
export default Pyr;
