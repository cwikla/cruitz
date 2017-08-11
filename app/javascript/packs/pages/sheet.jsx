import React, {
  Component
} from 'react';

import PropTypes from 'prop-types';

import Pyr from '../pyr/pyr';

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
    if (!this.props.items) {
      this.props.getItems(this.onLoading);
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

  getItems(items) {
    alert("Sheet:Index If you are seeing this, you need to implement getItems!");
  }

  renderChildren() {
    let self = this;
    let items = this.sortItems(this.props.items) || [];

    return (
      <ul>
        {items.map((item, pos) => {
          let isSelected = this.same(item, this.props.selected);
          //console.log("RENDERING " + item);
          return (
            <li 
              key={this.key(item)} 
              onClick={this.onClicks[this.key(item)] } 
            >{this.renderItem(item, isSelected)}</li>);
        })}
      </ul>
     );
   }

  renderInner() {
    return (
      <Pyr.Scroll className="inner flx-col flx-1">
        { this.props.items ? this.renderChildren() : this.renderNone() }
      </Pyr.Scroll>
    );
  }

}

class Show extends Base {
  constructor(props) {
    super(props);
    this.onClick = this.props.onUnselect;
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

        // <!-- <div className="hidden-sm-up" onClick={this.onClick}><Pyr.Icon name="close"/></div> !-->
    return (
      <div className="inner flx-col flx-1">
        {this.renderItem(this.props.selected, false) }
      </div>
    );
  }
}

class FormBase extends Base {
  constructor(props) {
    super(props);
    this.onSuccess = this.success.bind(this);
  }

  success(data, textStatus, jqXHR) {
    alert("Sheet:Edit Do something with the success!");
  }

  renderForm() {
    alert("Sheet:New If you are seeing this you need to implement renderForm!");
  }
}

class New extends FormBase {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="new">
        { this.renderForm() }
      </div>
    );
  }
}

class Edit extends FormBase {
  constructor(props) {
    super(props);
  }

  render() {
    <div className="edit">
      { this.renderForm() }
    </div>
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
  Edit
};

export default Sheet;
