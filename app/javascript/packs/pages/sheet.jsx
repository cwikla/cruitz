import React from 'react';
import PropTypes from 'prop-types';

import {
  Link,
  Route
} from 'react-router-dom';

import Pyr, {
  Component
} from '../pyr/pyr';

class Item extends Pyr.UserReceiver {
}


class Base extends Pyr.UserReceiver {
  constructor(...args) {
    super(...args);

    this.initState({
      isLoading: false,
    });

    this.onClicks = {};
    this.onLoading = this.setLoading.bind(this);
    this.onLoaded = this.setLoading.bind(this, false);
    this.onBack = this.back.bind(this);
    this.onClose = this.close.bind(this);
  }

  close(e) {
    if (e) {
      e.preventDefault();
    }

    this.props.onSetUnaction();
  }

  back(e) {
    if (e) {
      e.preventDefault();
    }

    this.props.onSetUnaction();
  }

  setSelected(item, e) {
    //alert("SELECTED: " + item.id);
    if (e) {
      e.preventDefault()
    }

    this.props.onSelect(item);
  }

  setLoading(val=true) {
    this.setState({
      isLoading: val
    });
  }

  same(a,b) {
    if (!a && !b) {
      return true;
    }

    if (!a) {
      return false
    }

    if (!b) {
      return false
    }

    return this.key(a) == this.key(b);
  }

  key(a) {
    alert("Sheet.Base If you are seeing this you need to implement key");
  }

  renderItem(item, isSelected) {
    alert("Sheet:Base If you are seeing this, you need to implement renderItem!");
  }

  renderLoading() {
    return (
      <Pyr.UI.Loading />
    );
  }

  renderNone() {
    return (
      <h2 className="empty flx-1 flx-align-center">Empty</h2>
    );
  }

  renderHeader(selected) {
    return null;
  }

  renderInner() {
    return null;
  }

  renderFooter() {
    return null;
  }

  render() {
    //if (this.state.isLoading) {
      //return (<Pyr.UI.Loading />);
    //}

    return (
      <div className="sheet flx-col flx-1">
        <div className="header">
          {this.renderHeader(this.props.selected)}
        </div>
        {this.renderInner()}
        {this.renderFooter()}
      </div>
    );

  }

}

function sheetComponent(action) {
  action = action || "Index";
  let nameAction = Pyr.Util.capFirstLetter(action) + "Sheet";
  return nameAction;
}

function sheetID(name, action) {
  action = action || "Index";
  let idName = "sheet" + "-" + action.toLowerCase();
  return idName;
}


class Form extends Base {

  renderTitle() {
    return (
      <h3 className="mr-auto">{this.title()}</h3>
    );
  }


  render() {
    return (
      <Pyr.UI.FullScreen>
        <div className="title flx-0" >
          { this.renderTitle() }
        </div>
        <div className="form-content flx-1 mt-auto">
          { this.renderForm() }
        </div>
      </Pyr.UI.FullScreen>
    );
  }

}

class Wizard extends Base {

  constructor(...args) {
    super(...args);

    this.mergeState({
      page: 0
    });

    this.stack = [0];

    this.onNext = this.next.bind(this);
    this.onPrev = this.prev.bind(this);
    this.toPage = this.page.bind(this);
  }

  pageCount() {
    return 0;
  }

  page(nextPage) {
    if ((nextPage < 0) || (nextPage >= this.pageCount())) {
      //console.log("Page outside boundaries: " +  nextPage);
    }

    this.stack.push(nextPage);

    this.setState({
      page: nextPage
    });
  }

  next(e) {
    if (e) {
      e.preventDefault();
    }
    if (this.state.page < (this.pageCount() - 1)) {
      this.page(this.state.page + 1);
    }
  }

  prev(e) {
    if (e) {
      e.preventDefault();
    }

    if (this.stack.length <= 1) {
      return;
    }

    this.stack.pop(); // this page
    let p = this.stack.pop(); // prev page

    //console.log("PRE: " + p);
    if (p >= 0) {
      this.page(p);
    }
  }

  render() {
      return this.props.children;
  }

}

class Index extends Base {
  componentDidMount() {
    if (!this.props.items) {
      //console.log("LOADING ITEMS");
      this.props.onLoadItems(this.onLoading);
    }
  }

  componentWillUpdate(nextProps, nextState) {
  }

  sortItems(items) {
    return items.sort((x, y) => new Date(y.created_at).getTime() - new Date(x.created_at).getTime());
  }

  childURL(item, isSelected) {
    return Pyr.URL(this.props.url).push(item.id);
  }

  renderChild(item, isSelected) {
    let url = this.childURL(item, isSelected);

    return (
      <li 
        key={this.key(item)} 
      ><Link to={url.toString()}>{this.renderItem(item, isSelected)}</Link></li>
    );
  }

  renderChildren(items, selected) {
    let self = this;
    //console.log("render children");
    //console.log(this.props);

              /*onClick={this.onClicks[this.key(item)] }  */
    return (
      <ul>
        {items.map((item, pos) => {
          let isSelected = this.same(item, selected);
          //console.log("RENDERING " + item);
          return this.renderChild(item, isSelected);
        })}
      </ul>
     );
   }

  renderInner() {
    if (!this.props.items) {
      return this.renderLoading();
    }

    if (this.props.items.length == 0) {
      return this.renderNone();
    }

    //let items = this.sortItems(this.props.items) || [];
    let items = this.props.items;

    return (
      <Pyr.UI.Scroll className="inner flx-col flx-1">
        { this.renderChildren(items, this.props.selected) }
      </Pyr.UI.Scroll>
    );
  }

}

class Show extends Base {

  componentDidMount() {
    if (!this.props.selected) {
      //console.log("GETTING SELECTED");
      this.props.onLoadSelected(this.props.itemId, this.onLoading);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.itemId != prevProps.itemId) {
      this.props.onLoadSelected(this.props.itemId, this.onLoading);
    }
  }

  editMe(e) {
    if (e) {  
      e.preventDefault();
    }
    this.props.onSetAction('Edit');
  }

  renderInner() {
    if (!this.props.selected) {
      return (
          <Pyr.UI.Loading />
      );
    }

    // hmm was just a div
    return (
      <Pyr.UI.Scroll className="inner flx-col flx-1 imascroll"> 
        {this.renderItem(this.props.selected, false) }
      </Pyr.UI.Scroll>
    );
  }


}

class ShowFull extends Show {
  render() {
    return (
      <Pyr.UI.FullScreen>
        { super.render() }
      </Pyr.UI.FullScreen>
    );
  }
}

class SearchForm extends Form {
  constructor(...args) {
    super(...args);

    this.onSuccess = this.success.bind(this);
  }

  success(data, textStatus, jqXHR) {
    this.onClose();
  }

  renderInner() {
    return (
      <Side onClose={this.onClose}>
        { super.renderInner() }
      </Side>
    );
  }
}

class New extends Form {

  title() {
    return null;
  }

}

class Edit extends Form {

  componentDidMount() {
    if (!this.props.selected) {
      console.log("GETTING SELECTED");
      this.props.onLoadSelected(this.props.itemId, this.onLoading);
    }
  }

  render() {
    if (!this.props.selected) {
      return (
        <Pyr.UI.Loading />
      );
    }

    return super.render();
  }

}


const Sheet = {
  sheetComponent,
  sheetID,
  Base,
  Item,
  Index,
  Show,
  ShowFull,
  New, 
  Edit,
  Form,
  Wizard,
};

export default Sheet;
