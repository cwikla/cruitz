
import BaseComponent from './base';
import uuid from 'uuid';
import Util from './util';

const POST = 'POST';
const GET = 'GET';
const DELETE = 'DELETE';
const PATCH  = 'PATCH';
const PUT = 'PUT';

const UPLOAD_URL = "/uploads/make";

// const PUT removed to catch them all

const Method = {
  POST,
  PUT,
  PATCH,
  GET,
  DELETE
};


function _ajaxError(jqXHR, textStatus, errorThrown) {
  console.log(jqXHR);
  console.log(textStatus)
  console.log("AJAX Error: " + errorThrown);
}


function _getJSON(stuff) {
  let url = stuff.url;
  let data = stuff.data;
  let method = stuff.method || stuff.type || Method.GET;

  if (typeof url == 'string') {
    url = Util.URL(url);
  }

  data = data || url.data().toString();

  if (stuff.remote) {
    url.setRemote(stuff.remote);
  }

  url = url.toRemote();

  //console.log("GETJSON: " + url);
  //console.log(data);

  stuff = Object.assign({
    dataType: "json",
    type: method,
  }, stuff, {
    url: url,
    data: data
  });

  let onLoading = stuff.onLoading ? stuff.onLoading : null;
  if (!onLoading) {
    onLoading = stuff.loading; // backwards
  }

  let oldBeforeSend = stuff.beforeSend;
  let beforeSend = (jqXHR, settings) => {
    if (oldBeforeSend) {
      oldBeforeSend(jqXHR, settings);
    }
    if (onLoading) {
      //console.log("CALLING ON LOADING");
      onLoading(true);
    }
  };

  stuff.beforeSend = beforeSend;

  //console.log("STUFF");
  //console.log(stuff);

  let ajx = $.ajax(
    stuff
  )
  .always(() => {
    if (onLoading) {
      //console.log("CALLING ON LOADING FALSE");
      onLoading(false);
    }
  });
  ajx.uuid = uuid.v4();
  return ajx;
}

class Connector {
  constructor() {
    this.ajaxii = {};
  }

  abortJSON(uuid) {
    let old = this.ajaxii;

    if ($.isEmptyObject(old)) {
      return;
    }

    if (uuid) {
      xhr = old[uuid];
      xhr.abort();
      delete old[uuid];

      return;
    }

    this.ajaxii = {};

    //console.log("abortJSON(" + uuid + ")");
    //console.log(this.constructor.name);
    //console.log(old);

    for(let key in old) {
      if (!uuid || old[key] == uuid) {
        old[key].abort();
      }
    }
  }

  getJSON(stuff) {
    let ax = _getJSON(stuff);
    this.ajaxii[ax.uuid] = ax;

    return ax.done(() => {
      delete this.ajaxii[ax.uuid];
    }).fail((jqXHR, textStatus, errorThrown) => {
      console.log("getJSON: Fail");
      console.log(stuff);
      console.log(ax);
    });
  }

  ajaxError(jqXHR, textStatus, errorThrown) {
    _ajaxError(jqXHR, textStatus, errorThrown);
  }

  reset() {
    this.ajaxii = {};
  }
}

class NetworkComponent extends BaseComponent {
  constructor(props) {
    super(props);

    this.network = new Connector();
  }

  getJSON(stuff) {
    return this.network.getJSON(stuff);
  }

  getSignedURL(file) {
    return this.getJSON({
      url : Util.URL(UPLOAD_URL),
      method: Network.Method.POST,
      data : { upload: { name : file.name } },
    });
  }

  S3Put(file) {
    //console.log("S3");
    //console.log(file);
  
    return this.getSignedURL(file).then((info, textStatus, jqXHR) => {
      let fileName = file.name;
      let ftype = file.type;
      let flength = file.size;
  
      //console.log("************ INFO");
      //console.log(info);
  
      let s3Info = info.upload;
  
      return this.getJSON({
        type: Network.Method.PUT,
        url: s3Info['signed_url'],
        data: file,
        dataType: null,
        contentType: ftype,
        mimeType: ftype,
        processData: false,
        cache: false,
      }).then((result, textStatus, jqXHR) => {
        //console.log("S3PUT RETURNING");
        //console.log(s3Info);
  
        return s3Info; // FROM getSignedURL
  
      });
    });
  }

  ajaxError(jqXHR, textStatus, errorThrown) {
    return this.network.ajaxError(jqXHR, textStatus, errorThrown);
  }

  reset() {
    this.network.reset();
  }

  componentDidMount() {
    this.network.reset();
  }

  componentWillUnmount() {
    this.network.abortJSON();
  }

}

const Network = {
  Network: Connector,
  Component : NetworkComponent,
  Method
};

export default Network;
