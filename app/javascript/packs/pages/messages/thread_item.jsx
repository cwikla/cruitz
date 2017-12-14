
import React, { 
  Component
} from 'react';

import ReactDOM from 'react-dom';

import Pyr from '../../pyr/pyr';
const ClassNames = Pyr.ClassNames;
import Sheet from '../sheet';
import {
  UserAvatar 
} from '../../util/user';

function THREAD_ID(message) {
  return "thread-item-" + message.id;
}

class ThreadItem extends Sheet.Item {
  renderAvatar(message) {
    return (
      <UserAvatar 
        userId={message.from_user.id}
        name={message.from_user.first_name}
      />
    );
  }

  render() {
    let message = this.props.message;
    let job = this.props.job;

    let mine = message.mine;
    let ownerClass = (mine ? "mine" : "recruiter");

    let id = THREAD_ID(message);
    //console.log("RENDER THREADID: " + id);
    let allClass = ClassNames("thread-item", ownerClass);
    if (!message.mine && !message.read_at) {
      allClass.push("unread");
    }
    if (!message.root_message_id) {
      allClass.push("root");
    }

    let leftAvatar = mine ? this.renderAvatar(message) : null;
    let rightAvatar = mine ? null : this.renderAvatar(message);

    let justify = ClassNames("flx-row flx-1");
    if (!mine) {
      justify.push("justify-content-end");
    }

    return (
      <div className={allClass} id={id}>
        <div className={justify.concat("created-at")}>
          <Pyr.UI.MagicDate date={message.created_at} />
        </div>
        <div className={justify}>
          { leftAvatar }
          <div className="flx-col justify-content-center">
            <div className="item-content flx-0">{message.body}</div>
          </div>
          { rightAvatar }
        </div>
      </div>
    );
  }
}

export default ThreadItem;
export {
  THREAD_ID
};
