
import React, {
  Component
} from 'react';
import PropTypes from 'prop-types';

import { 
  PyrForm as Form, 
  POST, 
  PUT, 
  GET, 
  DELETE 
} from "./form";

import Util from './util';
import Grid from './grid';

const Method = { 
  POST, 
  PUT, 
  GET, 
  DELETE 
};

const USERS_URL = "/users";

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

class SmallLabel extends Component {
  render() {
    return (<label {...Util.propsMergeClassName(this.props, "hidden-sm-down")}>{this.props.children}</label>);
  }
}

class UserComponent extends Component {
  static contextTypes = {
    user: PropTypes.object
  }

  userChange(user) {
    // nothing to see here
  }

  componentDidUpdate(prevProps, prevState, prevContext) {
    if (prevContext.user && this.context.user) {
      this.userChange(this.context.user);
    }
  }
}

class UserProvider extends Component {
  static childContextTypes = {
    user: PropTypes.object
  };

  getChildContext() {
    return {
      user: this.state.user,
    }
  }

  constructor(props) {
    super(props);
    this.state =  {
      user: null
    };
  }

  componentDidMount() {
    this.getSelf();
  }

  getSelf() {
    let self = this;

    $.getJSON({
      type: Pyr.Method.GET,
      url: USERS_URL + "/me",
      context: this
    }).done(function(data, textStatus, jaXHR) {
      self.setState({
        user: data.user
      });
    }).fail(function(jaXHR, textStatus, errorThrown) {
      Pyr.ajaxError(jaXHR, textStatus, errorThrown);
    });
  }

  render() {
    return this.props.children;
  }
}

const Pyr = { 
  ajaxError,
  Grid,
  UserProvider,
  UserComponent,
  Icon,
  SmallLabel,
  Form, 
  Util,
  Method,
};
export default Pyr;
