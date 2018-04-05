
import React from 'react';
import PropTypes from 'prop-types';

import {
  Link
} from 'react-router-dom';


import Pyr, {
  Component
} from '../../pyr/pyr';
const ClassNames = Pyr.ClassNames;
const Grid = Pyr.Grid;

import {
  MESSAGES_URL,
  JOBS_URL,

  MESSAGES_PAGE,

} from '../const';

import Page from '../page';
import Sheet from '../sheet';

import {
  UserAvatar
} from '../shared/user';

import Recruiter from '../shared/recruiter';
import Job from '../shared/job';

import ThreadItem, { 
  THREAD_ID 
} from './thread_item';

import MessageThread, { 
  MessageThreadHeader,
  MessageThreadIndexHeader
} from './message_thread';

import MessageQA, { 
  MessageQAHeader 
} from './message_qa';

import NavBar from './messages_nav';

function MID(message) {
  return "message-" + message.id;
}

function getRecruiter(user, message) {
  if (message.user.id == user.id) {
    return message.from_user;
  }
  return message.user;
}

class MessageItem extends Sheet.Item {
  render() {
    let message = this.props.message;
    //console.log(JSON.stringify(message));

    let job = this.props.job;

    let id = MID(message);

    let mine = message.mine;
    let ownerClass = (mine ? "mine" : "recruiter"); // FIXME

    let allClass = ClassNames("item message-item flx-row", ownerClass);

    if (!mine && !message.read_at) {
      allClass.push("unread");
    }

    if (!message.read_at) {
      allClass.push("new");
    }

    if (message.candidate) {
      allClass.push(message.candidate.state);
    }

    if (this.props.isSelected) {
      allClass.push("selected");
    }

    let Header = message.candidate ? MessageThreadIndexHeader : MessageQAHeader;
    let theRecruiter = getRecruiter(this.user(), message);

    //console.log("THE MESSAGE");
    //console.log(message);

    let summary = Pyr.Util.summarize(message.body, 400);
    summary = summary || "";
    if (summary.length == 0) {
      summary = "(No message)";
    }

    return (
      <div className={allClass} id={id}>
        <div className="recruiter flx-col">
          <UserAvatar
            className={"mt-auto mb-auto"}
            userId={theRecruiter.id}
            small
          />
        </div>
        <div className="flx-col flx-1">
          <div className="ml-auto">
              <Pyr.UI.MagicDate date={message.created_at} short/>
          </div>
          <Header className="title flx-row" message={message} job={job} isNew={!message.read_at}/>
          <div className="summary mt-auto flx-1">
            { summary }
          </div>
        </div>
      </div>
    );
  }
}

class IndexSheet extends Sheet.Index {
  key(a) {
    return MessagesPage.key(a)
  }

  sortItems(items) {
    return items.sort((x, y) => (y.root_msg_id || y.msg_id) - (x.root_msg_id || y.msg_id));
  }


  renderItem(message, isSelected) {
    return ( <MessageItem message={message} job={message.job} isSelected={isSelected}/> );
  }

  renderHeader() {
    return (
      <div className="flx-row">
        <div className="mr-auto">Messages</div>
        <div className="dropdown ml-auto">
          <Pyr.UI.IconButton name="sort" className="dropdown-toggle" id="messageSortMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" />
          <div className="dropdown-menu" aria-labelledby="messageSortMenuButton">
            <label className="dropdown-header">Sort</label>
            <div className="dropdown-divider"></div>
            <label className="dropdown-item" >Date</label>
            <label className="dropdown-item" >Unread</label>
            <label className="dropdown-item" >Position</label>
          </div>
        </div>
      </div>
    );
  }

}

class SideBlurb extends Component {
  render() {
    let isRecruiter = this.user().is_recruiter;

    if (isRecruiter) {
      return (
        <Job.Blurb job={this.props.job} />
      );
    }

    if (!isRecruiter) {
      return (
        <Recruiter.Blurb recruiter={getRecruiter(this.user(), this.props.message)}/>
      );
    }
  }
}


class ShowSheet extends Sheet.Show {
  size() {
    return 3;
  }

  unused_renderHeader(item) {
    //if (this.state.isLoading || !item) {
      //return (<Pyr.UI.Loading />);
    //}

    let message = item;
    let job = message.job;

    return (
        <MessageThreadHeader
          message={message}
          job={job}
          onBack={this.onBack}
          url={Pyr.URL(MESSAGES_URL)}
          nextId={this.props.nextId}
          prevId={this.props.prevId}
        />
    );
  }

  renderNone() {
    return (
      <div className="empty flx-1 flx-row-stretch">
        <div className="flx-1 flx-col-stretch flx-align-center ml-auto mr-auto">
          <div className="">Welcome to <b>cruitz</b>!</div>
          <p/>
          <div>Since you are new here, you have no messages.  To begin, start by creating a <Link to={JOBS_URL}>new Job</Link></div>
          <div>which will automatically alert our network of recruiters to your needs. As recruiters find</div>
          <div>and submit candidates, you will begin to receive messages that might be questions about the job</div>
          <div>or candidates for you to review.</div>
        </div>
      </div>
    );
  }


