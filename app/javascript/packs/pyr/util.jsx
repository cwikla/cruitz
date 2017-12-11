
import React, {
  Component,
} from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';

import uuid from 'uuid';

const ONE_MINUTE = (60 * 1000);
const ONE_HOUR = (ONE_MINUTE * 60);
const ONE_DAY = (ONE_HOUR * 24);
const TWO_DAYS = (ONE_DAY * 2);

const REMOTE_PATH = "/api/v1";

const POST = 'POST';
const PUT = 'PUT';
const GET = 'GET';
const DELETE = 'DELETE';

const Method = {
  POST,
  PUT,
  GET,
  DELETE 
};


class URLObj {
  constructor(path) {
    path = path || "/";
    if (path.constructor.name == this.constructor.name) {
      path = path.toString();
    }
    this.parser = document.createElement('a');
    this.parser.href = path;
    
    this.searchParams = new URLSearchParams(this.parser.search);

    var re = /^((http|https):)/;
    this.fullURL = (re.test(path)); // passed in full path,respect it

    this.pathList = this.ptol(this.parser.pathname);

    this.remote = REMOTE_PATH;
  }
  
  parser() {
    return this.bake().parser;
  }
  
  search(d) {
    this.searchParams = new URLSearchParams();
    for(var key in d) {
      this.set(key, d[key]);
    }
    return this;
  }
  
  set(k, v) {
    this.searchParams.set(k,v);
    return this;
  }
  
  get(k,v) {
    this.searchParams.get(k);
    return this;
  }

  data() {
    return this.searchParams;
  }
  
  delete(k) {
    this.searchParams.delete(k);
    return this;
  }
  
  deleteAll() {
    this.searchParams = new URLSearchParams();
    return this;
  }
  
  clear() {
    this.searchParams = new URLSearchParams();
    this.pathList = ["/"];
    return this;
  }
  
  ptol(p) {
    p = p.toString();
    return p.split("/").reduce((d, c) => {
      if (c.length && c != "/") {
        d.push(c);
      }
      return d;
    }, []);
  }
  
  path(inpath) {
    inpath = inpath || "";
    this.pathList = this.ptol(inpath);
    return this;
  }
  
  root() {
    return this.path();
  }
  
  prepend(a) {
    let stuff = this.ptol(a);
    this.pathList = stuff.concat(this.pathList);
    return this;
  }
  
  push(a) {
    this.pathList = this.pathList.concat(this.ptol(a));
    return this;
  }
  
  pop(a) {
    if (this.pathList.length) {
      this.pathList.pop(a);
    }
    return this;
  }
  
  bake() {
    let plist = this.pathList;
    this.parser.search = this.searchParams.toString();
    let pathname = plist.join("/");
    this.parser.pathname = pathname;
    if (this.parser.hostname.startsWith("null.")) { // hack
        this.parser.hostname = this.parser.hostname.substring(5, this.parser.hostname.length);
    }
    return this;
  }
  
  ifa(a) {
    return (a ? a : '');
  }

  setRemote(base) {
    this.remote = base;
  }

  unusedToPath() {
    this.bake();
    let pathName = this.pathList.join("/");
    pathName = "/" + pathName;
    return pathName;
  }

  toRemote() {
    if (this.fullURL) {
      return this.toString();
    }

    let rem = (new URLObj(this).prepend(this.remote)).toString();

    return rem;
  }

  toString() {
    this.bake();

    //console.log("THIS");
    //console.log(this);

    if (this.fullURL) {
      return this.parser.href;
    }

    return this.parser.pathname;

    //return (this.parser.pathname.toString() + this.parser.search.toString()).toLowerCase();
  }
  
}

function PURL(a) {
  return new URLObj(a);
}

function ajaxError(jqXHR, textStatus, errorThrown) {
  console.log(jqXHR);
  console.log(textStatus)
  console.log("AJAX Error: " + errorThrown);
}

const LETTERS = "abcdefghijklmnopqrstuvwxyz";
const IGNORE = "_-+@/{}[]()";
const NUMBERS = "0123456789";

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function scramble(a) {
  let s = "";
  for(var x of a) {
    if (IGNORE.includes(x)) {
      s = s + x;
    }
    else if (NUMBERS.includes(x)) {
      s = s + '6';
    }
    else {
      s = s + LETTERS[getRandomInt(0, LETTERS.length-1)];
    }
  }
  return s;
}

