import React, { 
  Component
} from 'react';

import ReactDOM from 'react-dom';

import Pyr from '../../pyr/pyr';
const ClassNames = Pyr.ClassNames;

import ThreadItem from './thread_item';
import MessageThread from './message_thread';

const MessageQAHeader = (props) => (
  <div className="message-header" {...Pyr.Util.propsRemove(props, ["job", "message", "isNew"])}>{props.isNew ? "New ": ""}Q&amp;A: <span>{props.job.title}</span></div>
);

const Header = (props) => (
  <div className="qa-header">
      <div className="align-self-left back"><a href="#" onClick={props.onBack}>Back</a></div>
      <div className="align-self-center title">You have received a question about {props.job.title}</div>
  </div>
);

class MessageQA extends MessageThread {
  render() {
    let message = this.state.thread ? this.state.thread[this.state.thread.length-1] : null;
    if (!message) {
      return <Pyr.Loading />
    }


    return (
      <div className="flx-col-stretch flx-1 sheet qa">
        <Header
          job={this.props.job}
          message={message}
          onBack={this.props.onBack}
        />
        {this.renderContent(message)}
        {this.renderFooter(message, "Answer")}
      </div>
    );
  }
}

export default MessageQA;
export {
  MessageQAHeader
};
