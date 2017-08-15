import React, { 
  Component
} from 'react';

import ReactDOM from 'react-dom';

import Pyr from '../../pyr/pyr';
const ClassNames = Pyr.ClassNames;

import ThreadItem, {
  THREAD_ID
} from './thread_item';

const SCROLL_TIME = 800;

const MESSAGES_URL = "/messages";


const MessageThreadHeader = (props) => (
  <div className="message-header" {...Pyr.Util.propsRemove(props, ["job", "message", "isNew"])}>{props.isNew ? "New ": ""}Candidate: <span>{props.job.title}</span></div>
);

const Header = (props) => (
  <div className="message-header">
      <div className="align-self-left back"><a href="#" onClick={props.onBack}>Back</a></div>
      <div className="align-self-center title">{props.message.job.title}</div>
  </div>
);

class ThreadList extends Component {
  render() {
    if (!this.props.thread || this.props.thread.length < 1) {
      return (<Pyr.Loading />);
    }
  
    let thid = "thread-" + this.props.selected.root_message_id || this.props.selected.id;
  
    return (
      <div id={thid} className="message-thread flx-1">
        {
          this.props.thread.map((msg, pos) => {
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

    console.log("SCROLLING TO ITEM: " + mid);
    this.scroll.scrollToItem($item);
  }

  componentDidUpdate(prevProps, prevState) {
    let oldLength = prevProps.thread ? prevProps.thread.length : 0;
    let newLength = this.props.thread ? this.props.thread.length : 0;

    console.log("UPDATE: " + oldLength + " => " + newLength);

    if (oldLength != newLength) {
      this.scrollToLastRead(oldLength == 0);
    }
  }

  render() {

    if (!this.props.thread || this.props.thread.length < 1) {
      return (<Pyr.Loading />);
    }
    //console.log("SHOW INNNER!");

    return (
      <Pyr.Scroll
        ref={(node) => this.scroll = node}
        id="message-show" 
        onScroll={this.props.onScroll}
      >
        <ThreadList
          thread={this.props.thread}
          selected={this.props.message}
          jobMap={this.props.jobMap}
        />
      </Pyr.Scroll>
    );
  }
}

class Footer extends Component {
  render() {
    return (
      <div className="message-footer z-depth-1">
        <Pyr.Form.Form
          model="message"
          url={Pyr.URL(this.props.url).push(this.props.message.id)}
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


class MessageThread extends Pyr.UserComponent {

  constructor(props) {
    super(props);
    this.state = {
      thread: null
    };

    this.onLoading = null;
    this.onSuccess = this.success.bind(this);
  }

  threadExtra(thread) {
    let all = [];
    let userId = this.context.user.id;

    thread.map((item, pos) => {
      item.is_root = !item.root_message_id;
      item.mine = (item.from_user.id == userId);
      item.read_at = new Date(); // got it so pretend it's been read, server is updating
    });

    return thread;
  }

  setThread(thread) {
    this.setState({
      thread: this.threadExtra(thread)
    });
  }

  getThread(mid) {
    let self =  this;

    let url =  Pyr.URL(MESSAGES_URL).push(mid);

    return Pyr.getJSON({
      url: url,
      context: self,
      loading: self.onLoading
    }).done(function(data, textStatus, jaXHR) {
      self.setThread(data.thread);

    }).fail(function(jaXHR, textStatus, errorThrown) {
      Pyr.ajaxError(jaXHR, textStatus, errorThrown);
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

  renderHeader() {
    return (
        <Header
          message={this.props.message}
          onBack={this.props.onBack}
        />
    );
  }

  renderContent() {
    return (
        <Content
          ref={(node) => this.content = (node)}
          onScroll={this.props.onScroll}
          message={this.props.message}
          thread={this.state.thread}
          jobMap={this.props.jobMap}
        >
        </Content>
    );
  }

  renderFooter(label="Reply") {
    return (
        <Footer
          message={this.props.message}
          onSuccess={this.onSuccess}
          label={label}
          url={this.props.url}
        />
    );
  }

  render() {
    return (
      <div className="flx-col-stretch flx-1 sheet thread">
        {this.renderHeader()}
        {this.renderContent()}
        {this.renderFooter()}
      </div>
    );
  }
}

export default MessageThread;
export {
  MessageThreadHeader
};
