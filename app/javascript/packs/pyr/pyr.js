
import React, {
  Component
} from 'react';

import { PyrForm as Form } from "./form";
import Util from './util';

const POST = 'POST';
const PUT = 'PUT';
const GET = 'GET';
const DELETE = 'DELETE';

const Method = { POST, PUT, GET, DELETE };

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
  Icon,
  SmallLabel,
  Form, 
  Util,
  Method,
};
export default Pyr;
