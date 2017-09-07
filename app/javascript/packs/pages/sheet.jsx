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

  renderNone() {
    return (
      <Pyr.Loading />
    );

    return (
      <h2>Empty</h2>
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
        {this.renderHeader()}
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

  setSelected(item, e) {
    //alert("SELECTED: " + item.id);
    if (e) {
      e.preventDefault()
    }

    this.props.onSelect(item);
  }

  componentDidMount() {
    console.log("GETTING ITEMS");
    if (!this.props.items) {
      this.props.onLoadItems(this.onLoading);
    }
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.props.items != nextProps.items) {
      this.bindClicks(nextProps.items, this.setSelected);
    }
  }

  sortItems(items) {
    return items.sort((x, y) => y.id - x.id);
  }

  renderChild(item, isSelected) {
    let url=Pyr.URL(this.props.url).push(item.id);

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
    console.log("GETTING ITEM");
    if (!this.props.item) {
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

    return (
      <div className="inner flx-col flx-1">
        {this.renderItem(this.props.selected, false) }
      </div>
    );
  }
}

class Form extends Base {
  constructor(props) {
    super(props);
    this.onSuccess = this.success.bind(this);
  }

  success(data, textStatus, jqXHR) {
    this.onClose();
  }

  renderForm() {
    alert("Sheet:New If you are seeing this you need to implement renderForm!");
  }

  renderTitle() {
    return null;
  }

  renderInner() {
    return (
      <Modal onClose={this.onClose}>
        <div className="title flx-col" >
          { this.renderTitle() }
        </div>
        <div className="content flx-1">
          { this.renderForm() }
        </div>
      </Modal>
    );
  }
}

class New extends Form {
  constructor(props) {
    super(props);
  }

}

class Edit extends Form {
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
};

export default Sheet;