function getJSON(stuff) {
  let url = stuff.url;
  let data = stuff.data;
  let method = stuff.method || stuff.type || GET;

  if (typeof url == 'string') {
    url = PURL(url);
  }

  data = data || url.data().toString();

  if (stuff.remote) {
    url.setRemote(stuff.remote);
  }

  url = url.toRemote();

  console.log("GETJSON: " + url);
  //console.log(data);

  stuff = Object.assign({
    dataType: "json",
    type: method,
  }, stuff, {
    url: url,
    data: data
  });


  let onLoading = stuff.loading ? stuff.loading : null;

  let oldBeforeSend = stuff.beforeSend;
  let beforeSend = (jqXHR, settings) => {
    if (oldBeforeSend) {
      oldBeforeSend(jqXHR, settings);
    }
    if (onLoading) {
      onLoading();
    }
  };

  stuff.beforeSend = beforeSend;

  console.log("STUFF");
  console.log(stuff);

  let ajx = $.ajax(
    stuff
  )
  .always(() => {
    if (onLoading) {
      onLoading(false);
    }
  });
  ajx.uuid = uuid.v4();
  return ajx;
}

class ClassNamesObj  {
  constructor(...args) {
    this.arr = [];
    this.push(...args);
  }
  
  push(...args) {
    for(let val of args) {
      this.innerPush(val);
    }
    return this;
  }

  concat(...args) {
    return new ClassNamesObj(this.arr).push(...args);
  }

  all() {
    return this.arr;
  }

  innerPush(val) {
    if (typeof val == 'string') {
      val = val.split(" ");
    }
    if (!Array.isArray(val)) {
      val = [ val ];
    }
    val = val.slice();
    this.arr = this.arr.concat(val);
    return this;
  }
  
  toString() {
    return this.arr.join(" ").toLowerCase();
  }
  
  classes() {
    return this.toString();
  }
  
  clear() {
    this.arr = [];
    return this;
  }

  reset(...args) {
    return this.clear().push(...args);
  }
}

function ClassNames(...args) {
  return new ClassNamesObj(...args);
}

function summarize(arg, maxLength=300, ellipses=true) {
  if (arg.length <= maxLength) {
    return arg;
  }
  
  let cut = new RegExp(/\s/, "gi");
  
  arg = arg.slice(0, maxLength-3); // For ellipses
  let pieces = arg.split(cut);
  pieces = pieces.slice(0, pieces.length-1);
  let result = pieces.join(" ");

  if (result.length < maxLength/3) { // too small
    result = arg.slice(0, maxLength/2);
  }
  result = result + "...";

  return result;
}

function isToday(date, offsetDays=0) {
  let start = new Date();
  if (offsetDays) {
    start = new Date(start.getTime() - (offsetDays * 86400000));
  }
  start.setHours(0, 0, 0, 0);

  let end = new Date(start);
  end.setHours(23, 59, 59, 999);

  return ((date.getTime() >= start.getTime()) && (date.getTime() <= end.getTime()));
}

function isYesterday(date) {
  return isToday(date, 1);
}

function friendlyDate(date, longOnly=false) {

  date = new Date(date); // in case it's a string
  let now = new Date();
  
  let diff = (now - date); // to seconds
  let longOptions = { weekday: 'short', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true };
  if (now.getYear() != date.getYear()) {
    longOptions.year = 'numeric';
  }

  let timeOptions = { hour: 'numeric', minute: 'numeric', hour12: true };
  if (!longOnly) {
    var result = null;
    if (diff < ONE_HOUR) {

      if (diff < ONE_MINUTE) {
        result = "Moments ago";

      } else {

        result = Math.floor(diff / ONE_MINUTE) + " minutes ago";
      }

      return (
        <span className="friendly-date"><span className="hidden-sm-down">{result}</span><span className="hidden-md-up">{date.toLocaleString("en-US", timeOptions)}</span></span>
      );
    } 
    else if (isToday(date)) {
      result = "Today at " + date.toLocaleString("en-US", timeOptions);

      timeOptions = { hour: 'numeric', minute: 'numeric', hour12: true };

      return (
        <span className="friendly-date"><span className="hidden-sm-down">{result}</span><span className="hidden-md-up">{date.toLocaleString("en-US", timeOptions)}</span></span>
      );

    } else if (isYesterday(date)) {

      result = "Yesterday at " + date.toLocaleString("en-US", timeOptions);

      return (
        <span className="friendly-date"><span className="hidden-sm-down">{result}</span><span className="hidden-md-up">{date.toLocaleDateString("en-US")}</span></span>
      );
    }
  }


  return (
    <span className="friendly-date"><span className="hidden-sm-down">{date.toLocaleString("en-US", longOptions)}</span><span className="hidden-md-up">{date.toLocaleDateString("en-US")}</span></span>
  );
}

