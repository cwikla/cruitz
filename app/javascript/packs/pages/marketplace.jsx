import React from 'react';
import PropTypes from 'prop-types';
import {
  render
} from 'react-dom';

import {
  Link,
  Redirect,
  BrowserRouter as Router,
} from 'react-router-dom';

import Pyr, {
  Component 
} from '../pyr/pyr';


import {
  GALLERY_PAGE,

  ME_URL,
} from './const';

import Container from './container';

import GalleryPage from './gallery/gallery_page';
import MessagesPage from './messages/messages_page';

class HolderPage extends Container {
  render() {
    return (
      <h1>Marketplace goes here</h1>
    );
  }
}

const HOLDER_PAGE = 'Holder';
const DEFAULT_PAGE = GALLERY_PAGE;

const PAGE_MAP = {
  "home" : GalleryPage,
  [HOLDER_PAGE.toLowerCase()]: HolderPage,
  [GALLERY_PAGE.toLowerCase()]: GalleryPage,
};

class MarketPlace extends Container {
  componentDidMount() {
    this.setState({
      loading: false
    });
  }

  getDefaultPage() {
    return GALLERY_PAGE;
  }

  pageToComponent(page) {
    return super.pageToComponent(page) || PAGE_MAP[page];
  }

  renderSideBar() {
    return (
      <div
        className="col col-1 col-sm-1 col-md-2 flx-col h-100"
      >
        <Pyr.Form.Form
          model="gallery"
        >
          <Pyr.Form.Group name="sally">
            <Pyr.Form.Range />
          </Pyr.Form.Group>
        </Pyr.Form.Form>
      </div>
    );
  }

}

render (
  <Pyr.UserProvider url={Pyr.URL(ME_URL)}>
    <Pyr.UI.NoticeProvider>
      <Pyr.RouterProps component={MarketPlace} />
    </Pyr.UI.NoticeProvider>
  </Pyr.UserProvider>,

  document.getElementById('react-container')
);
