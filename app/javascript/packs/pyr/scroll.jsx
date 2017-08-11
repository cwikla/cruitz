
import React, {
  Component
} from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';

import Util from './util';

class Scroll extends Component {
  constructor(props) {
    super(props);

    this.state = {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      scrollHeight: 0,
      scrollWidth: 0
    };

    this.onScroll = this.scroll.bind(this);
  }

  scrollTo(pos, animateTime=0) {
    if (!animateTime) {
      return $(this).stop().scrollTop(pos);
    }
    return $(this).stop().animate({
      scrollTop: pos
    }, animateTime);
  }

  scroll(e) {
    //console.log("A: " + this.scroller);
    //console.log("B: " + $(this.scroller).attr("id"));

    let offset = $(this.scroller).offset();
    /*
    this.setState({
      top: offset.top,
      bottom: offset.bottom,
      right: offset.right,
      left: offset.left,
      scrollHeight: this.scrollHeight,
      scrollWidth: this.scrollWidth
    });
    */

    if (this.props.onScroll) {
      this.props.onScroll(e);
    }
  }

  render() {
        //onScroll={this.onScroll}
    return (
      <div 
        ref={(node) => this.scroller = (node)}
        {...Util.propsMergeClassName(this.props, "scroll flx-col flx-stretch")}
        onScroll={this.onScroll}
      >
        { this.props.children }
      </div>
    );
  }
}

export default Scroll;
