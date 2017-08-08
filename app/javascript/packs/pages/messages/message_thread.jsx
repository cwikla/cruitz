import React, { 
  Component
} from 'react';

import ReactDOM from 'react-dom';

import Pyr from '../../pyr/pyr';
const ClassNames = Pyr.ClassNames;

const MessageThreadHeader = (props) => (
  <div className="message-header" {...Pyr.Util.propsRemove(props, ["job", "message", "isNew"])}>{props.isNew ? "New ": ""}Candidate: <span>{props.job.title}</span></div>
);

const Header = (props) => (
  <div className="message-header">
      <div className="align-self-left back"><a href="#" onClick={props.onBack}>Back</a></div>
      <div className="align-self-center title">{props.message.job.title}</div>
  </div>
);


class Content extends Component {
  render() {
    console.log("SHOW INNNER!");
    return (
      <div 
        ref={(node) => this.scrollerOld = (node)}
        id="message-show" 
        className="flx-1 flx-col scroll" 
        onScroll={this.props.onScroll}
      >
        {this.props.children}
      </div>
    );
  }
}

class Footer extends Component {
  render() {
    return (
      <div className="message-footer z-depth-1">
        <Pyr.Form.Form
          controller="message"
          url={this.props.url + "/" + this.props.message.id}
          id={"thread-form" + "-" + this.props.message.id}
          onSuccess={this.props.onSuccess}
          ref={(node) => this.form = node}
          reset
        >
          <div className="flx-row">
            <Pyr.Form.Group name="body" className="flx-1">
              <Pyr.Form.TextField 
                placeholder={this.props.label + "..."}
                ref={(node) => this.textField = node}
                autoFocus
              />
            </Pyr.Form.Group> 
            <Pyr.Form.SubmitButton target={this}>{this.props.label}</Pyr.Form.SubmitButton>
          </div>
        </Pyr.Form.Form>
      </div>
    );
  }
}


class MessageThread extends Component {
  render() {
    return (
      <div className="sheet flx-col-stretch flx-1">
        <Header
          message={this.props.message}
          onBack={this.props.onBack}
        />
        <Content
          onScroll={this.props.onScroll}
        >
          {this.props.children}
        </Content>
      
        <Footer
          message={this.props.message}
          onSuccess={this.props.onSuccess}
          label="Reply"
          url={this.props.url}
        />
      </div>
    );
  }
}

export default MessageThread;
export {
  MessageThreadHeader
};
