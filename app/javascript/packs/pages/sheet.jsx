import React from 'react';
import PropTypes from 'prop-types';

import {
  Link,
  Route
} from 'react-router-dom';

import Pyr, {
  Component
} from '../pyr/pyr';
const ClassNames = Pyr.ClassNames;

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

  name() {
    let fullName = this.constructor.name;
    let pos = fullName.search("Sheet");
    if (pos == -1) {
      alert("page.jsx: You need to define a name cuz you didn't name your subclass *Sheet");
      alert(fullName);
    }
    let name = fullName.substring(0, pos);
    return name;
  }

  key(a) {
    return (a.toLowerCase() + "-" + a.id);
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

  size() {
    return 1;
  }

  getItems() {
    return this.props.items;
  }

  getItemsMap() {
    return this.props.itemsMap;
  }

  route(url) {
    console.log("ROUTE");
    console.log(this.context);
    this.context.router.history.push(url.toString());
  }

  render() {
    //if (this.state.isLoading) {
      //return (<Pyr.UI.Loading />);
    //}

    let clz = ClassNames("sheet flx-col");
    clz.push(this.name().toLowerCase());

    if (this.size()) {
      clz.push("flx-" + this.size());
    }

    return (
      <div className={clz}>
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

  name() {
    return "Form";
  }

  getTarget() {
    //console.log("FORM GET TARGET");
    return this.form;
  }

  success(data, textStatus, jqXHR) {
    //console.log("Form::success missing");
  }

  renderSaveButton() {
    let isDisabled = this.props.isLoading;

    return (
      <div>
        <Pyr.Form.SubmitButton className="mr-auto" target={this.onGetTarget} disabled={isDisabled}>Save</Pyr.Form.SubmitButton>
      </div>
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
      <div className="title">
        <h3 className="mr-auto mb-auto mt-auto">{this.title()}</h3>
      </div>
    );
  }


  render() {
    let AComponent = Pyr.UI.DIV; // this.props.notFullScreen ? Pyr.UI.DIV : FSWL;

    let clz = ClassNames("sheet flx-col");
    clz.push(this.name().toLowerCase());

    return (
      <AComponent className={clz}>
        { this.renderTitle() }
        <div className="form-content mb-auto flx-col flx-1">
          { this.renderForm() }
          { this.renderButton() }
        </div>
      </AComponent>
    );
  }

}

class Wizard extends Base {
  name() {
    return "Wizard";
  }

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
  name() {
    return "Index";
  }

  componentDidMount() {
    if (!this.getItems()) {
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

    let ALink = Link; // isSelected ? Pyr.UI.PassThru : Link; FIXME

    return (
      <li 
        key={this.key(item)} 
      ><ALink to={url.toString()}>{this.renderItem(item, isSelected)}</ALink></li>
    );
  }

  renderChildren(items, selected, props={}) {
    let self = this;

    return (
      <ul {...Pyr.Util.propsMergeClassName(props, "")}>
        {items.map((item, pos) => {
          let isSelected = this.same(item, selected);
          return this.renderChild(item, isSelected);
        })}
      </ul>
     );
   }

  renderInnerNoScroll() {
    let items = this.getItems();

    if (this.state.isLoading || !items) {
      //console.log("A");
      return this.renderLoading();
    }

    if (items.length == 0) {
      return this.renderNone();
    }

    return this.renderChildren(items, this.props.selected);
  }

  renderInner(props={}) {
    let items = this.getItems();

   // console.log("RENDER INNER");
    //console.log(this.state);
    //console.log(items);

    if (this.state.isLoading || !items) {
      //console.log("B");
      //console.log(this.state);
      //console.log(items);
      return this.renderLoading();
    }

    if (items.length == 0) {
      return this.renderNone();
    }

    return (
      <Pyr.UI.Scroll {...Pyr.Util.propsMergeClassName(props, "inner")}>
        { this.renderInnerNoScroll() }
      </Pyr.UI.Scroll>
    );
  }

}

class Previous extends Component {
  render() {
    if (!this.props.prevId) {
      return (
        <Pyr.UI.IconButton name="chevron-left" className="disabled" />
      );
    }

    let link = Pyr.URL(this.props.url).push(this.props.prevId);

    return (
      <Link to={link.toString()} ><Pyr.UI.IconButton name="chevron-left" /></Link>
    );
  }
}

class Next extends Component {
  render() {
    if (!this.props.nextId) {
      return (
        <Pyr.UI.IconButton name="chevron-right" className="disabled" />
      );
    }

    let link = Pyr.URL(this.props.url).push(this.props.nextId);

    return (
      <Link to={link.toString()} ><Pyr.UI.IconButton name="chevron-right" /></Link>
    );
  }
}

const ShowHeader = (props) => (
  <div className={ClassNames("flx-row", props.className)}>
    <div className="mr-auto flx-1">{props.title}</div>
    <div className="next-prev"><Previous prevId={props.prevId} url={props.url}/> <Next nextId={props.nextId} url={props.url}/></div>
  </div>
);


class Show extends Base {
  name() {
    return "Show";
  }

  size() {
    return 3;
  }

  componentDidMount() {
    if (!this.props.selected && this.props.itemId) {
      //console.log("GETTING SELECTED");
      this.props.onLoadItem(this.props.itemId, this.onLoading).done(result => {
        this.props.onSetSelected(result);
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.itemId != prevProps.itemId) {
      //console.log("UPDATED GETTING SELECTED");
      if (this.props.itemId && !this.props.selected) {
        alert("HMMMMM Nothing selected!!!");
        //this.props.onLoadItem(this.props.itemId, this.onLoading);
      }
    }
  }

  renderInner() {
    if (!this.props.selected) {
      //console.log("C");
      return this.renderNone();
    }

    //console.log("D");
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

class IndexShow extends Base {
  name() {
    return "IndexShow";
  }

  renderIndex() {
    return null;
  }

  renderShow() {
    return null;
  }

  render() {
    return (
      <div className="index-show flx-row flx-1">
        { this.renderIndex() }
        { this.renderShow() }
      </div>
    );
  }
}

class ShowFull extends Show {
  asPage() {
    return false;
  }

  render() {
    return (
      <FSWL asPage={this.asPage()}>
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
  name() {
    return "New";
  }

  title() {
    return null;
  }

}

class Edit extends Form {
  name() {
    return "Edit";
  }

  componentDidMount() {
    if (!this.props.selected) {
      //console.log("GETTING SELECTED");
      this.props.onLoadItem(this.props.itemId, this.onLoading);
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
  ShowHeader,
  IndexShow,
  New, 
  Edit,
  Form,
  Wizard,
};

export default Sheet;
