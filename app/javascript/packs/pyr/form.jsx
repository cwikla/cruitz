
import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';

import Component from './base';
import Util from './util';
import Network from './network';
import UI from './ui';
import Attachment from './attachment';

import {
  Typeahead,
  AsyncTypeahead
} from 'react-bootstrap-typeahead';

class Form extends Network.Component {
  static childContextTypes = {
    model: PropTypes.string,
    errors: PropTypes.object,
    object: PropTypes.object,
  }

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

    let $item = $(this.form);

    let data = $item.serialize();

    this.preSubmit();
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
      self.ajaxSuccess(retData, textStatus, jqXHR);

    }).fail((jqXHR, textStatus, errorThrown) => {
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
        {...Util.propsMergeClassName(rest, Util.ClassNames(!this.state.valid ? "invalid" : "").push("hello"))}
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

  target() {
    return this.props.target;
  }
 
  onClickHandler(e) {
    //alert("CLICK");
    if (e) {
      e.preventDefault();
    }

    if (this.props.disabled) {
      return;
    }

    if (this.props.target) {
      //alert(this.props.target.form.constructor.name);
      this.props.target.form.submit();
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
      value: ""
    });

    this.onTextChange = this.textChange.bind(this);
    this.onKeyUp = this.keyUp.bind(this);
  }

  value() {
    return this.state.value;
  }

  componentWillMount() {
    let value = this.props.value || this.modelValue() || "";
    this.setState({
      value
    });
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (nextProps.value) {
      //console.log("Setting value to: " + nextProps.value);
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
      //console.log(e);
      this.submit(e);
      return;
    }

    let val = e.target.value || "";

    this.setText(val);
    if (this.props.onChange) {
      this.props.onChange(e);
    }
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
    this.initState({
      value: ""
    });

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
    this.initState({
      checked: false
    });

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

    let rest = Util.propsRemove(this.props, ["children", "onChange"]);

    return(
      <div className="form-checkbox flx-row">
        <input name={this.name()} type="hidden" value={false} />
        <input type="checkbox" {...myProps} {...Util.propsMergeClassName(rest, "form-control")} onChange={this.onChange}/>
        <span className="mt-auto mb-auto"><label>{this.props.children}</label></span>
      </div>
    );
  }
}

class DropTarget extends Component {

