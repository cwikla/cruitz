import React from 'react';
import PropTypes from 'prop-types';

import {
  Link,
} from 'react-router-dom';

import Pyr, {
  Component
} from '../../pyr/pyr';

const ClassNames = Pyr.ClassNames;

const WEB_LINK_WEB = 0;
const WEB_LINK_IN = 1;
const WEB_LINK_GITHUB = 2;
const WEB_LINK_DRIBBBLE = 3;
const WEB_LINK_QUORA = 4;
const WEB_LINK_FACEBOOK = 5;
const WEB_LINK_TWITTER = 6;
const WEB_LINK_ANGELIST = 7;
const WEB_LINK_YOUTUBE = 8;
const WEB_LINK_WORDPRESS = 9;
const WEB_LINK_MEDIUM = 10;
const WEB_LINK_GOOGLE = 11;


const WEB_LINK_TO = {
  [WEB_LINK_IN] : "linkedin-in",
  [WEB_LINK_GITHUB] : "github",
  [WEB_LINK_DRIBBBLE] : "dribbble",
  [WEB_LINK_QUORA] : "quora",
  [WEB_LINK_FACEBOOK] : "facebook-f",
  [WEB_LINK_TWITTER] : "twitter",
  [WEB_LINK_ANGELIST] : "angellist",
  [WEB_LINK_YOUTUBE] : "youtube",
  [WEB_LINK_WORDPRESS] : "wordpress",
  [WEB_LINK_MEDIUM] : "medium",
  [WEB_LINK_GOOGLE] : "google",
};

const LINK_ALL = [
    [WEB_LINK_IN, 'linkedin.com'],
    [WEB_LINK_GITHUB, 'github.com'],
    [WEB_LINK_DRIBBBLE, 'dribbble.com'],
    [WEB_LINK_QUORA, 'quora.com'],
    [WEB_LINK_FACEBOOK, 'facebook.com',],
    [WEB_LINK_TWITTER, 'twitter.com'],
    [WEB_LINK_ANGELIST, 'angel.co'],

    [WEB_LINK_YOUTUBE, 'youtube.co'],
    [WEB_LINK_WORDPRESS, 'wordpress.co'],
    [WEB_LINK_MEDIUM, 'medium.co'],
    [WEB_LINK_GOOGLE, 'google.co'],
    [WEB_LINK_WEB, null],
  ];


function auto_ltype(url) {
  let durl = url.toLowerCase();

  for(let item of LINK_ALL) {
    if (item[1] && durl.includes(item[1])) {
      return item[0];
    }
  }
  return WEB_LINK_WEB;
}


const Icon = (props) => (
  <Pyr.UI.Icon name={props.name || "link"} {...Pyr.Util.propsRemove(props, ["name"])} />
);

const LinkIcon = (props) => (
  <Icon brand={!!WEB_LINK_TO[props.ltype]} name={WEB_LINK_TO[props.ltype]} {...Pyr.Util.propsRemove(props, ["ltype"])} />
);

const LinkObj = (props) => (
  <a href={props.webLink.url} target="_cruitz"><LinkIcon ltype={props.webLink.ltype} /></a>
);

class EditLinkObj extends Component {
    constructor(props) {
      super(props); 
   
      this.onPreClick = this.preClick.bind(this); 
    }

    preClick(e) {
      if (this.props.onClick) {
        this.props.onClick(e, this.props.webLink);
      }
    }

    render() {
      return (
        <LinkIcon ltype={this.props.webLink.ltype} onClick={this.onPreClick}/> 
      );
    }
}

const Lock = (props) => (
  <Pyr.UI.Icon brand={!!WEB_LINK_TO[props.webLink.ltype]}  name={WEB_LINK_TO[props.webLink.ltype]} className="locked"/>
);

