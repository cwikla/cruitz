
import React, {
  Component
} from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';

import Util from './util';

class Form extends Component {
  static childContextTypes = {
    model: PropTypes.string,
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

  componentWillUnmount() {
    console.log("FORM WILL UNMOUNT");
  }

  getChildContext() {
    return { 
      model: this.props.model,
      object: this.props.object,
      errors: this.state.errors,
    }
  }

  setIsLoading(val=true) {
    console.log("FORM SET ISLOADING: " + val);
    let stuff = { isLoading: val };
    if (val) {
      stuff.errors = null;
    }
    this.setState(stuff);
    console.log("FORM END SET ISLOADING: " + val);
  }

  preSubmit() {
    this.setIsLoading();
    if (this.props.onPreSubmit) {
      this.props.onPreSubmit();
    }
  }

  postSubmit() {
    this.setIsLoading(false);
    if (this.props.onPostSubmit) {
      this.props.onPostSubmit();
    }
  }

  submit(e) {
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

    Util.getJSON({
      type: self.props.method || Util.Method.POST,
      url: self.props.url,
      data: data,
      context: self

    }).always(function() {
      this.postSubmit();

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
    let rest = Util.propsRemove(this.props, ["reset", "onPreSubmit", "onPostSubmit", "model", "object", "url", "onSuccess", "onError"]);

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
    let className = Util.ClassNames("mdb-form-unused form-group");
    if (this.state.errorString) {
      className.push("error");
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
    model: PropTypes.string,
    errorString: PropTypes.string,
    object: PropTypes.object,
  }

  htmlID() {
    return (this.context.model.toLowerCase() + "-" + this.context.name.toLowerCase());
  }

  name() {
    return (this.context.model.toLowerCase() + "[" + this.context.name.toLowerCase() + "]");
  }

  hasError() {
    return !!errorString;
  }

  model() {
    return this.context.model;
  }

  object() {
    return this.context.object;
  }

  defaultValue() {
    if (!this.context.object) {
      return null;
    }
    return this.context.object[this.context.name];
  }

  strValue() {
    let v = this.defaultValue();
    return v ? v.toString() : null;
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
  constructor(props) {
    super(props);
    this.state = {
      value: ""
    };

    this.onTextChange = this.textChange.bind(this);
  }

  componentWillMount() {
    this.setState({
      value: (this.props.value || this.defaultValue() || "")
    });
  }

  setText(value) {
    this.setState({
      value
    });
  }

  textChange(e) {
    this.setText(event.target.value);
  }

  render() {
    let myProps = { 
      name: this.name(), 
      type: "text", 
      id: this.htmlID() ,
      "aria-describedby": this.htmlID(),
      value: this.state.value
    };

    return(
      <input {...myProps} {...Util.propsMergeClassName(this.props, "form-control")} onChange={this.onTextChange}/>
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
  constructor(props) {
    super(props);
    this.state = {
      value: ""
    };

    this.onTextChange = this.textChange.bind(this);
  }

  componentWillMount() {
    this.setState({
      value: (this.props.value || this.defaultValue() || "")
    });
  }

  setText(value) {
    this.setState({
      value
    });
  }

  textChange(e) {
    this.setText(event.target.value);
  }

  render() {
    let myProps = { 
      name: this.name(), 
      id: this.htmlID() ,
      "aria-describedby": this.htmlID(),
      value: this.state.value,
    };
    return(
      <textarea {...myProps} {...Util.propsMergeClassName(this.props, "form-control")} onChange={this.onTextChange}/>
    );
  }
}

class CheckBox extends Child {
  checked() {
    console.log("CHECKED: " + this.defaultValue());
    return this.defaultValue();
  }

  render() {
    let myProps = { 
      name: this.name(), 
      id: this.htmlID() ,
      "aria-describedby": this.htmlID()
    };

    let rest = Util.propsRemove(this.props, ["children"]);

    return(
      <div className="form-checkbox flx-row">
        <input name={this.name()} type="hidden" value={false} />
        <input type="checkbox" {...myProps} {...Util.propsMergeClassName(rest, "f-form-control")} defaultChecked={this.checked()}/>
        <span className="mt-auto mb-auto">{this.props.children}</span>
      </div>
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
  Hidden,
  CheckBox
};

export { 
  PyrForm
};