  constructor(props) {
    super(props);

    this.initState({
      dragging: false,
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

  componentWillMount() {
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

  dragging(dragging, e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    let files = this.eventFiles(e);
    let valid = this.isValid(files);

    this.setState({
      dragging,
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
      dragging : false,
      valid: true,
    });
  }

  sendBackFiles(files) {
    // just to be clear
    this.setState({
      dragging: false,
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
    this.sendBackFiles(files);
  }

  change(e) {
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
    let clz = Util.ClassNames("pyr-drop-target yellow", (this.state.dragging ? "dragging" : null));

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
  }

  componentWillMount() {
    this.setState({
      files: [],
      fileUploads: {},
      incomingUploads: (this.props.uploads || []),
    });
  }

  allUploads() {
    let all = []; // FIXME
    let uploads = this.props.incomingUploads || [];

    all = all.concat(this.state.incomingUploads);

    let files = this.state.files || [];

    for(let i=0;i<files.length;i++) { // maintain order
      let u = this.getFileUpload(files[i]);
      if (u) {
        all.push(u);
      }
    }
    return all;
  }

  fhash(file) {
    return (file.name + file.lastModified.toString());
  }

  setFileUpload(file, upload) {
    let fh = this.fhash(file);

    let mini = {};
    mini[fh] = upload;

    //console.log("Setting FILE UPLOAD");
    //console.log(upload);

    this.setState({
      fileUploads : Object.assign({}, this.state.fileUploads, mini)
    });
  }

  getFileUpload(file) {
    return this.state.fileUploads[this.fhash(file)];
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

      Attachment.S3Put(file).done((upload) => {
        //console.log("S3PUT RESULT");
        //console.log(upload);

        me.setFileUpload(file, upload);

      }).fail((jqXHR, textStatus, errorThrown) => {
        Network.ajaxError(jqXHR, textStatus, errorThrown);

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

    let hiddens = all.map((upload, pos) => {
      if (!upload) {
        return null; // NOT READY YET!
      }

      //console.log("THE UPLOAD");
      //console.log(upload);

      return (
        <input key={upload.id} name={this.name()} type="hidden" value={upload.id} data-pyr-file/>
      );
    });

    return (
      <div className="pyr-files-to-upload">
        { hiddens }
      </div>
    );

  }

  renderDefault() {
    return (
      <div className="flx-col drop-site drop-site-size">
        <UI.IconButton name="upload" />
        Click or Drag to Select File
      </div>
    );
  }

  renderUploads() {
    let all = this.allUploads();
    //console.log("RENDER UPLOADS");
    //console.log(all);

    return all.map((upload, pos) => {
      //console.log("RENDERING UPLOAD");
      //console.log(upload);
      return (
        <div key={upload.id + "-img"} className="upload">
          <UI.ImageFile url={upload.url} contentType={upload.content_type} />
        </div>
      );
    });
  }

  renderFiles() {
    //console.log("RENDER FILES");
    //console.log(this.state.files);

    return this.state.files.map((file, pos) => {
      //console.log("RENDER FILE");
      //console.log(file);

      let upload = this.getFileUpload(file);
      if (upload) {
          //console.log("ALREADY IN UPLOADS");
        return null; // already in uploads
      }
      return (
        <div key={this.fhash(file)+"-file"} className="file">
          <UI.ImageFile file={file} className="red"/>
        </div>
      );
    });
  }

  renderImages() {
    let uploads = this.allUploads();
    let files = this.state.files || [];

    if (!uploads.length && !files.length) {
      return this.renderDefault();
    }

    //console.log("RENDER IMAGES");
    //console.log("UP: " + uploads.length);
    //console.log(uploads);
    //console.log("FILE: " + files.length);
    //console.log(files);

    return (
      <div className="pyr-images">
        { this.renderUploads() }
        { this.renderFiles() }
      </div>
    );
  }

  render() {
    let clz = Util.ClassNames("form-control pyr-file-selector");

    let rest = Util.propsRemove(this.props, ["imageOnly", "multiple", "files"]);

    return(
      <div id={this.htmlID()}
        {...Util.propsMergeClassName(rest, clz)}
      >
        { this.renderHiddens() }
        <DropTarget 
          imageOnly={this.props.imageOnly}
          multiple={this.props.multiple}
          onAddFiles={this.onAddFiles}
        >
          { this.renderImages() }
        </DropTarget>
      </div>
    );
  }

}



class AutoComplete extends Child {
  constructor(props) {
    super(props);

    this.initState({
      isLoading: false,
      results: [],
    });

    this.onSearch = this.search.bind(this);
    this.onLoading = this.loading.bind(this);
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
    let url = Util.URL(this.props.url).set("q", query);
    //console.log(url);
    //console.log(url.parser.href);
    //console.log(url.toString());
    //console.log("B: *******");

    Network.getJSON({
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

  render() {
    let clz = "pyr-auto-complete";

    let rest = Util.propsRemove(this.props, ["url"]);

    return (
      <AsyncTypeahead
        emptyLabel=""
        ignoreDiacritics
        useCache={false}
        caseSensitive={false}
        onSearch={this.onSearch}
        isLoading={this.state.isLoading}
        {...Util.propsMergeClassName(rest, clz)}
        options={this.state.results}
        renderToken={(option, onRemove, index) => { 
          return (
            <UI.FancyButton
                  key={"skb"+index}
                  onClick={onRemove}
            >{option}</UI.FancyButton>
          );
        }}
      />
    );
  }
}

export default AutoComplete;

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
  FileSelector,
  AutoComplete,
};

export { 
  PyrForm
};
