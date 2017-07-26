import React, {
  Component
} from 'react';

import Pyr from '../pyr/pyr';

class Base extends Component {
  getInitState(props) {
    return  {};
  }

  constructor(props) {
    super(props);

    this.state = Object.assign({ isLoading: false}, this.getInitState(props));

    this.onClicks = {};
    this.onPreSubmit = this.preSubmit.bind(this);
    this.onPostSubmit = this.postSubmit.bind(this);
  }

  bindClicks(items, f) {
    let self = this;
    this.onClicks = {};

    for(let item of items) {
      this.onClicks[this.key(item)] = f.bind(this, item);
    }
  }

  preSubmit() {
    this.setState({
      isLoading: true
    });
  }

  postSubmit() {
    this.setState({
      isLoading: false
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

  render() {
    return (
      <div className="sheet">
        {this.renderHeader()}
        {this.renderInner()}
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
  let idName = "sheet" + action.toLowerCase();
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

  componentWillUpdate(nextProps, nextState) {
    if (this.props.items != nextProps.items) {
      this.bindClicks(nextProps.items, this.setSelected);
    }
  }

  renderChildren() {
    let self = this;
    return (
      <ul>
        {this.props.items.map((item, pos) => {
          let isSelected = this.same(item, this.props.selected);
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
      <div className="inner">
        { this.props.items ? this.renderChildren() : this.renderNone() }
      </div>
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
    this.props.onAction('Edit');
  }

  renderInner() {
    let noKey = "no-" + this.constructor.name.toLowerCase();

    if (!this.props.selected) {
      return (
          <h2 key={noKey}>Nothing to Show?</h2>
      );
    }

    return (
      <div className="inner">
        <div className="hidden-sm-up" onClick={this.onClick}><Pyr.Icon name="close"/></div>
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
      <div className="sheet new-sheet">
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
    <div className="sheet edit-sheet">
      { this.renderForm() }
    </div>
  }

}

const Sheet = {
  sheetComponent,
  sheetID,
  Base,
  Index,
  Show,
  New, 
  Edit
};

export default Sheet;
