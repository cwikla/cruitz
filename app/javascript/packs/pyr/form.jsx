
import React, {
  Component
} from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';

const POST = 'POST';
const PUT = 'PUT';
const GET = 'GET';
const DELETE = 'DELETE';

import Util from './util';

class Form extends Component {
  static childContextTypes = {
    controller: PropTypes.string,
    errors: PropTypes.object,
    object: PropTypes.object,
  }

  constructor(props) {
    super(props);

    //alert("FORM " + props.object.id);

    this.state = {
      isLoading: false,
      errors: null,
    };

    this.onSubmit = this.submitHandler.bind(this);
  }

  getChildContext() {
    return { 
      controller: this.props.controller,
      object: this.props.object,
      errors: this.state.errors,
    }
  }

  setIsLoading(val=true) {
    let stuff = { isLoading: val };
    if (val) {
      stuff.errors = null;
    }
    this.setState(stuff);
  }

  preSubmit() {
    if (this.props.onPreSubmit) {
      this.props.onPreSubmit();
    }
    this.setIsLoading();
  }

  postSubmit() {
    if (this.props.onPostSubmit) {
      this.props.onPostSubmit();
    }
    this.setIsLoading(false);
  }

  submit(e) {
    //alert("submit");
    if (e) {
      e.preventDefault();
    }

    if (this.state.isLoading) {
      return;
    }

    let $item = $(this.form);
    let data = $item.serialize();

    this.preSubmit();
    this.innerSubmit(data);
  }

  innerSubmit(data) {
    var self = this;

    $.getJSON({
      type: self.props.method || POST,
      url: self.props.url,
      data: data,
      context: self

    }).done(function(retData, textStatus, jaXHR) {
      if (self.props.reset) {
        //$("#" + $(self.form).attr("id")).trigger("reset");
        $(this.form).trigger("reset");
        //console.log("TRIGGER");
      }
    }).done(function(retData, textStatus, jaXHR) {
      self.ajaxSuccess(retData, textStatus, jaXHR);

    }).fail(function(jaXHR, textStatus, errorThrown) {
      self.ajaxError(jaXHR, textStatus, errorThrown);

    }).always(function() {
      this.postSubmit();

    });
  }

  ajaxSuccess(data, textStatus, jqXHR) {
    if (this.props.onSuccess) {
      this.props.onSuccess(data, textStatus, jqXHR);
    }
    else {
      this.defaultSuccessHandler(data, textStatus, jqXHR);
    }
  }

  defaultSuccessHandler(data, textStatus, jqXHR) {
    // nothing to see here!
  }

  ajaxError(jqXHR, textStatus, errorThrown) {

    var data;

    if(jqXHR.responseText) {
        try {
          data = $.parseJSON(jqXHR.responseText);
        } catch (err) {}
    }

    if (this.props.onError) {
      this.props.onError(data, jqXHR.status, jqXHR);
    }
    else {
      this.defaultErrorHandler(data, jqXHR.status, jqXHR);
    }

  }

  defaultErrorHandler(data, status, jqXHR) {
    //alert(status);
    //alert(JSON.stringify(data.errors));

    if (data) {
      if (status == 409 && data.errors.stale_object) { // 409 == Conflict 
        if (this.props.onStaleObject) {
          this.props.onStaleObject(this, data, jqXHR);
        }
        else {
          this.defaultStaleObjectHandler();
        }
      } else if (data.errors) {
        this.setState({errors: data.errors});
      }
    }
  }

  defaultStaleObjectHandler() {
    alert('This record is stale. Please refresh before making your updates');
  }

  submitHandler(e) {
    //alert("submit handler");
    if (e) {
      e.preventDefault();
    }
    this.submit(e);
  }

  render() {
    let rest = Util.propsRemove(this.props, ["reset", "onPreSubmit", "onPostSubmit", "controller", "object", "url", "onSuccess", "onError"]);

    return (
      <form ref={(node) => {this.form = node;}} 
        {...rest}
        onSubmit={this.onSubmit}
      >
        {this.props.children}
      </form>
    );
  }
}

