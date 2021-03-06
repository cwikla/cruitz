
import React, {
} from 'react';

import PropTypes from 'prop-types';

import Pyr, {
  Component
} from '../../pyr/pyr';
const ClassNames = Pyr.ClassNames;

import Page from '../page';
import Sheet from '../sheet';

import Avatar from '../shared/avatar';

import { 
  RECRUITERS_URL,
  SPAMS_URL,
  SPAM_REASONS_URL,
} from '../const';

const FAKE_RATE = 64;
const FAKE_PLACEMENT = 4;

class Header extends Component {
  render() {
    let rest = Pyr.Util.propsRemove(this.props, ["recruiter", "reviews"]);
    let recruiter = this.props.recruiter;
    let company = recruiter.company;

    let reviews = this.props.reviews;
    let count = reviews ? reviews.length : 0;

    let fullName = recruiter.full_name;
    let companyName = company.name;

    let description = recruiter.description || "";

    return (
      <div {...Pyr.Util.propsMergeClassName(rest, "recruiter-header flx-row")} >
        <div className="flx-col flx-align-center">
          <Avatar.Avatar
            user={recruiter}
            imageOnly
          />
        </div>
        <div className="flx-col">
          <div className="name">{fullName}</div>
          <div className="company">{companyName}</div>

          <div className="placements">{FAKE_PLACEMENT} placements</div>
          <div className="rate">{FAKE_RATE}% acceptance rate</div>

        </div>
        <div className="flx-col ml-auto">
          <Avatar.Stars rating={recruiter.score} />
          <div className="review-count">{count} Reviews</div>
        </div>
        <div className="blurb">{ description }</div>
      </div>
    );
  }
}


const ReviewItem = (props) => (
  <div key={props.review.id} className="review">
    <div className="flx-row">
      <div className="score"><Avatar.Stars rating={props.review.score} /></div>
      <div className="ml-auto date"><Pyr.UI.MagicDate medium date={props.review.created_at} /></div>
    </div>
    <div className="description">{props.review.description}</div>
    <div className="flx-row">
      <div className="ml-auto first-name">{props.review.from_user.first_name}</div>
    </div>
  </div>
);

class ReviewList extends Component {
  render() {
    if (!this.props.reviews) {
      return <Pyr.UI.Loading />
    }

    if (this.props.reviews.length == 0) {
      return <div>No reviews. Why not leave one?</div>
    }

    return this.props.reviews.map((review) => {
      return (
        <ReviewItem key={review.id} review={review} />
      );
    });
  }
}

class Reviews extends Component {
  constructor(props) {
    super(props);
  
    this.state = {
      reviews: []
    };
  }

  setReviews(reviews) {
    this.setState({
      reviews
    });
  }

  getReviews() {
    let url = Pyr.URL(RECRUITERS_URL).push(this.props.recruiter.id).set("reviews", "1");

    this.getJSON({
      url: url,

    }).done((data, textStatus, jqXHR) => {
      this.setReviews(data.recruiter.reviews);

    });
  }

  componentDidMount() {
    super.componentDidMount();
    this.getReviews();
  }

  render() {
    return (
      <div className="reviews flx-1 flx-col">
        <Header recruiter={this.props.recruiter} reviews={this.state.reviews}/>
        <div className="flx-1 flx-col reviews scroll">
          <ReviewList recruiter={this.props.recruiter} reviews={this.state.reviews} />
        </div>
      </div>
    );
  }
}

class ReviewsModal extends Pyr.UI.Modal {
  valid() {
    return true;
  }

  title() {
    return "Reviews for ...";
  }

  renderInner() {
    return (
      <div className="recruiter-reviews-modal">
        <Reviews recruiter={this.props.recruiter} />
      </div>
    );
  }
}


class SpamReasons extends Component {
  constructor(props) {
    super(props);

    this.initState({
      reasons: null
    });
  }

  getReasons() {
    if (this.state.reasons) {
      return;
    }

    let url = Pyr.URL(SPAM_REASONS_URL);

    this.getJSON({
      url
    }).done((data, textStatus, jqXHR) => {
      this.setState({
        reasons: data.spam_reasons
      });
    });
  }

  componentDidMount() {
    this.getReasons();
  }

  render() {
    return (
      <div className="spam-reasons flx-1">
        <Pyr.Form.Group name="reason">
          <Pyr.Form.Select>
            { (this.state.reasons || []).map( (item, pos) => {
                return (
                  <Pyr.Form.Option value={item.id} key={"spam_"+item.id}>{item.title}</Pyr.Form.Option>
                );
              })
            }
          </Pyr.Form.Select>
        </Pyr.Form.Group>
      </div>
    );
  }
}

class SpamModalInner extends Component {
  constructor(props) {
    super(props);

    this.onGetTarget = this.getTarget.bind(this);
    this.onSuccess = this.success.bind(this);
  }

  valid() {
    return true;
  }

  success() {
    this.context.setNotice(this.props.recruiter.full_name + " marked for spam!");
    if (this.props.onSuccess) {
      this.props.onSuccess();
    }
  }

  getTarget() {
    return this.form;
  }

