import React, {
  Component
} from 'react';

import PropTypes from 'prop-types';

import {
  Link,
  Route
} from 'react-router-dom';

import Pyr from '../pyr/pyr';

class Modal extends Pyr.UserReceiver {
  constructor(...args) {
    super(...args);
    this.state = {
      show: false
    };

    this.onClose = this.close.bind(this);
  }

  show() {
    this.state({
      show: true
    });
  }

  close(e) {
    if (e) {
      e.preventDefault();
    }
    this.setState({
      show: false
    });
    if (this.props.onClose) {
      this.props.onClose();
    }
  }

  render() {
    return (
        <Pyr.UI.FullScreen
          onEscape={this.onClose}
          onClose={this.onClose}
        >
        { this.props.children }
        </Pyr.UI.FullScreen>
    );
  }
}

class Item extends Pyr.UserReceiver {
}


class Base extends Pyr.UserReceiver {
  getInitState(...args) {
    return  {};
  }

  constructor(...args) {
    super(...args);

    this.state = Object.assign({ isLoading: false}, this.getInitState(...args));

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
    if (this.state.isLoading) {
      return (<Pyr.UI.Loading />);
    }

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

class Wizard extends Base {
  getInitState(...args) {
    return  {
      page: 0,
    };
  }

  constructor(...args) {
    super(...args);

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

    let items = this.sortItems(this.props.items) || [];

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
      <Pyr.UI.Scroll className="inner flx-col flx-1"> 
        {this.renderItem(this.props.selected, false) }
      </Pyr.UI.Scroll>
    );
  }

  render() {
    return (
      <Pyr.UI.FullScreen>
        { super.render() }
      </Pyr.UI.FullScreen>
    );
  }

}

class Form extends Base {
  renderForm() {
    alert("Sheet:New If you are seeing this you need to implement renderForm!");
  }

  renderTitle() {
    return null;
  }

  renderInner() {
    return (
      <div className="form-main">
        <div className="title flx-col" >
          { this.renderTitle() }
        </div>
        <div className="content flx-1">
          { this.renderForm() }
        </div>
      </div>
    );
  }
}

class ModalForm extends Form {
  constructor(...args) {
    super(...args);

    this.onSuccess = this.success.bind(this);
  }

  success(data, textStatus, jqXHR) {
    this.onClose();
  }

  renderInner() {
    return (
      <Modal onClose={this.onClose}>
        { super.renderInner() }
      </Modal>
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

class New extends ModalForm {

  title() {
    return null;
  }

  renderTitle() {
    return (
      <h3 className="ml-auto mr-auto">{this.title()}</h3>
    );
  }

}

class Edit extends ModalForm {
  title() {
    return "Edit.Sheet title goes here";
  }

  renderTitle() {
    return (
      <h3 className="ml-auto mr-auto">{this.title()}</h3>
    );
  }


}


const Sheet = {
  sheetComponent,
  sheetID,
  Base,
  Item,
  Index,
  Show,
  New, 
  Edit,
  Form,
  Modal,
  ModalForm,
  Wizard,
};

export default Sheet;