class Group extends Component {
  static childContextTypes = {
    name: PropTypes.string,
    errorString: PropTypes.string
  }

  static contextTypes = {
    errors: PropTypes.object
  };

  constructor(props) {
    super(props);
    //alert("PFG");

    this.state = {
      errorString: null
    };
      
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (nextContext.errors) {
      let result = nextContext.errors[this.props.name];
      if (result) {
        this.setState({errorString: result[0]}); // HMMM
      }
    }
  }

  getChildContext() {
    return {
      name: this.props.name,
      errorString: this.state.errorString
    };
  }

  render() { 
    let className = "form-group";
    if (this.state.errorString) {
      className += " error";
    }

    return (
      <div {...Util.propsMergeClassName(this.props,className)}>
        {this.props.children}
      </div>
    );
  }
}

class Child extends Component {
  static contextTypes = {
    name: PropTypes.string,
    controller: PropTypes.string,
    errorString: PropTypes.string,
    object: PropTypes.object,
  }

  htmlID() {
    return (this.context.controller.toLowerCase() + "-" + this.context.name.toLowerCase());
  }

  name() {
    return (this.context.controller.toLowerCase() + "[" + this.context.name.toLowerCase() + "]");
  }

  hasError() {
    return false;
  }
}



class SubmitButton extends Component {
  constructor(props) {
    super(props);
    this.onClick = this.onClickHandler.bind(this);
  }
 
  onClickHandler(e) {
    //alert("CLICK");
    if (this.props.target) {
      if (e) {
        e.preventDefault();
      }
      //alert(this.props.target.form.constructor.name);
      this.props.target.form.submit();
    }
  }

  render() {
    return (
      <a href="#" 
        ref={(node) => this.button = node}
        className="btn btn-primary" 
        onClick={this.onClick}>{this.props.children}
      </a>
    );
  }
}

class Label extends Child {
  render() {
    let myProps = {
      htmlFor: this.htmlID()
    };
    //alert(this.props.children);
    return(
      <label {...myProps} {...Util.propsMergeClassName(this.props,"form-label")}>{this.props.children}</label>
    );
  }
}

class TextField extends Child {
  render() {
    let myProps = { 
      name: this.name(), 
      type: "text", 
      id: this.htmlID() ,
      "aria-describedby": this.htmlID()
    };

    return(
      <input {...myProps} {...Util.propsMergeClassName(this.props, "form-control")} />
    );
  }
}

class Select extends Child {
  render() {
    let myProps = { 
      name: this.name(), 
      id: this.htmlID() ,
      "aria-describedby": this.htmlID()
    };
    return(
      <select {...myProps} {...Util.propsMergeClassName(this.props, "form-control")} />
    );
  }
}

class Option extends Child {
  render() {
    return(
      <option {...Util.propsMergeClassName(this.props, "form-control")}>{this.props.children}</option>
    );
  }
}

class Hidden extends Child {
  render() {
    let myProps = { 
      name: this.name(), 
      id: this.htmlID() ,
      "aria-describedby": this.htmlID()
    };

    return(
      <input type="hidden" {...myProps} {...Util.propsMergeClassName(this.props, "form-control")} />
    );
  }
}

class TextArea extends Child {
  render() {
    let myProps = { 
      name: this.name(), 
      id: this.htmlID() ,
      "aria-describedby": this.htmlID()
    };
    return(
      <textarea {...myProps} {...Util.propsMergeClassName(this.props, "form-control")} />
    );
  }
}

const PyrForm = { 
  Form, 
  Group, 
  Child, 
  Label, 
  TextField, 
  Select, 
  Option, 
  TextArea, 
  SubmitButton, 
  Hidden 
};

export { 
  PyrForm, 
  POST, 
  GET, 
  PUT, 
  DELETE 
};
