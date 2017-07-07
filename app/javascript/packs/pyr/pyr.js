

import { PyrForm as Form } from "./form";
import Util from './util';

const POST = 'POST';
const PUT = 'PUT';
const GET = 'GET';
const DELETE = 'DELETE';

const HTTP_METHOD = { POST, PUT, GET, DELETE };

const Pyr = { 
  Form, 
  Util,
  HTTP_METHOD 
};
export default Pyr;
