import React, { 
  Component
} from 'react';

import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';

import {
  Link
} from 'react-router-dom';


import Pyr from '../../pyr/pyr';
const ClassNames = Pyr.ClassNames;
const Grid = Pyr.Grid;

import {
  MESSAGES_URL,
  JOBS_URL,

} from '../const';

import Page from '../page';
import Sheet from '../sheet';

import {
  UserAvatar
} from '../../util/user';

import RecruiterBlurb from '../shared/recruiter_blurb';

import ThreadItem, { 
  THREAD_ID 
} from './thread_item';

import MessageThread, { 
  MessageThreadHeader,
  MessageThreadIndexHeader
} from './message_thread';
import MessageQA, { MessageQAHeader } from './message_qa';

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
    let ownerClass = (mine ? "mine" : "recruiter");

    let allClass = ClassNames("item message-item flx-row", ownerClass);

    if (!mine && !message.read_at) {
      allClass.push("unread");
    }

    if (message.is_root) {
      allClass.push("new");
    }

    let Header = message.candidate ? MessageThreadIndexHeader : MessageQAHeader;
    let theRecruiter = getRecruiter(this.user(), message);

    return (
      <div className={allClass} id={id}>
        <Grid.Column className="recruiter col-2 d-flex">
          <UserAvatar
            className={"flx-1"}
            userId={theRecruiter.id}
            name={theRecruiter.first_name}
            small
          />
        </Grid.Column>
        <Grid.Column className="content">
          <Grid.Row className=""> 
            <Grid.Column className="col-8">
              <Header className="title" message={message} job={job} isNew={message.is_root}/>
            </Grid.Column>
            <Grid.Column className="col-4 created-at text-right">
              <Pyr.MagicDate date={message.created_at} />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row> 
            <Grid.Column className="">
              <div className="summary">
                {Pyr.Util.summarize(message.body, 300)}
              </div>
            </Grid.Column>
          </Grid.Row>
        </Grid.Column>
      </div>
    );
  }
}

class IndexSheet extends Sheet.Index {
  key(a) {
    return MessagesPage.key(a)
  }

  renderItem(message, isSelected) {
    return ( <MessageItem message={message} job={this.props.jobMap[message.job_id]} isSelected={isSelected}/> );
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

}


class ShowSheet extends Sheet.Show {
  constructor(props) {
    super(props);
  }

  renderHeader(item) {
    if (this.state.isLoading || !item) {
      return (<Pyr.Loading />);
    }

    let message = item.message;

    return (
        <MessageThreadHeader
          message={message}
          job={this.props.jobMap[message.job_id]}
          onBack={this.onBack}
          url={Pyr.URL(MESSAGES_URL)}
        />
    );
  }

  renderItem(item, isSelected) {
    if (this.state.isLoading || !item) {
      return (<Pyr.Loading />);
    }

    let message = item.message;
    let thread = item.thread;

    let MessageRender = message.candidate ? MessageThread : MessageQA;

    return (
      <Pyr.Grid.Row>
        <Pyr.Grid.Col className="col-9 flx-col left">
        <div className="d-flex flx-col">
          <MessageRender
            message={message}
            job={this.props.jobMap[message.job_id]}
            onBack={this.onBack}
            url={Pyr.URL(MESSAGES_URL)}
            onSetItems={this.props.onSetItems}
            onAddItem={this.props.onAddItem}
          />
        </div>
        </Pyr.Grid.Col>
        <Pyr.Grid.Col className="right">
        <RecruiterBlurb className="" recruiter={getRecruiter(this.user(), message)} />
        </Pyr.Grid.Col>
      </Pyr.Grid.Row>
    );
  }


  key(a) {
    return MessagesPage.key(a)
  }

}

///////////////

class MessagesPage extends Page {
  getInitState(props) {
    return Object.assign(super.getInitState(props), { 
      fullDetail: true,
    });
  }

  constructor(props) {
    super(props);
    //this.onSetItems = this.setItems.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.jobs != prevProps.jobs) {
      let jobs = this.props.jobs || [];
      this.jobMap = jobs.reduce((m, o) => {m[o.id] = o; return m;}, {});
    }
  }

  reduceItems(messages) { // throw out all but the last from the thread

    messages = messages || [];
    let threads = messages.reduce((mmap, msg) => {
      let threadId = msg.root_message_id || msg.id;

      if (!mmap[threadId] || mmap[threadId].id < msg.id) {

        let job = this.jobMap[msg.job_id]; // FIXME, if job not here go fetch it
        console.log("MINE: " + msg.from_user_id + ":" + this.context.user.id);
        let mine = (msg.from_user.id == this.context.user.id);
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
    this.props.onSetButtonCount("Messages", count);
    super.setItems(items);
  }

  loadSelected(itemId, onLoading) {
    console.log("GET ITEM: " + itemId);

    let me = this;

    Pyr.getJSON({
      url: Pyr.URL(MESSAGES_URL).push(itemId),
      context: me,
      loading: onLoading,

    }).done(function(data, textStatus, jaXHR) {
        me.onSelect(data);

    }).fail(function(jaXHR, textStatus, errorThrown) {
      Pyr.ajaxError(jaXHR, textStatus, errorThrown);
    });
  }

  getSelected() {
    return this.state.selected;
  }

  loadItems(onLoading) {
    console.log("GET ITEMS..." + this.constructor.name);
    console.log(MESSAGES_URL);

    let me = this;

    Pyr.getJSON({
      url: Pyr.URL(MESSAGES_URL),
      context: me,
      loading: onLoading,

    }).done(function(data, textStatus, jaXHR) {
        me.setItems(data.messages);

    }).fail(function(jaXHR, textStatus, errorThrown) {
      Pyr.ajaxError(jaXHR, textStatus, errorThrown);
    });
  }

  setSelected(selected) {
    selected.read_at = new Date();
    super.setSelected(selected);
  }

  indexSheet() {
    return (
      <IndexSheet 
        {...this.props} 
        items={this.state.items}
        jobMap={this.jobMap}
        selected={this.getSelected()}
        onSetAction={this.props.onSetAction}
        onSetUnaction={this.props.onSetUnaction}
        onSelect={this.onSelect}
        onUnselect={this.onUnselect}
        onLoadItems={this.onLoadItems}
      />
    );
  }
  
  actionSheet(action) {
    let sheet = Sheet.sheetComponent(action || "Show");
    let ActionSheet = eval(sheet);

    //alert("actionSheet: " + this.state.selected.id);

    return (
      <ActionSheet 
        {...this.props}
        jobMap={this.jobMap}
        selected={this.getSelected()}
        onSetItems={this.onSetItems}
        onAddItem={this.onAddItem}
        onSetAction={this.props.onSetAction}
        onSetUnaction={this.props.onSetUnaction}
        onLoadSelected={this.onLoadSelected}
      />
    );
    
  }
}

function key(item) {
  return "message-" + item.id;
}
MessagesPage.key = key;
export default MessagesPage;
