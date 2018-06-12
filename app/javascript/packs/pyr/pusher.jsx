
const PUSHER_ID = 'c9b6d0b4647c88393e62';
Pusher.logToConsole = true;

class PusherObj {
  constructor(uid) {

    this.pusher = new Pusher(PUSHER_ID, {
      cluster: 'us2',
      encrypted: true
    });

    this.channel = this.pusher.subscribe("private-" + uid);
  }

  listen(eventName, f) {
    this.channel.bind(eventName, data => {
      if (f) {
        f(data);
      }
      console.log("Listening to " + eventName);
    });
  }

  forget(eventname, f) {
    this.channel.unbind(eventName, data => {
      if (f) {
        f(data); 
      }
      console.log("Stopped istening to " + eventName);
    });
  }
}
