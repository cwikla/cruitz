
import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';

import BaseComponent from './base';
import Util from './util';
import Network from './network';
import UI from './ui';
import Attachment from './attachment';
import ReactSelect from 'react-select';

import {
  Typeahead,
  AsyncTypeahead,
} from 'react-bootstrap-typeahead';

import InputRange from 'react-input-range';

function file_hash(file) {
  return (file.name + file.lastModified.toString());
}

class Form extends Network.Component {
  static childContextTypes = {
    model: PropTypes.string,
    errors: PropTypes.object,
    object: PropTypes.object,
    setValid: PropTypes.func,
  };

  constructor(props) {
    super(props);

    //console.log("FORM OBJECT");
    //console.log(props);

    this.initState({
      isLoading: false,
      errors: null,
      valid: true,
    });

    this.onSubmit = this.submitHandler.bind(this);
    this.onSetValid = this.setValid.bind(this);
  }

  isValid() {
    return this.state.valid;
  }

  setValid(valid) {
    this.setState({
      valid
    });
  }

  getChildContext() {
    return { 
      model: this.props.model,
      object: this.props.object,
      errors: this.state.errors,
      setValid: this.onSetValid,
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

  submit(e) {
    if (e) {
      e.preventDefault();
    }

    if (this.state.isLoading) {
      return;
    }

    if (!this.state.valid) {
      return false;
    }

    this.preSubmit();

    let $item = $(this.form);
    let data = $item.serialize();
    //console.log("DATA");
    //console.log(data);

    this.innerSubmit(data);
  }

  innerSubmit(data) {
    var self = this;

    this.getJSON({
      type: self.props.method || Network.Method.POST,
      url: self.props.url,
      data: data,
      context: self,
      remote: self.props.remote,

    }).always(function() {
      this.postSubmit();

    }).done((retData, textStatus, jqXHR) => {
      if (self.props.reset) {
        //$("#" + $(self.form).attr("id")).trigger("reset");
        $(this.form).trigger("reset");
        //console.log("TRIGGER");
      }
    }).done((retData, textStatus, jqXHR) => {
      //console.log("SUCCESS?");
      self.ajaxSuccess(retData, textStatus, jqXHR);

    }).fail((jqXHR, textStatus, errorThrown) => {
      //console.log("FAIL?");
      //console.log(jqXHR);
      //console.log(textStatus);
      //console.log(errorThrown);

      self.ajaxError(jqXHR, textStatus, errorThrown);


    });
  }

  ajaxSuccess(data, textStatus, jqXHR) {
    //console.log("AJAX SUCCESS");
    //console.log(this.props);
    if (this.props.onSuccess) {
      console.log("CALLING SUCCESS");
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
        {...Util.propsMergeClassName(rest, Util.ClassNames(!this.state.valid ? "invalid" : "").push("hello"))}
        onSubmit={this.props.onSubmit || this.onSubmit}
      >
        {this.props.children}
      </form>
    );
  }
}

class ObjectWrapper extends BaseComponent {
  static childContextTypes = {
    object: PropTypes.object,
    model: PropTypes.string,
  };

  getChildContext() {
    return {
      object: this.props.object,
      model: this.props.model,
    }
  }

  render() {
    return this.props.children;
  }
}

class Many extends BaseComponent {
  static childContextTypes = {
    model: PropTypes.string,
  };

  static contextTypes = {
    model: PropTypes.string,
    object: PropTypes.object,
  };

  getChildContext() {
    return {
      model: this.props.model,
    }
  }

  getName() {
    return this.props.name;
  }

  render() {
    let items = this.context.object[this.props.name] || [];

    return (
      <UI.PassThru>
        { 
          items.map((item, pos) => {
            let mname = this.context.model + "[" + this.props.model + "][" + item.id + "]";
            //console.log(mname);
            return (
              <ObjectWrapper object={item} model={mname} key={mname + "-" + item.id}>
                { 
                  Util.childrenWithProps(this.props.children, {}) 
                }
              </ObjectWrapper>
            );
          })
        }
      </UI.PassThru>
    );
  }
}

class Group extends BaseComponent {
  static childContextTypes = {
    name: PropTypes.string,
    errorString: PropTypes.string
  };

  static contextTypes = {
    errors: PropTypes.object
  };

  constructor(props) {
    super(props);
    //alert("PFG");

    this.initState({
      errorString: null
    });
      
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

class Child extends Network.Component {
  static contextTypes = {
    name: PropTypes.string,
    model: PropTypes.string,
    errorString: PropTypes.string,
    object: PropTypes.object,
  }

  cleanProps(props, arr) {
    let all = ["anonymous", "unmanaged"];
    all = all.concat(arr);

    //console.log("CLEAN");
    //console.log(all);

    return Util.propsRemove(props, all);
  }

  htmlID() {
    return (this.context.model.toLowerCase() + "-" + this.context.name.toLowerCase());
  }

  name() {
    if (this.props.anonymous) {
      return null;
    }

    let me = (this.context.model.toLowerCase() + "[" + this.context.name.toLowerCase() + "]");
    if (this.props.multiple) {
      me = me + "[]";
    }
    return me;
  }

  safeName() {
    return (this.context.model.toLowerCase() + "-" + this.context.name.toLowerCase());
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



class SubmitButton extends BaseComponent {
  constructor(props) {
    super(props);
    this.onClick = this.onClickHandler.bind(this);
  }

  target() {
    let val = this.props.target;
    if ($.isFunction(val)) {
      return val();
    }
    return val.form || val;
  }
 
  onClickHandler(e) {
    //alert("CLICK");
    if (e) {
      e.preventDefault();
    }

    if (this.props.disabled) {
      return;
    }

    //console.log("CLICK");
    //console.log(this.props);

    let t = this.target();


    if (t) {
      //alert(this.props.target.form.constructor.name);
      t.submit();
    }
    else {
      console.log("SubmitButton missing target");
    }
  }

  render() {
    let rest = Util.propsRemove(this.props, ["target"]);

    return (
      <a href="#" 
        ref={(node) => this.button = node}
        onClick={this.onClick}
        {...Util.propsMergeClassName(rest, Util.ClassNames("btn btn-primary").push(this.props.disabled ? "disabled" : ""))}
      >{this.props.children}</a>
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
    this.initState({
      value: "",
      valid: true,
    });

    this.onChange = this.change.bind(this);
    this.onKeyUp = this.keyUp.bind(this);
    this.onBlur = this.blur.bind(this);
    this.onFocus = this.focus.bind(this);
  }

  value() {
    return this.state.value;
  }

  componentDidMount() {
    let value = this.props.value || this.modelValue() || "";
    this.setState({
      value,
      valid: this.valid(value),
    });
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (nextProps.value) {
      //console.log("Setting value to: " + nextProps.value);
      this.setState({
        value: nextProps.value,
        valid: true,
      });
    }
  }


  keyUp(e) {
    if ((e.keyCode == 13) && this.props.onSubmit) {
      e.preventDefault();
      this.props.onSubmit(e);
      return;
    }

    if ((e.keyCode == 13) && this.props.noSubmit) {
      e.preventDefault();
      return;
    }


    if (this.props.onKeyUp) {
      this.props.onKeyUp(e);
    }
  }

  setText(value, valid) {
    this.setState({
      value,  
      valid
    });
  }

  blur(e) {
    this.setState({
      valid: this.valid(e.target.value)
    });

    if (this.props.onBlur) {
      this.props.onBlur(e);
    }
  }

  focus(e) {
    if (this.props.onFocus) {
      this.props.onFocus(e);
    }
  }

  valid(str) {
    if (str) {
      str = $.trim(str);
    }

    let isEmpty = !str || (str.length == 0);

    if (isEmpty) {
      return !this.props.nonEmpty;
    }

    if (this.props.onValidate) {
      return this.props.onValidate(str);
    }

    return true;
  }

  change(e) {
    let val = e.target.value || "";
    let good = this.valid(val);

    let keepGoing = good;

    if (!keepGoing) {
      if (e) {
        e.preventDefault();
      }
      return;
    }

    if ((e.keyCode == 13) && this.props.onSubmit) {
      //console.log(e);
      this.submit(e);
      return;
    }

    this.setText(val, good);
    if (this.props.onChange) {
      this.props.onChange(e);
    }
  }

  inputType() {
    return "text";
  }

  subClassName() {
    return "";
  }

  render() {
    let myProps = { 
      name: this.name(), 
      type: this.inputType(),
      id: this.htmlID() ,
      "aria-describedby": this.htmlID(),
    };
    if (!this.props.unmanaged) {
      myProps.value = this.state.value;
    }

    let rest = this.cleanProps(this.props, 
      ["value", 
        "onChange", 
        "onKeyUp", 
        "onFocus", 
        "onBlur", 
        "onValidate",
        "autoClear", 
        "unmanaged", 
        "nonEmpty",
        "noSubmit"]
    );

    let hasStuff = this.state.value && this.state.value.length > 0;

    return(
      <input type="text" 
        autoComplete="off"
        {...myProps} 
        {...Util.propsMergeClassName(rest, ["form-control", this.subClassName(), this.valid(myProps.value) ? (hasStuff ? "valid" : "") : "invalid"])} 
        onFocus={this.onFocus}
        onBlur={this.onBlur}
        onChange={this.onChange} 
        onKeyUp={this.onKeyUp}
      />
    );
  }
}

class PasswordField extends TextField {
  inputType() {
    return "password";
  }

  subClassName() {
    return "password-text";
  }
}


class MoneyField extends TextField {
  ripOut(v) {
    if (!v || v.length == 0) {
      return v;
    }

    return v.replace(/[,\.]/, '');
  }

  ripIn(v) {
    if (!v || v.length == 0) {
      return v;
    }

    return ripOut(v).toLocaleString('en-US'); // FIXME
  }

  focus(e) {
    this.setText(this.ripOut(this.state.value));
    super.focus(e);
  }

  blur(e) {
    this.setText(this.ripIn(this.state.value));
    super.blur(e);
  }

  valid(str) {
    const re = /^[0-9]+$/;
  
    return super.valid(str) && (str && re.test(str));
  }

  subClassName() {
    return "money-text";
  }
}

const EmailField = (props) => (
  <TextField placeholder="email@domain.com" onValidate={Util.isValidEmail} {...props} />
);

const PhoneNumberField = (props) => (
  <TextField placeholder = "415-555-1212" onValidate={Util.isValidPhoneNumber} {...props } />
);

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
      <option {...Util.propsMergeClassName(this.props, "hmmm-form-control")}>{this.props.children}</option>
    );
  }
}

class CompactSelect extends Child {
  render() {
    let myProps = { 
      name: this.name(), 
      id: this.htmlID() ,
      "aria-describedby": this.htmlID()
    };

    return (
      <ReactSelect
        {...myProps}
        {...Util.propsMergeClassName(this.props, "form-control")}
      />
    );
  }
}

class Hidden extends Child {
  render() {
    let myProps = { 
      name: this.name(), 
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
    this.initState({
      value: ""
    });

    this.onTextChange = this.textChange.bind(this);
  }

  componentDidMount() {
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
    this.initState({
      checked: false
    });

    this.onChange = this.change.bind(this);
  }

  componentDidMount() {
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
    if (this.props.onChange) {
      this.props.onChange(e);
    }
  }

  modelChecked() {
    //console.log("THIS MODELVALUE: " + this.modelValue());

    return this.modelValue() ? true : false;
  }

  render() {
    let myProps = { 
      name: this.name(), 
      id: this.htmlID() ,
      "aria-describedby": this.htmlID(),
      checked: this.state.checked,
    };

    let rest = this.cleanProps(this.props, ["children", "onChange"]);

    return(
      <div className="form-checkbox flx-row">
        <input name={this.name()} type="hidden" value={false} />
        <input type="checkbox" {...myProps} {...Util.propsMergeClassName(rest, "form-control")} onChange={this.onChange}/>
        <span className="mt-auto mb-auto"><label>{this.props.children}</label></span>
      </div>
    );
  }
}

class DropTarget extends BaseComponent {

  constructor(props) {
    super(props);

    this.initState({
      dragging: 0,
      valid: true,
    });

    this.onDragEnter = this.dragging.bind(this, true);
    this.onDragLeave = this.dragging.bind(this, false);
    this.onDragOver = this.dragOver.bind(this);
    this.onDragStart = this.dragStart.bind(this);
    this.onDragEnd = this.dragEnd.bind(this);
    this.onDrop = this.drop.bind(this);

    this.onChange = this.change.bind(this);
    this.onClick = this.click.bind(this);
  }

  componentDidMount() {
    this.setState({
      dragging: false,
      valid: true,
    });
  }

  //https://stackoverflow.com/questions/21339924/drop-event-not-firing-in-chrome

  dragOver(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
  }

  eventFiles(e) {
    return e.dataTransfer.files || e.target.files;
  }

  isImageFiles(files) {
    if (!files) {
      return false;
    }

    if (!this.props.imageOnly) {
      return true;
    }

    Array.from(files).forEach((f) => {
      if (!Attachment.isImageType(f)) {
        //console.log("BUMMER");
        return false;
      }
    });

    return true;
  }

  isValid(files) {
    if (!files || (files.length == 0)) {
      return false;
    }

    if (!this.props.multiple && (files.length > 1)) {
      return false;
    }

    let valid = true;

    if (this.props.imageOnly) {
      valid = this.isImageFiles(files);
    }

    if (valid && this.props.validateFiles) {
      valid = this.props.validateFiles(files);
    }

    return valid;
  }

  removeDupes(files) {
    let current = this.props.files || [];
    files = files || [];

    //console.log("DEDUPE");
    //console.log(files);
    //console.log(current);

    let results = [];
    for(var f of files) {
      let found = false;
      let fh = file_hash(f);
      for(var old of current) {
        //console.log("***");
        //console.log(f);
        //console.log(old);
        if (fh == file_hash(old)) {
          found = true;
          break;
        }
      }
      if (!found) {
        results.push(f);
      }
    }

    return results;
  }

  dragging(dragging, e) {
    //console.log("DRAGGING");
    //console.log(dragging);

    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    let files = this.eventFiles(e);


    let valid = this.isValid(files);

    this.setState({
      dragging: this.state.dragging + (dragging ? 1 : -1),
      valid,
    });

    //console.log("DRAGGING: " + dragging);
    //console.log(e.dataTransfer.types);
    //console.log(e);
  }

  dragStart(e) {
    //console.log("DRAG START");
  }

  dragEnd(e) {
    //console.log("DRAG END");
    this.setState({
      dragging : 0,
      valid: true,
    });
  }

  sendBackFiles(files) {
    // just to be clear
    this.setState({
      dragging: 0,
      valid: true
    });

    if (!this.isValid(files)) {
      return; // nothing to see here
    }

    if (this.props.onAddFiles) {
      this.props.onAddFiles(files);
    }
  }

  drop(e) {
    //console.log("DROPPED");
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }

    let files = this.eventFiles(e);
    files = this.removeDupes(files);
    this.sendBackFiles(files);
  }

  change(e) {
    //console.log("ON CHANGE");
    if (!e.target.value) {
      return;
    }

    let files = e.target.files;
    this.sendBackFiles(files);
  }

  click(e) {
    return this.fileInput.click();
  }

  renderFileInput() {
    let afile = this.state.files ? this.state.files[0]: "";
    let extra = {
      multiple :this.props.multiple
    };

    return (
        <input className="pyr-drop-file" ref={node => this.fileInput = node} type="file" {...this.props.input} onChange={this.onChange} {...extra}/>
    );
  }

  render() {
    let clz = Util.ClassNames("pyr-drop-target", (this.state.dragging > 0 ? "dragging" : null));

    if (!this.state.valid) {
      clz.push("invalid");
    }

    let rest = Util.propsRemove(this.props, ["imageOnly", "onAddFiles"]);

    return(
      <div 
        {...Util.propsMergeClassName(rest, clz)}
        onDragStart={this.onDragStart}
        onDragEnd={this.onDragEnd}
        onDragEnter={this.onDragEnter}
        onDragLeave={this.onDragLeave}
        onDragOver={this.onDragOver}
        onDrop={this.onDrop}
        onClick={this.onClick}
      >
        { this.renderFileInput() }
        { this.props.children }
      </div>
    );
  }
}


class FileSelector extends Child {
  constructor(props) {
    super(props);

    this.initState({
      files: [],
      fileUploads: {},
      incomingUploads: [],
    });

    this.onAddFiles = this.addFiles.bind(this);
    this.onRemoveUpload = this.removeUpload.bind(this);
  }

  inUploads() {
    let uploads = this.props.uploads;
    if (uploads) {
      if (!Array.isArray(uploads)) {
        uploads =  [ uploads ];
      }
    }
    return uploads || [];
  }

  componentDidMount() {
    this.setState({
      files: [],
      fileUploads: {},
      incomingUploads: this.inUploads(),
    });
  }

  allUploads() {
    let all = [];

    all = all.concat(this.state.incomingUploads);

    let files = this.state.files || [];

    for(let i=0;i<files.length;i++) { // maintain order
      let u = this.getFileUpload(files[i]);
      if (u) {
        all.push(u);
      }
    }

    all = all.reduce((ar, val) => {
      if (val != null)   {
        ar.push(val);
      }
      return ar;
    }, []);

    return all;
  }

  setFileUpload(file, upload) {
    let fh = file_hash(file);

    let mini = {};
    mini[fh] = upload;

    //console.log("Setting FILE UPLOAD");
    //console.log(upload);

    this.setState({
      fileUploads : Object.assign({}, this.state.fileUploads, mini)
    });
  }

  getFileUpload(file) {
    return this.state.fileUploads[file_hash(file)];
  }

  removeUpload(e, inUpload) {
    //alert("REMOVE UPLOAD");
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    let currentFiles = this.state.files;

    let newFiles = [];
    let newFilesUploads = {};

    for(let file of currentFiles) {
      let upload = this.getFileUpload(file);
      if (upload.id != inUpload.id) {
        newFiles.push(file);
        newFilesUploads[file_hash(file)] = upload;
      }
    }

    let currentIncomingUploads = this.state.incomingUploads || [];
    let newIncomingUploads = [];

    for(let upload of currentIncomingUploads) {
      if (upload.id != inUpload.id) {
        newIncomingUploads.push(upload);
      }
    }

    this.setState({
      files: newFiles,
      fileUploads: newFilesUploads,
      incomingUploads: newIncomingUploads,
    });
  }

  addFiles(newFiles) {
    //console.log("ADD FILES");
    //console.log(newFiles);

    newFiles = Array.from(newFiles);

    if (!newFiles || (newFiles.length == 0)) {
      return;
    }

    if (!this.props.multiple && (newFiles.length > 1)) {
      alert("Only 1 file can be selected here!");
      return;
    }

    let oldFiles = this.state.files || [];
    let oldUploads = this.state.fileUploads || {};
    let oldIncomingUploads = this.state.incomingUploads || [];

    if (!this.props.multiple) {
      oldFiles = [];
      oldUploads = {};
      oldIncomingUploads = [];
    }

    oldFiles = oldFiles.concat(newFiles);

    this.setState({
      files : oldFiles,
      uploads : oldUploads,
      incomingUploads: oldIncomingUploads,
    });

    let me = this;

    newFiles.forEach((file) => {
      //console.log("FILE");
      //console.log(file);

      me.setFileUpload(file, null);

      this.S3Put(file).done((upload) => {
        //console.log("S3PUT RESULT");
        //console.log(upload);

        me.setFileUpload(file, upload);

      }).fail((jqXHR, textStatus, errorThrown) => {
        this.ajaxError(jqXHR, textStatus, errorThrown);

      });
    });
  }

  renderHiddens() {
    let all = this.allUploads();

    if (!all || !all.length) {
      return null;
    }

    //console.log("FILE UPLOADS");
    //console.log(all);
    //console.log("*FILE UPLOADS");

    let name = this.name();

    let hiddens = all.map((upload, pos) => {
      if (!upload) {
        return null; // NOT READY YET!
      }

      //console.log("THE UPLOAD");
      //console.log(upload);

      return (
        <input key={upload.id} name={name} type="hidden" value={upload.id} data-pyr-file/>
      );
    });

    return (
      <div className="pyr-files-to-upload hidden">
        { hiddens }
      </div>
    );

  }

  renderDefault() {
    let files = this.state.files || [];
    let uploads = this.allUploads() || [];

    if (!this.props.multiple) {
      if (files.length || uploads.length) {
        return null;
      }
    }


    return (
      <div className="flx-col drop-site drop-site-size default thing">
        <UI.IconButton name="upload" />
        <div className="file-name">Click or Drag to Select File</div>
      </div>
    );
  }

  renderUploads(showFileName) {
    let all = this.allUploads() || [];

    //console.log("RENDER UPLOADS");
    //console.log(all);

    return all.map((upload, pos) => {
      //console.log("RENDERING UPLOAD");
      //console.log(upload);
      return (
        <div key={upload.id + "-img"} className="upload thing flx-col" onClick={ e => this.onRemoveUpload(e, upload) }>
          <UI.IconButton name="times" className="remove ml-auto"/>
          <UI.ImageFile url={upload.url} contentType={upload.content_type} className="ml-auto mr-auto"/>
          <div className="file-name">{showFileName ? upload.file_name : ""}</div>
        </div>
      );
    });
  }

  renderFiles(showFileName) {
    //console.log("RENDER FILES");
    //console.log(this.state.files);

    let files = this.state.files || [];

    return files.map((file, pos) => {
      //console.log("RENDER FILE");
      //console.log(file);

      let upload = this.getFileUpload(file);
      if (upload) {
          //console.log("ALREADY IN UPLOADS");
        return null; // already in uploads
      }
      return (
        <div key={file_hash(file)+"-file"} className="file thing" >
          <UI.IconButton name="times" className="remove ml-auto"/>
          <UI.ImageFile file={file} />
          <div className="file-name">{showFileName ? file.name: ""}</div>
        </div>
      );
    });
  }

  render() {
    let clz = Util.ClassNames("form-control pyr-file-selector");

    let rest = this.cleanProps(this.props, ["imageOnly", "multiple", "files", "uploads", "row", "wrap", "showFileName"]);

    let gutsClz = Util.ClassNames("guts");
    if (this.props.row) {
      gutsClz.push("flx-row");
    }
    if (this.props.wrap) {
      gutsClz.push("flx-wrap");
    }

    return(
      <div id={this.htmlID()}
        {...Util.propsMergeClassName(rest, clz)}
      >
        { this.renderHiddens() }
        <DropTarget 
          imageOnly={this.props.imageOnly}
          multiple={this.props.multiple}
          onAddFiles={this.onAddFiles}
          className=""
          files={this.state.files}
        >
          <div className={gutsClz}>
            { this.renderDefault() }
            { this.renderUploads(this.props.showFileName) }
            { this.renderFiles(this.props.showFileName) }
          </div>
        </DropTarget>
      </div>
    );
  }

}

const RANGE_DEFAULT_MIN = 0;
const RANGE_DEFAULT_MAX = 10;

class Range extends Child {

  constructor(props) {
    super(props);
    //console.log("PROPS");
    //console.log(props);

    this.initState({
      value: props.value || this.minValue() 
    });

    this.onChange = this.change.bind(this);
  }

  setValue(value) {
    if (value > this.maxValue()) {
      value = this.maxValue();
    }
    if (value < this.minValue()) {
      value = this.minValue();
    }
    this.setState({
      value
    });
  }

  value() {
    return (this.state.value || this.minValue());
  }

  change(value) {
    this.setValue(value);
  }

  componentDidMount() {
    let value = this.props.value || this.modelValue() || this.minValue();
    this.setValue(value);
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (nextProps.value) {
      //console.log("Setting value to: " + nextProps.value);
      this.setState({
        value: nextProps.value
      });
    }
  }

  minValue() {
    return (this.props.minValue || Range.default_min);
  }

  maxValue() {
    return (this.props.maxValue || Range.default_max);
  }

  render() {
    //console.log("RENDERING: " + this.state.value);

    let minValue = this.minValue();
    let maxValue = this.maxValue();
    let value = this.value();

    return (
      <div className="pyr-range">
        <input type="hidden" name={this.name()} value={value} />
        <InputRange
          {...this.props}
          minValue={minValue}
          maxValue={maxValue}
          value={value}
          onChange={this.onChange}
        />
      </div>
    );
  }
}
Range.default_min = 0;
Range.default_max = 10;


class AutoComplete extends Child {
  constructor(props) {
    super(props);

    this.initState({
      isLoading: false,
      results: [],
      value: null,
    });

    this.onSearch = this.search.bind(this);
    this.onLoading = this.loading.bind(this);
    this.onFilterBy = this.filterBy.bind(this);
    this.onRenderToken = this.renderToken.bind(this);
    this.onInputChange = this.inputChange.bind(this);
  }

  loading(isLoading) {
    //console.log("IS LOADING: " + isLoading);
    this.setState({
      isLoading
    });
  }

  search(query) {
    //console.log("A: *******");
    //console.log(this.props.url);
    let url = Util.URL(this.props.url).push("auto").set("q", query);
    //console.log(url);
    //console.log(url.parser.href);
    //console.log(url.toString());
    //console.log("B: *******");

    this.getJSON({
      url : url,
      onLoading : this.onLoading,
    }).done((data, textStatus, jqXHR) => {
      //console.log("RESULTS");
      //console.log(data.results);
      this.setState({
        results: data.results
      });
    });
  }

  filterBy(options, text) {
    return true;
  }

  labelKey() {
    return this.props.labelKey || "name";
  }

  renderToken(option, onRemove) {
    //console.log("OPTION");
    //console.log(option);

    //console.log("PROPS");
    //console.log(this.props);

    let lk = this.labelKey();

    let value = this.props.valueByID ? option.id : option.name;
    let name = this.name();

    let clazz = Util.ClassNames(this.props.bpSize);

    return (
      <span className="auto-token" key={"skb-" + this.safeName() + option.id}>
        <Hidden 
          name={name}
          value={value}
        />
        <UI.FancyButton
          onClick={onRemove}
          className={clazz}
        >{option[lk]}</UI.FancyButton>
      </span>
    );
  }

  inputChange(text) {
    //console.log("INPUT CHANGE: " + text);
    this.setState({
      value: text
    });
  }

        //filterBy={this.onFilterBy}
  render() {
    let clz = "pyr-auto-complete";

    let rest = this.cleanProps(this.props, ["url"]);

    let lk = this.labelKey();

    let hidden = null;
    if (!this.props.multiple && this.state.value) {
      hidden = <input name={this.name()} type="hidden" value={this.state.value} />
    }

    let defValue = this.modelValue() || [];
    if (!Array.isArray(defValue)) {
      defValue = [ defValue ];
    }

    return (
      <div className="async-typeahead">
        { hidden }
        <AsyncTypeahead
          emptyLabel=""
          ignoreDiacritics
          useCache={false}
          caseSensitive={false}
          onSearch={this.onSearch}
          isLoading={this.state.isLoading}
          options={this.state.results}
          labelKey={lk}
          onInputChange={this.onInputChange}
  
          defaultSelected={defValue}
          renderToken={this.onRenderToken}
  
          {...Util.propsMergeClassName(rest, clz)}
        />
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
  MoneyField,
  Select, 
  Option, 
  TextArea, 
  SubmitButton, 
  Hidden,
  CheckBox,
  FileSelector,
  AutoComplete,
  CompactSelect,
  Range,
  Many,
  ObjectWrapper,
  EmailField,
  PhoneNumberField,
};

export { 
  PyrForm
};
