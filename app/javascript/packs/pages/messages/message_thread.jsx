import React from 'react';

import {
  Link,
} from 'react-router-dom';

import Pyr, {
} from '../../pyr/pyr';
const ClassNames = Pyr.ClassNames;

import Component from '../component';

import ThreadItem, {
  THREAD_ID
} from './thread_item';

import {
  MESSAGES_URL
} from '../const';

const SCROLL_TIME = 800;

const MessageThreadIndexHeaderDebug = (props) => (
  <div className="message-header" {...Pyr.Util.propsRemove(props, ["job", "message", "isNew"])}>{props.isNew ? "New ": ""}<span className="job-title">{props.job.title}|{props.message.id}|{props.message.root_message_id}|{props.message.parent_message_id}</span></div>
);

const MessageThreadIndexHeader = (props) => (
  <div className="message-header" {...Pyr.Util.propsRemove(props, ["job", "message", "isNew"])}>{props.isNew ? "New ": ""}<span className="job-title">{props.job.title}</span></div>
);


const MessageThreadHeaderOne = (props) => (
  <div className={ClassNames("message-header").push(props.className)}>
      <div className="align-self-center title">{props.job.title}</div>
  </div>
);

class MessageThreadHeader extends Component {
  leftChevron() {
    if (!this.props.prevId) {
      return (
        <Pyr.UI.IconButton name="chevron-left" className="disabled" />
      );
    }

    let link = Pyr.URL(MESSAGES_URL).push(this.props.prevId);

    return (
      <Link to={link.toString()} ><Pyr.UI.IconButton name="chevron-left" /></Link>
    );
  }

  rightChevron() {
    if (!this.props.nextId) {
      return (
        <Pyr.UI.IconButton name="chevron-right" className="disabled" />
      );
    }

    let link = Pyr.URL(MESSAGES_URL).push(this.props.nextId);

    return (
      <Link to={link.toString()} ><Pyr.UI.IconButton name="chevron-right" /></Link>
    );
  }

  render() {
    let title = this.props.job ? this.props.job.title : "";
    return (
        <div
          className="navbar flx-row controls align-items-center message-header"
        >
          <div className="nav-item col mr-auto">{title}</div>

          <div className="nav-item col">{this.leftChevron()} {this.rightChevron()}</div>

          <div className="col navbar-nav" >
            <Pyr.UI.BackButton name="close"
              className="pyr-back-button ml-auto nav-item"
              ><Pyr.UI.IconButton name="arrow-left">Back</Pyr.UI.IconButton></Pyr.UI.BackButton>
          </div>
        </div>
    );
  }
}

class ThreadList extends Component {
  render() {
    if (!this.props.thread || this.props.thread.length < 1) {
      return (<Pyr.UI.Loading />);
    }
  
    let thid = "thread-" + this.props.message.root_message_id || this.props.message.id;

    let skipCount = this.props.skipCount || 0;
  
    return (
      <div id={thid} className="message-thread flx-1">
        {
          this.props.thread.map((msg, pos) => {
            if (pos < skipCount) {
              return null;
            }
            return ( <ThreadItem message={msg}
                      job={this.props.job}
                      isSelected={msg.id == this.props.message.id}
                      key={thid+"-"+msg.id}/>
            );
          })
        }
      </div>
    );
  }
}

class Content extends Component {
  constructor(props) {
    super(props);

    this.scroll = null;
    this.onSetScroller = this.setScroller.bind(this);
  }

  setScroller(node) {
    this.scroll = node;
  }

  firstUnread() {
    let messages = this.props.thread;

    let pos = messages.reduce((result, m, index) => {
      if (m.mine || m.read_at) {
        return index;
      }
      return result;
    }, 0);
    //console.log("READ POS: " + pos);
    return messages[pos];
  }

  scrollToLastRead(firstUnread=false) {
    console.log("SCROLL TO LAST");

    if (!firstUnread) {
      console.log("Scroll To Bottom");
      //console.log("Scroll Height: " + this.scroll().scrollHeight);
      this.scroll.scrollToBottom(SCROLL_TIME);
      return;
    }

    let topMessage = this.firstUnread();
    let mid = THREAD_ID(topMessage);

    let $item = $("#" + mid);

    //console.log("SCROLLING TO ITEM: " + mid);
    this.scroll.scrollToItem($item);
  }

  componentDidMount() {
    this.scrollToLastRead(true);
  }

