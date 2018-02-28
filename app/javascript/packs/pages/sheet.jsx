import React from 'react';
import PropTypes from 'prop-types';

import {
  Link,
  Route
} from 'react-router-dom';

import Pyr, {
  Component
} from '../pyr/pyr';

import Logo from './shared/logo';

class FSWL extends Pyr.UI.FullScreen {
  renderLeft() {
    return (
      <Logo />
    );
  }
}

class Item extends Component {
}


class Base extends Component {
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
      <h2 className="empty flx-col flx-1 flx-align-center">No Results</h2>
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
  constructor(props) {
    super(props);

    this.onSuccess = this.success.bind(this);
    this.onGetTarget = this.getTarget.bind(this);

    this.form = null;
  }

  getTarget() {
    console.log("FORM GET TARGET");
    return this.form;
  }

  success(data, textStatus, jqXHR) {
    //console.log("Form::success missing");
  }

  renderSaveButton() {
    let isDisabled = this.props.isLoading;

    return (
      <Pyr.Form.SubmitButton className="ml-auto" target={this.onGetTarget} disabled={isDisabled}>Save</Pyr.Form.SubmitButton>
    );
  }

  renderButton() {
    return this.renderSaveButton();
  }

  renderForm() {
    console.log("Missing render form");
    return null;
  }

  renderTitle() {
    return (
      <div className="flx-row title">
        <h3 className="mr-auto mb-auto mt-auto flx-row">{this.title()}</h3>
        <div className="ml-auto">{this.renderButton()}</div>
      </div>
    );
  }


  render() {
    let AComponent = this.props.notFullScreen ? Pyr.UI.DIV : FSWL;

    return (
      <AComponent className="flx-col">
        { this.renderTitle() }
        <div className="form-content mb-auto flx-1 flx-col">
          { this.renderForm() }
        </div>
      </AComponent>
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
  items() {
    return this.props.items;
  }

  componentDidMount() {
    if (!this.items()) {
      //console.log("LOADING ITEMS");
      this.props.onLoadItems(this.onLoading);
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

  renderChildren(items, selected, props={}) {
    let self = this;
    //console.log("render children");
    //console.log(this.props);

              /*onClick={this.onClicks[this.key(item)] }  */
    return (
      <ul {...Pyr.Util.propsMergeClassName(props, "")}>
        {items.map((item, pos) => {
          let isSelected = this.same(item, selected);
          //console.log("RENDERING " + item);
          return this.renderChild(item, isSelected);
        })}
      </ul>
     );
   }

  renderInnerNoScroll() {
    if (!this.items()) {
      return this.renderLoading();
    }

    if (this.items().length == 0) {
      return this.renderNone();
    }

    let items = this.items();

    return this.renderChildren(items, this.props.selected);
  }

  renderInner(props={}) {
    if (!this.items()) {
      return this.renderLoading();
    }

    if (this.items().length == 0) {
      return this.renderNone();
    }

    let items = this.items();

    return (
      <Pyr.UI.Scroll {...Pyr.Util.propsMergeClassName(props, "inner")}>
        { this.renderInnerNoScroll() }
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

  renderInner() {
    if (!this.props.selected) {
      return (
          <Pyr.UI.Loading />
      );
    }

    return (
      <div className="inner flx-col flx-1">
        { this.renderItem(this.props.selected, false) }
      </div>
    );

    // hmm was just a div
    //return (
      //<Pyr.UI.Scroll className="inner flx-col flx-1">
        //{this.renderItem(this.props.selected, false) }
      //</Pyr.UI.Scroll>
    //);
  }


}

class ShowFull extends Show {
  render() {
    return (
      <FSWL>
        { super.render() }
      </FSWL>
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
