
import React, { 
  Component
} from 'react';

import ReactDOM from 'react-dom';

import Pyr from '../../pyr/pyr';
const ClassNames = Pyr.ClassNames;
import Sheet from '../sheet';
import UserIcon from '../../util/icon';

function THREAD_ID(message) {
  return "thread-item-" + message.id;
}

class ThreadItem extends Sheet.Item {
  renderIcon(message) {
    return (
      <UserIcon 
        userId={message.from_user.id}
        name={message.from_user.first_name}
      />
    );
  }

  render() {
    let message = this.props.message;
    let job = this.props.job;

    let mine = message.mine;
    let ownerClass = (mine ? "mine" : "yours");

    let id = THREAD_ID(message);
    console.log("RENDER THREADID: " + id);
    let allClass = ClassNames("thread-item", ownerClass);
    if (!message.mine && !message.read_at) {
      allClass.push("unread red");
    }

    let leftIcon = mine ? this.renderIcon(message) : null;
    let rightIcon = mine ? null : this.renderIcon(message);

    let justify = ClassNames("flx-row flx-1");
    if (!mine) {
      justify.push("justify-content-end");
    }

    return (
      <div className={allClass} id={id}>
        <div className={justify.concat("created-at")}>
          <Pyr.MagicDate date={message.created_at} />
        </div>
        <div className={justify}>
          { leftIcon }
          <div className="flx-col justify-content-center">
            <div className={" content flx-0"}>{id}-{message.body}</div>
          </div>
          { rightIcon }
        </div>
      </div>
    );
  }
}

export default ThreadItem;
export {
  THREAD_ID
};