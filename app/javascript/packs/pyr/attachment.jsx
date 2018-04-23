
import PropTypes from 'prop-types';

import BaseComponent from './base';
import Util from './util';
import Network from './network';

function isImageType(f) {
  console.log("CHECKING ISIMAGETYPE");
  console.log(f);

  f = f.type || f.content_type || f;

  console.log("A");
  console.log(f);

  let re = /^image\/(.*)/;
  return f.match(re) != null;
}

function isVideoType(f) {
  f = f.type || f;

  let re = /^video\/(.*)/;
  return f.match(re) != null;
}

const Attachment = {
  isImageType,
  isVideoType,
};

export default Attachment;