  renderItem(item, isSelected) {
    if (this.state.isLoading || !this.props.items) {
      return (<Pyr.UI.Loading />);
    }

    if (!item) {
        return null;
    }

    //console.log("MESSAGE JOB");
    //console.log(item);

    let message = item;
    let thread = message.thread;
    let job = message.job;

    let MessageRender = message.candidate ? MessageThread : MessageQA;

    return (
     <div className="item flx-1 flx-row">
        <div className="flx-col flx-3 left">
          <div className="job-title">{job.title}</div>
          <MessageRender
            message={message}
            job={job}
            onBack={this.onBack}
            url={Pyr.URL(MESSAGES_URL)}
            onSetItems={this.props.onSetItems}
            onAddItem={this.props.onAddItem}
          />
        </div>
        <div className="flx-1 blurb right">
          <SideBlurb 
            message={message} 
            job={job}
          />
        </div>
      </div>
    );
  }


  key(a) {
    return MessagesPage.key(a)
  }

}

class IndexShowSheet extends Sheet.IndexShow {
  renderIndex() {
    return (
        <IndexSheet 
          {...this.props} 
        />
    );
  }

  renderShow() {
    return (
        <ShowSheet 
          {...this.props}
        />
    );
  }
}

///////////////

class MessagesPage extends Page {
  constructor(props) {
    super(props);

    this.initState({
      fullDetail: true,
    });
  }

  name() {
    return "Messages";
  }

  reduceItems(messages) { // throw out all but the last from the thread

    messages = messages || [];
    let threads = messages.reduce((mmap, msg) => {
      let threadId = msg.root_message_id || msg.id;

      if (!mmap[threadId] || mmap[threadId].id < msg.id) {

        let job = msg.job;
        //console.log("MINE: " + msg.from_user_id + ":" + this.user().id);
        let mine = (msg.from_user.id == this.user().id);
        let is_root = !msg.root_message_id;

        mmap[threadId] = Object.assign({}, msg, { job, mine, is_root});
      }
      return mmap;
    }, {});

    return Object.values(threads);

  }

  setItemCompare(a, b) {
    return (a.root_message_id == b.root_message_id);
  }

  setItemOld(item) {
    if (!item) {
      return;
    }
    //console.log("SET ITEM: " + item);

    let result = this.reduceItems(item);
    super.setItem(result[0]);
  }

  setItems(items) {
    items = this.reduceItems(items);
    let count = items.reduce((sum, msg) => {
      sum = sum + ((msg.mine || msg.read_at) ? 0 :1);
      return sum;
    }, 0);
    this.props.onSetPageItemsCount(MESSAGES_PAGE, count);

    let first = items ? items[0] : null;
    //console.log("SET FIRST SELECTED");
    //console.log(first);

    if (first) {
      this.loadSelected(first.id);
    }

    //console.log("MMMMM");
    //console.log(items);

    super.setItems(items);
  }

  loadSelected(itemId, onLoading) {
    //console.log("MESSAGES GET ITEM: " + itemId);

    if (!itemId) {
      return;
    }

    let me = this;

    this.getJSON({
      url: Pyr.URL(MESSAGES_URL).push(itemId),
      context: me,
      onLoading: onLoading,

    }).done((data, textStatus, jqXHR) => {
        //console.log("LOADED SELECTED");
        //console.log(data.message);

        me.onSelect(data.message);

    });
  }

  getSelected() {
    return this.state.selected;
  }

  loadItems(onLoading) {
    //console.log("MESSAGES GET ITEMS..." + this.constructor.name);
    //console.log(MESSAGES_URL);

    let me = this;

    return this.getJSON({
      url: Pyr.URL(MESSAGES_URL),
      context: me,
      onLoading: onLoading,

    }).done((data, textStatus, jqXHR) => {
        me.setItems(data.messages);

    });
  }

  getNext(item) {
    let allItems = this.getItems();

    if ((item == null) || !allItems || (allItems.length == 1)) {
      return null;
    }

    for(let i=0;i<allItems.length-1;i++) {
      if (allItems[i].id == item.id) {
        return allItems[i+1].id;
      }
    }
    return null;
  }

  getPrevious(item) {
    let allItems = this.getItems();

    if ((item == null) || !allItems || (allItems.length == 1)) {
      return null;
    }

    for(let i=1;i<allItems.length;i++) {
      if (allItems[i].id == item.id) {
        return allItems[i-1].id;
      }
    }
    return null;
  }

  setSelected(selected) {
    //console.log("SET SELECTED!");

    if (selected) {
      selected.read_at = new Date();
    }
    super.setSelected(selected);

    let nextId = this.getNext(selected);
    let prevId = this.getPrevious(selected);

    this.setState({
      nextId,
      prevId,
    });
  }

  getIndexSheet() {
    return IndexShowSheet;
  }

  getActionSheet(action) {
    let sheet = Sheet.sheetComponent(action || "Show");
    let ActionSheet = eval(sheet);

    return ActionSheet;
  }

}

function key(item) {
  return "message-" + item.id;
}

MessagesPage.key = key;
//MessagesPage.NavBar = NavBar;

export default MessagesPage;
