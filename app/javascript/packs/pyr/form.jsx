
import React, {
  Component
} from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';

import Util from './util';
import UI from './ui';

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
    //console.log("FORM WILL UNMOUNT");
  }

  getChildContext() {
    return { 
      model: this.props.model,
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

  static async fileRequest(fileName) {
    let query = {
      url : Util.PURL("/post_url"),
      data : { "s3[name]" : fileName },
    };

    console.log("QUERY");
    console.log(query);

    let result = await Util.getJSON(query);

    Util.getJSON({
      method: Util.Method.PUT,
      url: result['url'],
      data: new FileReader(new File(fileName))

    }).done(function(retData, textState, jqXHR) {
      console.log("SUCCESS FOR " + fileName);

    }).fail(function(retData, textState, errorThrown) {
      self.ajaxError(jqXHR, textStatus, errorThrown);
    });

    return json;
  }

  uploadFiles($form) {
    console.log("CHECKING KIDS");
    console.log($form);

    $($form).find('[data-pyr-file]').each(function(f) {
      let $me = $(this);
      let value = $me.val();
      let result = Form.fileRequest(value);
      console.log(result);
    });
    console.log("CHECKING KIDS END");
  }

  submit(e) {
    if (e) {
      e.preventDefault();
    }

    if (this.state.isLoading) {
      return;
    }

    let $item = $(this.form);

    //this.uploadFiles($item);


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

    }).done(function(retData, textStatus, jqXHR) {
      if (self.props.reset) {
        //$("#" + $(self.form).attr("id")).trigger("reset");
        $(this.form).trigger("reset");
        //console.log("TRIGGER");
      }
    }).done(function(retData, textStatus, jqXHR) {
      self.ajaxSuccess(retData, textStatus, jqXHR);

    }).fail(function(jqXHR, textStatus, errorThrown) {
      self.ajaxError(jqXHR, textStatus, errorThrown);


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

  error() {
    if (!this.state.errorString) {
      return null;
    }
  
    return (
      <div className="errorString"><label className="error">{this.props.name} {this.state.errorString}</label></div>
    );
  }

  render() { 
    let className = Util.ClassNames("mdb-form-unused form-group");
    if (this.state.errorString) {
      className.push("error");
    }

    return (
      <div {...Util.propsMergeClassName(this.props,className)}>
        {this.props.children}
        { this.error() }
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

  modelValue() {
    if (!this.context.object) {
      return null;
    }
    return this.context.object[this.context.name];
  }

  strValue() {
    let v = this.modelValue();
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
    this.onKeyUp = this.keyUp.bind(this);
  }

  componentWillMount() {
    let value = this.props.value || this.modelValue() || "";
    this.setState({
      value
    });
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (nextProps.value) {
      console.log("Setting value to: " + nextProps.value);
      this.setState({
        value: nextProps.value
      });
    }
  }


  keyUp(e) {
    if ((e.keyCode == 13) && this.props.onSubmit) {
      e.preventDefault();
      this.props.onSubmit(e);
      return;
    }

    if (this.props.onKeyUp) {
      this.props.onKeyUp(e);
    }
  }

  setText(value) {
    this.setState({
      value
    });
  }

  textChange(e) {
    if ((e.keyCode == 13) && (this.props.onSubmit)) {
      console.log(e);
      this.submit(e);
      return;
    }

    this.setText(e.target.value || "");
  }

  render() {
    let myProps = { 
      name: this.name(), 
      type: "text", 
      id: this.htmlID() ,
      "aria-describedby": this.htmlID(),
    };
    if (!this.props.unmanaged) {
      myProps.value = this.state.value;
    }

    let rest = Util.propsRemove(this.props, ["value", "onChange", "onKeyUp", "autoClear", "unmanaged"]);

    return(
      <input type="text" {...myProps} {...Util.propsMergeClassName(rest, "form-control")} onChange={this.onTextChange} onKeyUp={this.onKeyUp}/>
    );
  }
}

class PasswordField extends TextField {
  render() {
    let myProps = { 
      name: this.name(), 
      type: "password", 
      id: this.htmlID() ,
      "aria-describedby": this.htmlID(),
    };
    if (!this.props.unmanaged) {
      myProps.value = this.state.value;
    }

    let rest = Util.propsRemove(this.props, ["value", "onChange", "onKeyUp", "autoClear", "unmanaged"]);

    return(
      <input {...myProps} {...Util.propsMergeClassName(rest, "form-control")} onChange={this.onTextChange} onKeyUp={this.onKeyUp}/>
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
      value: (this.props.value || this.modelValue() || "")
    });
  }

  setText(value) {
    this.setState({
      value
    });
  }

  textChange(e) {
    this.setText(e.target.value || "");
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
  constructor(props) {
    super(props);
    this.state = {
      checked: false
    };

    this.onChange = this.change.bind(this);
  }

  componentWillMount() {
    this.setState({
      checked: (this.props.checked || this.modelChecked() || false)
    });
  }

  setChecked(checked) {
    checked = checked ? true : false;
    this.setState({
      checked
    });
  }

  change(e) {
    this.setChecked(e.target.checked);
    this.props.onChange(e);
  }

  modelChecked() {
    return this.modelValue() ? true : false;
  }

  render() {
    let myProps = { 
      name: this.name(), 
      id: this.htmlID() ,
      "aria-describedby": this.htmlID(),
      checked: this.state.checked,
    };

    let rest = Util.propsRemove(this.props, ["children", "onChange"]);

    return(
      <div className="form-checkbox flx-row">
        <input name={this.name()} type="hidden" value={false} />
        <input type="checkbox" {...myProps} {...Util.propsMergeClassName(rest, "form-control")} onChange={this.onChange}/>
        <span className="mt-auto mb-auto">{this.props.children}</span>
      </div>
    );
  }
}

class FileSelector extends Child {
  constructor(props) {
    super(props);
    this.state = {
      files: null,
      dragging: false,
    };

    this.onDragEnter = this.dragging.bind(this, true);
    this.onDragLeave = this.dragging.bind(this, false);
    this.onDragOver = this.dragOver.bind(this);

    this.onDrop = this.drop.bind(this);

    this.onChange = this.change.bind(this);
    this.onClick = this.click.bind(this);
  }

  componentWillMount() {
    this.setState({
      files: null,
      dragging: false,
    });
  }

  //https://stackoverflow.com/questions/21339924/drop-event-not-firing-in-chrome

  dragOver(e) {
    e.preventDefault();
  }

  dragging(dragging, e) {
    this.setState({
      dragging
    });
    console.log("DRAGGING: " + dragging);
  }

  drop(e) {
    console.log("DROPPED");
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }

    let files = e.dataTransfer.files;

    this.setFiles(files);
  }

  change(e) {
    if (!e.target.value) {
      return;
    }

    let files = e.target.files;

    this.setFiles(files);
  }

  setFiles(files) {
    this.setState({
      files,
      dragging: false,
    });

    if (files) {
      Util.s3Upload(files);
    }
  }

  click(e) {
    return this.fileInput.click();
  }

  renderHiddens() {
    if (!this.state.files) {
      return null;
    }

    console.log(this.state.files);

    let hiddens = Array.from(this.state.files).map((file, pos) => {
      return (
        <input key={file.name} name={this.name()} type="hidden" value={file.name} data-pyr-file/>
      );
    });

    return (
      <div id={this.name()+"-files-to-upload"}>
        { hiddens }
      </div>
    );

  }

  renderImage() {
    if (!this.state.files) {
      return null;
    }

    let afile = this.state.files[0];

    return (
      <UI.ImageFile file={afile} {...this.props.image} />
    );
  }

  renderFileInput() {
    if (this.props.noInput) {
      return null;
    }

    let afile = this.state.files ? this.state.files[0]: "";

    return (
        <input ref={node => this.fileInput = node} type="file" {...this.props.input} onChange={this.onChange} />
    );
  }

  render() {
    let clz = Util.ClassNames("form-control form-file-selector", (this.state.dragging ? "dragging" : null));

    if (this.state.files) {
      clz.push("value");
    }

    return(
      <div id={this.htmlID()}
        {...Util.propsMergeClassName(this.props, clz)}
        onDragEnter={this.onDragEnter}
        onDragLeave={this.onDragLeave}
        onDragOver={this.onDragOver}
        onDrop={this.onDrop}
        onClick={this.onClick}
      >
        { this.renderHiddens() }
        { this.renderImage() }
        { this.renderFileInput() }
        { this.props.children }
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
  PasswordField, 
  Select, 
  Option, 
  TextArea, 
  SubmitButton, 
  Hidden,
  CheckBox,
  FileSelector
};

export { 
  PyrForm
};
