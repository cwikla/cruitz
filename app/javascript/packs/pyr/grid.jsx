
import React from 'react';
import PropTypes from 'prop-types';

import Component from './base';
import Pyr from '../pyr/pyr';

const ContainerFluid = (props) => (
  <div {...Pyr.Util.propsMergeClassName(props, "container-fluid")} >{props.children}</div>
);

const Container = (props) => (
  <div {...Pyr.Util.propsMergeClassName(props, "container")} >{props.children}</div>
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

const FullContainer = (props) => (
  <Pyr.Grid.ContainerFluid {...Pyr.Util.propsMergeClassName(props, "d-flex h-100 w-100 flex-col")} >
    <Pyr.Grid.Row {...Pyr.Util.propsMergeClassName(props, "flx-1")} >
      <Pyr.Grid.Col {...Pyr.Util.propsMergeClassName(props, "p-0 d-flex flx-col")}>
        {props.children}
      </Pyr.Grid.Col>
    </Pyr.Grid.Row>
  </Pyr.Grid.ContainerFluid>
);

const RowFix = (props) => (
  <div className="row-15">
    {props.children}
  </div>
);

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
  ContainerFluid,
  Container,
  FullContainer,
  RowFix
};
export default Grid;
