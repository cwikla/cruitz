import React, { 
  Component
} from 'react';

import ReactDOM from 'react-dom';

import Pyr from '../../pyr/pyr';
const ClassNames = Pyr.ClassNames;

import ThreadItem from './thread_item';

const MessageQAHeader = (props) => (
  <div className="message-header" {...Pyr.Util.propsRemove(props, ["job", "message", "isNew"])}>{props.isNew ? "New ": ""}Q&amp;A: <span>{props.job.title}</span></div>
);

const Header = (props) => (
  <div className="qa-header">
      <div className="align-self-left back"><a href="#" onClick={props.onBack}>Back</a></div>
      <div className="align-self-center title">You have received a question about {props.message.job.title}</div>
  </div>
);

class ThreadList extends Component {
  render() {
    if (!this.props.thread || this.props.thread.length < 1) {
      return (<Pyr.Loading />);
    }
  
    let thid = "thread-" + this.props.selected.root_message_id;
  
    return (
      <div id={thid} className="message-thread flx-1">
        {
          this.props.thread.map((msg, pos) => {
            if (!msg.root_message_id) {
              return null;
            }
            //console.log(msg.job_id + " => " + JSON.stringify(this.props.jobMap[message.job_id]));
            return ( <ThreadItem message={msg}
                      job={this.props.jobMap[msg.job_id]}
                      isSelected={msg.id == this.props.selected.id}
                      key={thid+"-"+msg.id}/>
            );
          })
        }
      </div>
    );
  }
}

class Content extends Component {
  render() {

    if (!this.props.thread || this.props.thread.length < 1) {
      return (<Pyr.Loading />);
    }
    console.log("SHOW INNNER!");


    let root = this.props.thread[0];
    let thid = "thread-" + root.id;

    return (
      <div id="qa-content" className="flx-col flx-stretch">
        <div className="qa-question">
          <ThreadItem message={root}
             job={this.props.jobMap[root.job_id]}
             isSelected={this.props.message.id == root.id}
             key={thid+"-"+root.id}/>
        </div>
        <div
          ref={(node) => this.scrollerOld = (node)}
          id="message-show" 
          className="scroll flx-col flx-stretch" 
          onScroll={this.props.onScroll}
        >
          <ThreadList
            thread={this.props.thread}
            selected={this.props.message}
            jobMap={this.props.jobMap}
          />
        </div>
      </div>
    );
  }
}
/*
*/
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


class MessageQA extends Component {
  render() {
    return (
      <div className="sheet flx-col-stretch flx-1">
        <Header
          message={this.props.message}
          onBack={this.props.onBack}
        />
        <Content
          onScroll={this.props.onScroll}
          message={this.props.message}
          thread={this.props.thread}
          jobMap={this.props.jobMap}
        >
        </Content>
      
        <Footer
          message={this.props.message}
          onSuccess={this.props.onSuccess}
          label="Answer"
          url={this.props.url}
        />
      </div>
    );
  }
}

export default MessageQA;
export {
  MessageQAHeader
};
