
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

import Avatar from '../shared/avatar';

import Recruiter from '../shared/recruiter';
import Job from '../shared/job';

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

class MessageItem extends Sheet.Item {
  render() {
    let message = this.props.message;
    //console.log(JSON.stringify(message));

    let job = this.props.job;

    let id = MID(message);

    let mine = message.mine;
    let ownerClass = (mine ? "mine" : "other");

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
    let other = message.other;

    //console.log("THE MESSAGE");
    //console.log(message);

    let summary = Pyr.Util.summarize(message.body, 400);
    summary = summary || "";
    if (summary.length == 0) {
      summary = "(No message)";
    }

    return (
      <div className={allClass} id={id}>
        <div className="other flx-col">
          <Avatar.Avatar
            className={"mt-auto mb-auto"}
            userId={other.id}
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
    let meIsRecruiter = this.user().is_recruiter;
    let other = this.props.other;

    if (meIsRecruiter) {
      return (
        <Job.Blurb job={this.props.job} />
      );
    }

    return (
      <Recruiter.Blurb recruiter={other} />
    );
  }
}


class ShowSheet extends Sheet.Show {
  constructor(props) {
    super(props);

    this.initState({
      thread: null
    });
  }

  size() {
    return 3;
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

/********
  setThread(thread) {
    if (thread) {
      thread = thread.slice();
    }

    this.setState({
      thread
    });
  }

  loadThread(itemId) {
    let url = Pyr.URL(MESSAGES_URL).push(itemId).push('thread');

    this.getJSON({
      url: url,
      onLoading: this.onLoading,
      context: this
    }).done((data, textStatus, jqXHR) => {
      this.setThread(data.messages);
    });
  }

  componentDidMount() {
    if (this.props.itemId) {
      this.loadThread(this.props.itemId);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.itemId != prevProps.itemId) {
      this.setThread(null);
      this.loadThread(this.props.itemId);
    }
  }
*/

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
    let job = message.job;
    let candidate = message.candidate;
    let other = message.other;

    let ThreadRender = message.candidate ? MessageThread : MessageQA;

    return (
     <div className="item flx-1 flx-row">
        <div className="flx-col flx-3 left">
          <div className="job-title">{job.title}</div>
          <ThreadRender
            message={message}
            job={job}
            candidate={candidate}
            other={other}
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
            candidate={candidate}
            other={other}
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
  name() {
    return "Messages";
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

  loader() {
    return this.props.loaders.messages;
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