  render() {
    let url = Pyr.URL(SPAMS_URL).push(this.props.recruiter.id);

    return (
      <div className="recruiter-spam-modal">
        <div className="message">It looks like you think {this.props.recruiter.first_name} is sending you
        terrible candidates.  Sorry about that, with help we will do better. By marking them as <span className="warning">spam</span> you will no
        longer receive candidates from them. We'll also take this into account when ranking other
        recruiters from their company {this.props.company.name}.</div>
        <div>
          <Pyr.Form.Form
            url={url}
            model="Spam"
            object={{}}
            className="mr-auto"
            ref={(node) => { this.form = node }}
            onSuccess={this.onSuccess}
            onError={this.props.onError}
          >
            <div className="flx-row">
              <SpamReasons />
              <div className="flx-row flx-1 ml-auto"><Pyr.Form.SubmitButton className="ml-auto" target={this.onGetTarget}>Mark as Spam!</Pyr.Form.SubmitButton></div>
            </div>
          </Pyr.Form.Form>
        </div>
      </div>
    );
  }
}


class SpamModal extends Pyr.UI.Modal {
  title() {
    return "Mark recruiter as spammy";
  }

  renderInner() {
    return (
      <SpamModalInner {...this.props} onSuccess={this.onClose} onError={this.onClose}/>
    );
  }
}



class Card extends Component {
  render() {
    let recruiter = this.props.recruiter;
    if (!recruiter) {
      return null;
    }

    let company = recruiter.company;
    let logo = company.logo;

    let id = "rci-" + recruiter.id;
    let allClass = ClassNames("card-item recruiter-card flx-col");

    if (this.props.selected) {
       allClass.push("selected");
    }
    allClass.push(this.props.className);

    let locations = null;
    if (company.locations) {
      locations = company.locations.map(v => {
        return v.full_name;
      }).join(", ");
    }
    locations = locations || "Unknown";


    let description = recruiter.description || "No Description";
    let companyName = company ? company.name : "Anonymous";
    let createdAt = recruiter.created_at;
    let fullName = recruiter.full_name;
    let category = "None";
    let company_url = company ? company.url : "";

    let url = recruiter.logo ? recruiter.logo.url : (logo ? logo.url : null);
/*
    console.log("URL");
    console.log(recruiter);
    console.log(logo);
    console.log(url);
*/

    return (
      <div className={allClass}>
        <div className="menu flx-row">
            <Avatar.Avatar
              user={recruiter}
              name={fullName}
            />
            <Avatar.Stars rating={Math.random() * 5.0} className="mt-auto mb-auto"/>

            <Pyr.UI.MenuToggle title="Filter with same" name="bars">
                <Pyr.UI.MenuToggleItem onClick={this.props.onClick}>Company</Pyr.UI.MenuToggleItem>
                <Pyr.UI.MenuToggleItem >Category</Pyr.UI.MenuToggleItem>
                <Pyr.UI.MenuToggleItem >Location</Pyr.UI.MenuToggleItem>
            </Pyr.UI.MenuToggle>
        </div>
        <div className="card-inner">
          <div className="name flx-row">
              { fullName }
          </div>
          <div className="company flx-row">
              { companyName }
          </div>
          <div className="company-url flx-row">
            <Pyr.UI.Icon name="link"/>&nbsp;{ company_url }
          </div>

          <div className="placements flx-row">
            { Math.floor(Math.random() * 8) } placements
          </div>
        </div>
        <div className="more flx-row mt-auto">
          <span className="ml-auto">More...</span>
        </div>
      </div>
    );

  }
}

///// HERE

class Blurb extends Component {
  constructor(props) {
    super(props);
    this.onShowSpam = this.showSpam.bind(this);
    this.onShowReviews = this.showReviews.bind(this);
  }

  showSpam(e) {
    if (e) {
      e.preventDefault();
    }

    this.spam.open();
  }

  showReviews(e) {
    if (e) {
      e.preventDefault();
    }

    this.reviews.open();
  }

  render() {
    let recruiter = this.props.recruiter;
    let rest = Pyr.Util.propsRemove(this.props, "recruiter");

    let company = recruiter.company
    let logo = company.logo;

    let reviews = this.props.reviews;
    let count = reviews ? reviews.length : 0;

    let fullName = recruiter.full_name;
    let companyName = company.name;

    let description = recruiter.description || "";

    let url = recruiter.logo ? recruiter.logo.url : (logo ? logo.url : null);
    let score = recruiter.score || 0;

    let TheBack = (logo && logo.url) ? Pyr.UI.BackgroundImage : Pyr.UI.DIV;
    let backURL = (logo && logo.url ) ? logo.url : null;

    //console.log("RECRUITER");
    //console.log(recruiter);

    return (
      <div {...Pyr.Util.propsMergeClassName(rest, "recruiter-blurb ")} >
        <SpamModal recruiter={recruiter} company={company} ref={node => this.spam = node}/>
        <ReviewsModal recruiter={recruiter} company={company} ref={node => this.reviews = node}/>

        <TheBack className="fifty" url={backURL}>
          <Pyr.UI.Fifty>
            <div className="rec-blurb-inner">
              <div>
                <div className="icon flx-row flx-start" >
                  <Pyr.UI.IconButton name="flag" className="spam" onClick={this.onShowSpam}/>
                  <Pyr.UI.IconButton name="eye" className="reviews ml-auto" onClick={this.onShowReviews}/>
                </div>
    
                <Avatar.Avatar
                  user={recruiter}
                  name={fullName}
                  userOnly
                />
                <Avatar.Stars rating={score}/>
                <div className="placements">3 placements</div>
                <div className="rate">64% acceptance rate</div>
                <div className="company">{companyName}</div>
                <div className="blurb">{description}</div>
              </div>
            </div>
          </Pyr.UI.Fifty>
        </TheBack>

      </div>
    );
  }
}

const Recruiter = {
  Blurb,
  Header,
  Card,
  Reviews,
}

export default Recruiter;
