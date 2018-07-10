
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
  CANDIDATES_URL,

  MESSAGES_PAGE,

} from '../const';

import Page from '../page';
import Sheet from '../sheet';

import Avatar from '../shared/avatar';

import Recruiter from '../shared/recruiter';
import Job from '../shared/job';
import State from '../shared/state';

import MessageThread, { 
  MessageThreadIndexHeader
} from './message_thread';

import MessageQA, { 
  MessageQAHeader 
} from './message_qa';

function MID(message) {
  return "message-" + message.id;
}

class MessageItem extends Sheet.Item {
  render() {
    let rootMessage = this.props.rootMessage;
    let message = this.props.message;
    let candidate = this.props.candidate;

    let other = rootMessage.other;
    let count = rootMessage.count;

    let job = this.props.job;

    let id = MID(message);

    let mine = message.mine;
    let ownerClass = (mine ? "mine" : "other");

    let allClass = ClassNames("item message-item flx-col", ownerClass);

    let unread = !mine && !message.read_at;

    if (unread) {
      allClass.push("unread");
    }

    if (this.props.isSelected) {
      allClass.push("selected");
    }

    let Header = candidate ? MessageThreadIndexHeader : MessageQAHeader;

    //console.log("THE MESSAGE");
    //console.log(message);

    let summary = Pyr.Util.summarize(message.body, 155);
    summary = summary || "";
    if (summary.length == 0) {
      summary = "(No message)";
    }

    return (
      <div className={allClass} id={id}>
        <div className="other flx-row">
          <Avatar.Avatar
            className={"mb-auto"}
            user={other}
            small
          />
          <div className="flx-col flx-1">
            <div className="ml-auto">
              <Pyr.UI.MagicDate date={message.created_at} short={true}/>
            </div>
            <div className="flx-row flx-1"><Header className="title flx-row mr-auto" message={message} job={job} isNew={unread}/><div className="ml-auto">({count})</div></div>
          </div>
        </div>
        <div className="flx-col flx-1">
          <div className="summary mr-auto flx-1">
            {summary}
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

  getCandidate(msg) {
    if (!msg) {
      return null;
    }

    if (this.props.candidatesMap) {
      return this.props.candidatesMap[msg.candidate.id]; // override with livelier version
    }

    return msg.candidate;
  }

  getJob(msg) {
    //console.log("GET JOB");
    //console.log(msg);

    if (!msg) {
      return null;
    }

    if (this.props.jobsMap) {
      return this.props.jobsMap[msg.job_id]; // override with livelier version
    }

    return msg.job;
  }


  renderItem(message, isSelected) {
    let rootMessage = message;
    let lastMessage = rootMessage.last_message ? rootMessage.last_message : rootMessage;

    return ( <MessageItem 
      rootMessage={rootMessage}
      message={lastMessage} 
      candidate={this.getCandidate(rootMessage)}
      job={this.getJob(rootMessage)}
      isSelected={isSelected}/> 
    );
  }

  renderHeader() {
    return (
      <div className="flx-row">
        <div className="mr-auto">Messages</div>
        <Pyr.UI.MenuToggle title="Sort" name="sort">
          <Pyr.UI.MenuToggleItem>Date</Pyr.UI.MenuToggleItem>
          <Pyr.UI.MenuToggleItem>Unread</Pyr.UI.MenuToggleItem>
          <Pyr.UI.MenuToggleItem>Position</Pyr.UI.MenuToggleItem>
        </Pyr.UI.MenuToggle>
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

  getCandidate(msg) {
    if (!msg) {
      return null;
    }

    if (this.props.candidatesMap) {
      return this.props.candidatesMap[msg.candidate.id] || msg.candidate; // override with livelier version
    }

    return msg.candidate;
  }

  getJob(msg) {
    if (!msg) {
      return null;
    }

    if (this.props.jobsMap) {
      return this.props.jobsMap[msg.job_id]; // override with livelier version
    }

    return msg.job;
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

  renderCandidateMini(candidate) {
    if (!candidate) {
      return null;
    }

    let url = Pyr.URL(CANDIDATES_URL).push(candidate.job_id).push(candidate.id);

    if (!candidate.is_unlocked) {
      return (
        <div className="section flx-col candidate-mini new">
          <Link to={url.toString()} className="flx-row flx-1">
            <div className="flx-col flx-1">
              <div>You have a new candidate: {candidate.summary}</div>
              <div>You can respond to this recruiter and see more about this candidate <span className="font-secondary-color">here</span>.</div>
            </div>
            <div className="mb-auto">
              <Pyr.UI.Icon name="lock" />
            </div>
          </Link>
        </div>
      );
    }

    let stateName = State.toName(candidate.state);

    return (
      <Link to={url.toString()}>
      <div className={ClassNames("section flx-row candidate-mini")} >
          <div className="flx-col flx-1">
            <div className="mr-auto">{candidate.first_name} {candidate.last_name}</div>
            <div className="mr-auto">{candidate.summary}</div>
          </div>
          <div className={ClassNames("flx-col")}>
            <div className={ClassNames("ml-auto")}><State.Bubble state={candidate.state} /></div>
            <span className="more ml-auto mt-auto">More...</span>
          </div>
      </div>
      </Link>
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
    let candidate = this.getCandidate(message);

    if (!candidate) {
      console.log("Message " + message.id + " has no candidate");
      return null;
    }

    let job = this.getJob(message);
    let other = message.other;


    let ThreadRender = candidate ? MessageThread : MessageQA;

    return (
     <div className="item flx-1 flx-row">
        <div className="flx-col flx-3">
          <Sheet.ShowHeader className="job-title" title={job.title} nextId={this.props.nextId} prevId={this.props.prevId} url={MESSAGES_URL}/>
          { this.renderCandidateMini(candidate) }
          <ThreadRender
            message={message}
            job={job}
            candidate={candidate}
            onBack={this.onBack}
            url={Pyr.URL(MESSAGES_URL)}
            onSetItems={this.props.onSetItems}
            onAddItem={this.props.onAddItem}
            onSetLast={this.props.onSetLast}
            readOnly={!candidate.is_unlocked}
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
  constructor(props) {
    super(props); 

    this.onSetLast = this.setLast.bind(this);
  }

  name() {
    return "Messages";
  }

  loader() {
    return this.props.loaders.messages;
  }

  setLast(item, last) {
    let newItem = Object.assign({}, item, {last_message: last, count: (item.count+1)});
    this.loader().replace(newItem);
  }


  getIndexSheet() {
    return IndexShowSheet;
  }

  getActionSheet(action) {
    if ((action || "show").toLowerCase() == "show") {
      return IndexShowSheet;
    }

    let sheet = Sheet.sheetComponent(action || "Show");
    let ActionSheet = eval(sheet);

    return ActionSheet;
  }

  pageProps() {
    return Object.assign({}, super.pageProps(), {onSetLast: this.onSetLast});
  }

}

function key(item) {
  return "message-" + item.id;
}

MessagesPage.key = key;

export default MessagesPage;
