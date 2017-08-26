//https://github.com/brigade/react-simple-pie-chart/blob/master/src/pie_chart.jsx
//The MIT License (MIT)
//
//Copyright (c) 2015 Brigade
//
//Permission is hereby granted, free of charge, to any person obtaining a copy
//of this software and associated documentation files (the "Software"), to deal
//in the Software without restriction, including without limitation the rights
//to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
//copies of the Software, and to permit persons to whom the Software is
//furnished to do so, subject to the following conditions:
//
//The above copyright notice and this permission notice shall be included in all
//copies or substantial portions of the Software.
//
//THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
//

import React, {
  Component
} from 'react';

import PropTypes from 'prop-types';

import Util from './util';

const RAD_CIRC = Math.PI * 2;

/**
 * @param {Object[]} slices
 * @return {Object[]}
 */
function renderPaths(slices, size, center, radius) {
  const total = slices.reduce((totalValue, { value }) => totalValue + value, 0);

  let radSegment = 0;
  let lastX = radius;
  let lastY = 0;

  return slices.map(({ color, value }, index) => {
    // Should we just draw a circle?
    if (value === total) {
      return (
        <circle
          r={radius}
          cx={center}
          cy={center}
          fill={color}
          key={index}
        />
      );
    }

    if (value === 0) {
      return;
    }

    const valuePercentage = value / total;

    // Should the arc go the long way round?
    const longArc = (valuePercentage <= 0.5) ? 0 : 1;

    radSegment += valuePercentage * RAD_CIRC;
    const nextX = Math.cos(radSegment) * radius;
    const nextY = Math.sin(radSegment) * radius;

    // d is a string that describes the path of the slice.
    // The weirdly placed minus signs [eg, (-(lastY))] are due to the fact
    // that our calculations are for a graph with positive Y values going up,
    // but on the screen positive Y values go down.
    const d = [
      `M ${center},${center}`,
      `l ${lastX},${-lastY}`,
      `a${radius},${radius}`,
      '0',
      `${longArc},0`,
      `${nextX - lastX},${-(nextY - lastY)}`,
      'z',
    ].join(' ');

    lastX = nextX;
    lastY = nextY;

    return <path d={d} fill={color} key={index} />;
  });
}

/**
 * Generates an SVG pie chart.
 * @see {http://wiki.scribus.net/canvas/Making_a_Pie_Chart}
 */
class PieChart extends Component {
  /**
   * @return {Object}
   */
  constructor(props) {
    super(props);

    this.state = {
      size: 0
    };
  }

  componentDidMount() {
    let width = this.chart.offsetWidth;
    let height = this.chart.clientHeight;

    if (!height) {
      height = width;
    }

    let size = (width > height ? height : width);
    this.setState({
      size
    });

  }

  render() {

    if (!this.chart) {
      return (
        <div className="pie-chart"
          ref={(node) => this.chart = node}
        />
      );
    }

    let size = this.state.size;
    let center = size/2;
    let radius = center-1;

    let props = Util.propsRemove(this.props, ["slices"]);

    return (
      <div {...Util.propsMergeClassName(props, "pyr-pie-chart")}
        ref={(node) => this.chart = node}
      >
        <svg viewBox={"0 0 ${size} ${size}"}>
          <g transform={"rotate(-90 ${center} ${center}) translate(0, ${size}) scale(1, -1)"}>
            {renderPaths(this.props.slices, size, center, radius)}
          </g>
        </svg>
      </div>
    );
  }
}

PieChart.propTypes = {
  slices: PropTypes.arrayOf(PropTypes.shape({
    color: PropTypes.string.isRequired, // hex color
    value: PropTypes.number.isRequired,
  })).isRequired,
}

export default PieChart;
