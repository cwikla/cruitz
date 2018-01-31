
import React from 'react';
import PropTypes from 'prop-types';

import BaseComponent from './base';
import Util from './util';

class Scroll extends BaseComponent {
  constructor(props) {
    super(props);

/*
    this.state = {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      scrollHeight: 0,
      scrollWidth: 0
    };
*/

    this.onScroll = this.scroll.bind(this);
  }

  itemPos(item) {
    let $item = $(item);
    let $parent = $item.parent();

    //console.log("ITEM: " + $item.attr("id"));
    let top = $item.offset().top;

    //console.log("TOP: " + $item.attr("id") + " => " + top);
    //while($parent.attr("id") != "message-show") {
    //while($parent.attr("id") != this.scroller.attr("id")) {
    while(!$parent.is(this.scroller)) {
      //console.log("TOP: " + $parent.attr("id") + " => " + top);
      top = top - $parent.offset().top;

      $parent = $parent.parent();
      //console.log("PARENT IS NOW: " + $parent.attr("id"));
    }

    return top;
  }

  scrollToPos({pos, animateTime}) {
    pos = pos || this.scroller[0].scrollHeight;
    //console.log("ScrollToPos: " + pos);
    
    if (!animateTime) {
      return this.scroller.stop().scrollTop(pos);
    }
    return this.scroller.stop().animate({
      scrollTop: pos
    }, animateTime);
  }

  scrollToItem(item, animateTime) {
    let pos = this.itemPos(item);
    pos = pos + this.scroller.offset().top + $(item).height();
    this.scrollToPos({pos, animateTime});
  }

  scrollToBottom(animateTime) {
    this.scrollToPos({animateTime});
  }

  scrollToTop(animateTime) {
    this.scrollToPos({pos: 0, animateTime});
  }

  scroll(e) {
    //console.log("A: " + this.scroller);
    //console.log("B: " + $(this.scroller).attr("id"));

    let offset = this.scroller.offset();
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
    return (
      <div 
        ref={(node) => this.scroller = $(node)}
        {...Util.propsMergeClassName(this.props, "scroll flx-1")}
        onScroll={this.onScroll}
      >
        { this.props.children }
      </div>
    );
  }
}

export default Scroll;
