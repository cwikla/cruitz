
import React from 'react';

import Pyr, {
  Component
} from '../../pyr/pyr';
const ClassNames = Pyr.ClassNames;

import Sheet from '../sheet';
import Avatar, {
} from '../shared/avatar';

function THREAD_ID(message) {
  return "thread-item-" + message.id;
}

const OtherAvatar = (props) => (
  <Avatar.Avatar 
    user={props.user}
    name={props.user.first_name}
    small={true}
  />
);

class ThreadItem extends Sheet.Item {
  render() {
    //console.log("THREAD ITEM");
    //console.log(this.props);

    let message = this.props.message; 
    let job = this.props.job;
    let candidate = this.props.candidate;
    let other = this.props.other;

    let mine = this.props.mine;
    let ownerClass = (mine ? "mine" : "yours");

    let id = THREAD_ID(message);
    //console.log("RENDER THREADID: " + id);

    let allClass = ClassNames("thread-item flx-col", ownerClass);
    if (!mine && !message.read_at) {
      allClass.push("unread");
    }
    if (!message.root_message_id) {
      allClass.push("root");
    }

    let leftAvatar = null;
    let rightAvatar = null;

    if (!mine) {
      leftAvatar = !mine ? <OtherAvatar user={other} /> : null;
    }

    //let rightAvatar = !mine ? this.renderAvatar(message) : null;

    let justify = ClassNames("flx-row flx-1");
    if (mine) {
      justify.push("justify-content-end");
    }

    return (
      <div className={allClass} id={id}>
        <Pyr.UI.MagicDate date={message.created_at} className={ClassNames("created-at").push(mine ? "ml-auto" : "mr-auto")}/>
        <div className={justify}>
          { leftAvatar }
          <div className="item-content mt-auto mb-auto">{message.body}</div>
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