  componentDidUpdate(prevProps, prevState) {
    let oldLength = prevProps.thread ? prevProps.thread.length : 0;
    let newLength = this.props.thread ? this.props.thread.length : 0;

    //console.log("UPDATE: " + oldLength + " => " + newLength);

    if (oldLength != newLength) {
      this.scrollToLastRead(oldLength == 0);
    }
  }

  render() {

    if (!this.props.thread || this.props.thread.length < 1) {
      return (<Pyr.UI.Loading />);
    }

    return (
      <Pyr.UI.Scroll
        ref={(node) => this.scroll = node}
        id="message-show" 
        onScroll={this.props.onScroll}
      >
        <ThreadList
          thread={this.props.thread}
          message={this.props.message}
          job={this.props.job}
          skipCount={this.props.skipCount}
        />
      </Pyr.UI.Scroll>
    );
  }
}

class Footer extends Component {
  constructor(props) {
    super(props);

    this.onPreSuccess = this.preSuccess.bind(this);
  }

  preSuccess(data, textStatus, jqXHR) {
    this.textField.setText("");

    if (this.props.onSuccess) {
      this.props.onSuccess(data, textStatus, jqXHR)
    }
  }

  render() {
    return (
      <div className="message-footer">
        <Pyr.Form.Form
          model="message"
          url={Pyr.URL(MESSAGES_URL).push(this.props.message.id)}
          id={"thread-form" + "-" + this.props.message.id}
          onSuccess={this.onPreSuccess}
          ref={(node) => this.form = node}
          reset
        >
          <div className="flx-row">
            <Pyr.Form.Group name="body" className="flx-1">
              <Pyr.Form.TextField 
                placeholder={this.props.label + "..."}
                ref={(node) => this.textField = node}
                autoFocus
                autoClear
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

  constructor(props) {
    super(props);
    this.initState({
      thread: null
    });

    this.onLoading = null;
    this.onSuccess = this.success.bind(this);

  }

  threadExtra(thread) {
    let all = [];
    let userId = this.user().id;

    thread.map((item, pos) => {
      item.is_root = !item.root_message_id;
      item.mine = (item.from_user.id == userId);
      item.read_at = new Date(); // got it so pretend it's been read, server is updating
    });

    return thread;
  }

  setThread(thread) {
    this.setState({
      thread: this.threadExtra(thread),
    });
    //this.props.onSetItem(thread);
  }

  getThread(mid) {
    let self =  this;

    let url =  Pyr.URL(MESSAGES_URL).push(mid);

    return this.getJSON({
      url: url,
      context: self,
      onLoading: self.onLoading
    }).done((data, textStatus, jqXHR) => {
      self.setThread(data.message.thread);

    }).fail((jqXHR, textStatus, errorThrown) => {
      Pyr.Network.ajaxError(jqXHR, textStatus, errorThrown);
    });
  }

  success(data, textStatus, jqXHR) {
    let thread = this.state.thread || [];
    thread = thread.concat(data.message);

    console.log("THREAD LENGTH: " + thread.length);

    this.setThread(thread);

    //this.props.onSetItems(thread);
  }


  componentWillMount() {
    let mid = this.props.message ? this.props.message.id : this.props.messageId;

    if (mid) {
      this.getThread(mid);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    let mid = this.props.message ? this.props.message.id : this.props.messageId;
    let oid = prevProps.message ? prevProps.message.id : prevProps.messageId;

    if (mid != oid) {
      this.getMessage(mid);
    }
  }

  renderHeader(message) {
    return (
      <Header
        job={this.props.job}
        message={message}
        onBack={this.props.onBack}
      />
    );
  }

  renderContent(message) {
    return (
        <Content
          ref={(node) => this.content = (node)}
          message={message}
          thread={this.state.thread}
          onScroll={this.props.onScroll}
          job={this.props.job}
          skipCount={this.props.skipCount}
        >
        </Content>
    );
  }

  renderFooter(message, label="Reply") {
    if (this.props.readOnly) {
      return;
    }
    return (
        <Footer
          message={message}
          onSuccess={this.onSuccess}
          label={label}
          url={this.props.url}
        />
    );
  }

  render() {
    let message = this.state.thread ? this.state.thread[this.state.thread.length-1] : null;
    if (!message) {
      return <Pyr.UI.Loading />
    }

    return (
      <div 
        className={ClassNames("flx-col flx-1 thread").push(this.props.className)}
      >
        {this.renderContent(message)}
        {this.renderFooter(message)}
      </div>
    );
  }
}

export default MessageThread;
export {
  MessageThreadIndexHeader,
  MessageThreadHeader,
};