class LinkMakerModal extends Pyr.UI.Modal {
  constructor(props) {
    super(props);

    this.initState({
      item: props.item || {}
    });

    this.onGetTarget = this.getTarget.bind(this);
    this.onSuccess = this.success.bind(this);
    this.onChange = this.change.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.item != prevProps.item) {
      //console.log("SETTING STATE IN UPDATE");
      //console.log(this.props);
      this.setState({
        item: this.props.item || {}
      });
    }
  }

  change(e) {
    let url = e.target.value;
    if (url) {
      url = $.trim(url);
    }

    let ltype = auto_ltype(url);


    this.setState({
      item: {
        url: url,
        ltype
      }
    });

    //console.log("LTYPE:" + ltype);
  }

  close() {
    //console.log("CLOSE");
    this.setState({
      item: {}
    });
    super.close();
  }

  valid() {
    return true;
  }

  success() {
    if (this.props.onSuccess) {
      //console.log("SUCCESS");
      //console.log(this.state.value);
      //console.log(this.state.ltype);

      let value = Object.assign({}, this.props.item || {}, this.state.item); // will catch id
      this.props.onSuccess(value);
    }
    this.close();
  }

  getTarget() {
    return this.form;
  }


  title() {
    return "Link Maker";
  }

  renderField() {
    return (
      <Pyr.PassThru>
        <Pyr.Form.Group name="link">
          <div className="flx-row"><LinkIcon ltype={this.state.item.ltype || 0} /> <Pyr.Form.TextField autoFocus disabled={!this.props.open} value={this.state.item.url} noSubmit onChange={this.onChange} onSubmit={this.onSuccess}/></div>
        </Pyr.Form.Group>
        <Pyr.UI.PrimaryButton onClick={this.onSuccess}>"Save"</Pyr.UI.PrimaryButton>
      </Pyr.PassThru>
    );
  }

  renderInner() {
    let url = Pyr.URL("link_url");

    let isDisabled = false;

    return (
      <div className="link-maker-modal">
        { this.props.edit ? this.renderField() : null }
      </div>
    );
  }
}

class Links extends Component {
  constructor(props) {
    super(props);

    this.initState({
      item: null,
      showModal: false,
      links: (this.props.links || []).slice()
    });

    this.onShowModal = this.showModal.bind(this);
    this.onCloseModal = this.closeModal.bind(this);
    this.onAddLink = this.addLink.bind(this);
    this.onEditLink = this.editLink.bind(this);
    this.onRemoveLink = this.removeLink.bind(this);
  }

  showModal(e, item) {
    //console.log("SHOW MODAL");
    //console.log(e);
    //console.log(item);

    if (e) {
      e.preventDefault();
    }
    this.setState({
      item: item, 
      showModal: true,
    });
  }

  closeModal(e) {
    if (e) {
      e.preventDefault();
    }
    this.setState({
      showModal: false
    });
  }

  addLink(l) {
    if (l.id) {
      return this.editLink(l);
    }

    let links = this.state.links.slice();
    links.push({url: l.url, ltype: l.ltype || WEB_LINK_WEB, id: Pyr.Util.uuid()});

    this.setState({
      links
    });
  }

  editLink(l) {
    let links = this.state.links.slice();
    let pos = links.findIndex(e => {
      return e.id == l.id;
    });
    if (pos >= 0) {
      Object.assign(links[pos], l);
    }
    this.setState({
      links
    });
  }

  removeLink(pos) { // change to id
    let links = this.state.links.slice(0, pos) + this.state.links.slice(pos+1, this.state.links.length);
    this.setState({
      links
    });
  }

  getLinks() {
    return (!this.props.edit  ? this.props.links : this.state.links) || [];
  }

  renderEdit() {
    if (!this.props.edit) {
      return null;
    }

    let webLinks = this.getLinks();

    return (
      <Pyr.PassThru>
        <Pyr.Form.Group name="links" className="hidden">
          { webLinks.map( (item, pos) => {
              return (
                <Pyr.Form.Hidden key={"hid-link"+pos} value={item.url} />
               );
             })
          }
        </Pyr.Form.Group>
       { webLinks.length == 0 ? <Icon className="placeholder"/> : null }
        <Pyr.UI.IconButton className="mt-auto mb-auto" name="plus" onClick={this.onShowModal}> Add Link</Pyr.UI.IconButton> 
        <LinkMakerModal open={this.state.showModal} onClose={this.onCloseModal} onSuccess={this.onAddLink} edit={this.props.edit} item={this.state.item}/>
      </Pyr.PassThru>
    );
  }

  render() {
    let webLinks = this.getLinks();

    if (!webLinks) {
      return null;
    }

    let locked = this.props.locked;
    let edit = this.props.edit;

    let WebLinkComp = locked ? Lock : (edit ? EditLinkObj : LinkObj);

    return (
      <div id="web-links" className="cv-section web-links flx-row">
        {
          webLinks.map( (item, pos) => {
            return (<div className="web-link flx-0 flx-nowrap" key={"web-lnk"+item.id}>
                      <WebLinkComp 
                        key={"web-lnk2"+item.id} 
                        webLink={item} 
                        edit={edit}
                        onClick={this.onShowModal}
                      />
                    </div>);
          })
        }
        { this.renderEdit() }
      </div>
    );
  }
}

const WebLink = {
  Link : LinkObj,
  Lock,
  Links,
};

export default WebLink;