function squish(str) {
  //console.log(str);
  return str.replace(" ", "-");
}

function capFirstLetter(string) {
    string = string.toLowerCase();
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function childrenWithProps(children, props, kidType) {
  return React.Children.map(children, (child) => {
    if (!kidType || child.type == kidType) {
      let merge = propsMerge(child.props, props);
      return React.cloneElement(child, merge);
    }
    return child;
  });
}

function firstKid(children) {
  const childrenArray = React.Children.toArray(children);
  return childrenArray[0] || null;
}

function kidAt(children, pos) {
  const childrenArray = React.Children.toArray(children);
  return childrenArray[pos];
}

function kidCount(children) {
  return React.Children.count(children);
}

function propsRemove(props, ripOut) {
  if (!Array.isArray(ripOut)) {
    ripOut = [ ripOut ];
  }

  let tmp = Object.assign({}, props);
  ripOut.forEach((a) => {
    delete tmp[a];
  });
  return tmp;
}

function propsMerge(initProps, props) {
  let result = {};
  let allClasses = ClassNames(initProps.className, props.className);

  Object.assign(result, initProps);
  Object.assign(result, props);

  result.className = allClasses.classes();

  return result;
}

function propsMergeClassName(props, className) {
  return propsMerge({className}, props);
}

function hash(str) {
  str = '' + str; // conversion
  var hash = 5381,
      i    = str.length;

  while(i) {
    hash = (hash * 33) ^ str.charCodeAt(--i);
  }

  /* JavaScript does bitwise operations (like XOR, above) on 32-bit signed
   * integers. Since we want the results to be always positive, convert the
   * signed int to an unsigned by doing an unsigned bitshift. */
  return hash >>> 0;
}

function times(x,f) {
  let result = [];
  let n = x-1;
  while(n >= 0) {
    result.push(f(n));
    n = n - 1;
  }
  return result;
}

function convertUint8ArrayToBinaryString(u8Array) {
	var i, len = u8Array.length, b_str = "";

	for (i=0; i<len; i++) {
		b_str += String.fromCharCode(u8Array[i]);
	}

	return b_str;
}

async function s3Upload(files) {
  if (!files) {
    return;
  }

  let waiters = [];
  let upfiles = [];

  for(let f of Array.from(files)) {
    let fileName = f.name;
    let ftype = f.type;
    let flength = f.size;

 //   console.log(PURL("/upload_url"));
  //  console.log("FTYPE: " + ftype);

    let query = {
      url : PURL("/upload_url"),
      data : { "upload[name]" : fileName },
    };

    let result = await Util.getJSON(query);
    let s3Url = result['url'];

    let big = Object.assign({}, result, {file: f});

    upfiles.push(big);

    let api = Util.getJSON({
        type: Method.PUT,
        url: result['url'],
        data: f,
        dataType: null,
        contentType: ftype,
        mimeType: ftype,
        processData: false,
   
/*   
        beforeSend: function(xhr){
          console.log("SETTING REQUEST HEADER: " + ftype);
          console.log(xhr);
        }
*/
  
      }).done(function(retData, textState, jqXHR) {
        console.log("SUCCESS FOR " + fileName);
  
      }).fail(function(jqXHR, textStatus, errorThrown) {
        Util.ajaxError(jqXHR, textStatus, errorThrown);
  
      });
    waiters.push(api);
  }

  await Promise.all(waiters).then(value => {
    console.log("PROMISE COMPLETE");
  }).catch(reason => {
    console.log(reason); // FIXME
  });

  console.log("RETURNING upfiles");
  console.log(upfiles);
  return upfiles;
}


const Util = {
  PURL,
  ClassNames,
  summarize,
  friendlyDate,
  capFirstLetter,
  squish,
  childrenWithProps,
  propsRemove,
  propsMerge,
  propsMergeClassName,
  firstKid,
  kidAt,
  kidCount,
  hash,
  times,
  ajaxError,
  getJSON,
  scramble,
  getRandomInt,
  Method,
  s3Upload,
};

export default Util;
