
import React, {
  Component
} from 'react';

import PropTypes from 'prop-types';

import Util from './util';
import Network from './network';

function convertUint8ArrayToBinaryString(u8Array) {
	var i, len = u8Array.length, b_str = "";

	for (i=0; i<len; i++) {
		b_str += String.fromCharCode(u8Array[i]);
	}

	return b_str;
}

function getSignedURL(file) {
  return Network.getJSON({
    url : Util.URL("/upload_url"),
    data : { upload: { name : file.name } },
  });
}

function S3Put(file) {
  console.log("S3");
  console.log(file);

  return getSignedURL(file).then((info, textStatus, jqXHR) => {
    let fileName = file.name;
    let ftype = file.type;
    let flength = file.size;

    console.log("************ INFO");
    console.log(info);

    let s3Info = info.upload;

    return Network.getJSON({
      type: Network.Method.PUT,
      url: s3Info['url'],
      data: file,
      dataType: null,
      contentType: ftype,
      mimeType: ftype,
      processData: false,
      cache: false,
    }).then((result, textStatus, jqXHR) => {
      console.log("S3PUT RETURNING");
      console.log(s3Info);

      return s3Info; // FROM getSignedURL

    });
  });
}

function isImageType(f) {
  console.log("CHECKING ISIMAGETYPE");
  console.log(f);

  f = f.type || f;

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
  getSignedURL,
  S3Put,
  isImageType,
  isVideoType,
};

export default Attachment;

