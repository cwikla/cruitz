
import React from 'react';
import PropTypes from 'prop-types';
import PusherJS from 'pusher-js';

import BaseComponent from './base';
import Util from './util';

PusherJS.logToConsole = true;

const PusherContextTypes = {
  pusher: PropTypes.object,
};

class Provider extends BaseComponent {
  static childContextTypes = {
    pusher: PropTypes.object,
  };

  getChildContext() {
    return {
      pusher: {
        onListen : this.onListen,
        onForget : this.onForget,
      }
    };
  }

  constructor(props) {  
    super(props);

    this.onSuccess = this.success.bind(this);
    this.onError = this.error.bind(this);


   
    this.pusher = null; 
    this.channel = null; // this.addChannel("private-" + this.props.userId);

    this.onListen = this.listen.bind(this);
    this.onForget = this.forget.bind(this);
  }

  success(status) {
    console.log("----- Pusher success ---- ");
    console.log(status);
    console.log("+++++ Pusher end sucess +++++");
  }

  error(status) {
    console.log("------ Pusher error -----");
    console.log(status);
    console.log("++++++ Pusher end error +++++");
  }

  privateChannel() {
    return this.channel;
  }

  releasePrivate() {
    if (this.channel) {
      this.channel.unbind();
      this.channel.unsubscribe("private-" + this.props.userId);
      this.channel = null;
    }
  }

  getPusherJS(pusher) {
    if (!pusher || !pusher.key) {
      return null;
    }

    return new PusherJS(pusher.key, {
        authEndpoint: Util.URL("/pusher/auth").toRemote(),
        cluster: pusher.cluster || 'us2',
        encrypted: pusher.encrypted,
      });
  }

  componentDidMount() {
    if (!this.props.pusher || !this.props.pusher.key) {
      return;
    }

    this.pusher = this.getPusherJS(this.props.pusher);
    this.channel = this.addChannel("private-" + this.props.userId);
  }

  componentWillUnmount() {
    this.releasePrivate();
    this.pusher = null;
  }

  componentDidUpdate(prevProps, prevState) {
    if (!this.props.pusher || !this.props.pusher.key) {
      return;
    }

    if (this.props.pusher && !this.pusher) {
      this.pusher = this.getPusherJS(this.props.pusher);
    }

    if (this.props.userId != prevProps.userId) {
      this.releasePrivate();
      this.channel = this.addChannel("private-" + this.props.userId);
    }
  }

  addChannel(name) {
    let channel = this.getChannel(name);
    channel.bind("pusher:subscription_error", this.onError);
    channel.bind("pusher:subscription_succeeded", this.onSuccess);

    return channel;
  }

  getChannel(name) {
    if (name) {
      return this.pusher.subscribe(name);
    }
    return this.privateChannel();
  }

  listen(args) {
    if (!this.pusher) {
      return;
    }

    let channel = this.getChannel(args.channelName);

    channel.bind(args.eventName, data => {
      if (args.onEvent) {
        args.onEvent(data);
      }
      console.log("Listening to " + args.eventName);
    });
  }

  forget(args) {
    if (!this.pusher) {
      return;
    }

    let channel = this.getChannel(args.channelName);

    channel.unbind(eventName, data => {
      if (args.onForget) {
        args.onForget(data); 
      }
      console.log("Stopped listening to " + args.eventName);
    });
  }

  render() {
    return this.props.children;
  }
}

class PusherComponent extends BaseComponent {
  static contextTypes = PusherContextTypes;

  componentDidMount() {
    if (!this.context.pusher) {
      return;
    }

    console.log("PUSHER COMP CONTEXT");
    console.log(this.context);

    this.context.pusher.onListen({
      channelName: this.props.channel,
      eventName: this.props.event,
      func: this.props.onEvent,
    });
  }

  componentWillUnmount() {
    if (!this.context.pusher) {
      return;
    }

    this.context.pusher.onForget({
      channelName: this.props.channel,
      eventName: this.props.event,
      func: this.props.onForget,
    });
  }

  render() {
    return null;
  }

}

const Pusher = {
  Provider,
  Pusher : PusherComponent
};

export default Pusher;
