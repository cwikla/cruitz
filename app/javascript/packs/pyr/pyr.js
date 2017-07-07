

import { PyrForm as Form } from "./form";
import Util from './util';

const POST = 'POST';
const PUT = 'PUT';
const GET = 'GET';
const DELETE = 'DELETE';

const Method = { POST, PUT, GET, DELETE };

const Pyr = { 
  Form, 
  Util,
  Method,
};
export default Pyr;
