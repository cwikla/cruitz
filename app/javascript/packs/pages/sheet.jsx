import React, {
  Component
} from 'react';

import PropTypes from 'prop-types';

import {
  Link,
  Route
} from 'react-router-dom';

import Pyr from '../pyr/pyr';

class Modal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: 'in'
    };

    this.onClose = this.close.bind(this);
  }

  close(e) {
    if (e) {
      e.preventDefault();
    }
    this.setState({
      show: 'out'
    });
    if (this.props.onClose) {
      this.props.onClose();
    }
  }

  render() {
    return (
      <Pyr.Fade in_or_out={this.state.show}>
        <Pyr.FullScreen
          onEscape={this.onClose}
          onClose={this.onClose}
        >
        { this.props.children }
        </Pyr.FullScreen>
      </Pyr.Fade>
    );
  }
}

class Item extends Pyr.UserComponent {
}


class Base extends Pyr.UserComponent {
  getInitState(props) {
    return  {};
  }

  constructor(props) {
    super(props);

    this.state = Object.assign({ isLoading: false}, this.getInitState(props));

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

  bindClicks(items, f) {
    let self = this;
    this.onClicks = {};

    if (items) {
      for(let item of items) {
        this.onClicks[this.key(item)] = f.bind(this, item);
      }
    }
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
      <Pyr.Loading />
    );
  }

  renderNone() {
    return (
      <h2 className="empty flx-1 flx-align-center">Empty</h2>
    );
  }

  renderHeader() {
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
      return (<Pyr.Loading />);
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

class Index extends Base {
  constructor(props) {
    super(props);

    this.bindClicks(this.props.items, this.setSelected);
  }

  componentDidMount() {
    if (!this.props.items) {
      console.log("LOADING ITEMS");
      this.props.onLoadItems(this.onLoading);
    }
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.props.items != nextProps.items) {
      this.bindClicks(nextProps.items, this.setSelected);
    }
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
    console.log("render children");
    console.log(this.props);

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
      <Pyr.Scroll className="inner flx-col flx-1">
        { this.renderChildren(items, this.props.selected) }
      </Pyr.Scroll>
    );
  }

}

class Show extends Base {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    if (!this.props.selected) {
      console.log("GETTING SELECTED");
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
          <Pyr.Loading />
      );
    }

    // hmm was just a div
    return (
      <Pyr.Scroll className="inner flx-col flx-1"> 
        {this.renderItem(this.props.selected, false) }
      </Pyr.Scroll>
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
  constructor(props) {
    super(props);
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

class New extends ModalForm {
  constructor(props) {
    super(props);
  }

}

class Edit extends ModalForm {
  constructor(props) {
    super(props);
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
  ModalForm
};

export default Sheet;
