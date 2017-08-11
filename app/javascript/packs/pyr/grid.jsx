
import React, {
  Component
} from 'react';
import PropTypes from 'prop-types';

import Pyr from '../pyr/pyr';

const Container = (props) => (
  <div {...Pyr.Util.propsMergeClassName(props, "container-fluid")} >{props.children}</div>
);

const Row = (props) => (
  <div {...Pyr.Util.propsMergeClassName(props, "row")} >{props.children}</div>
);

const Column = (props) => (
  <div {...Pyr.Util.propsMergeClassName(props, "col")}>{props.children}</div>
);
const Col = Column;

const ColumnHalf = (props) => (
  <div {...Pyr.Util.propsMergeClassName(props, "col col-md-6")}>{props.children}</div>
);
const ColHalf = ColumnHalf;

const ColumnThird = (props) => (
  <div {...Pyr.Util.propsMergeClassName(props, "col col-md-4")}>{props.children}</div>
);
const ColThird = ColumnThird;

const ColumnFull = (props) => (
  <div {...Pyr.Util.propsMergeClassName(props, "col col-md-12")}>{props.children}</div>
);
const ColFull = ColumnFull;

const Grid = {
  Row,
  Col,
  Column,
  ColHalf,
  ColumnHalf,
  ColFull,
  ColumnFull,
  ColThird,
  ColumnThird,
  Container,
};
export default Grid;
