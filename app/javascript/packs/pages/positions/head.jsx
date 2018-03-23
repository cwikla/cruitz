import React, { 
} from 'react';

import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';

import Sheet from '../sheet';

import {
  Link,
  Redirect
} from 'react-router-dom';

import Pyr, {
  Component
} from '../../pyr/pyr';
const ClassNames = Pyr.ClassNames;

import State from '../shared/state';
import Job from '../shared/job';
import HeadDetails from '../heads/head_details';

import {
  POSITIONS_URL,
  SEARCH_URL,
  CANDIDATES_URL,
  CATEGORIES_URL,
  LOCATIONS_URL,
  SKILLS_URL,
  COMPANIES_URL,
  HEADS_URL,


  SHOW_ACTION
} from '../const';

const RANGES = {
  0 : 'Recent',
  1 : '1 week',
  2 : '2 weeks',
  3 : '3 weeks',
  4 : '1 month',
  5 : '2 month',
  6 : '3 month',
  7 : '4 month',
  8 : '5 month',
  9 : '6 month',
  10 : 'All Time'
};

class CandidateItem extends Component {
  constructor(props) {
    super(props);
  
    this.onRemoveMe = this.removeMe.bind(this);
  }

  removeMe(e) {
    let candidate = this.props.candidate;

    this.getJSON({
      url: Pyr.URL(CANDIDATES_URL).push(candidate.id),
      context: this,
      type: Pyr.Method.DELETE,
      onLoading: this.props.onLoading,

    }).done((data, textStatus, jqXHR) => {
        this.props.onRemoveCandidate(candidate);

    }).fail((jqXHR, textStatus, errorThrown) => {
      Pyr.Network.ajaxError(jqXHR, textStatus, errorThrown);
    });
  }

  render() {
    let candidate = this.props.candidate;

    let clazzes = ClassNames("candidate-item").push(State.toClassName(candidate.state)).push("background").push("scroll-x-inner");

    return (
      <div onClick={this.onRemoveMe} className={clazzes}>
        <div>{candidate.first_name} {candidate.last_name}</div>
        <div className="">State: {State.toName(candidate.state)}</div>
        <div className="">Read At: Unread</div>
      </div>
    );
  }

}

class CandidateComponent extends Component {

  candidates() {
    return this.props.candidates;
  }

  renderAll() {
    if (!this.candidates()) {
      return (
        <div>Nothing to see here</div>
      );
    }

    let candidateCount = this.candidates().length;
    let maxForRecruiter = this.props.position.recruiter_limit || (candidateCount + 1);
    //maxForRecruiter = 10;

    console.log("LEFT: " + (maxForRecruiter - candidateCount));

    return (
      <div className="flx-row scroll-x">
        { this.candidates().map((item, pos) => {
          let key = "cand-" + item.id;
          return (
            <CandidateItem 
              key={key} 
              candidate={item}
              onRemoveCandidate={this.props.onRemoveCandidate}
            />
          );
        })}
        { Pyr.Util.times(maxForRecruiter - candidateCount, (pos) => {
            let key = "p-cand-" + pos;
            return (
              <div 
                key={key}
                className="placeholder scroll-x-inner flx-row"
              ><span className="ml-auto mr-auto">{pos+1}</span></div>
            );
          })
        } 
      </div>
    )
  }

  render() {
    
    return (
      <div className="candidates">
        { this.renderAll() }
      </div>
    );
      
  }
}


class SearchForm extends Component {
  constructor(props) {
    super(props);
    this.onGetTarget = this.getTarget.bind(this);
    this.onRenderAge = this.renderAge.bind(this);
    this.onSuccess = this.success.bind(this);
  }

  getTarget() {
    return this.form;
  }

  renderAge(value) {
    value = Math.floor(value);
    return RANGES[value];
  }

  success(data, textStatus, jqXHR) {
    this.props.onSetItems(data.jobs || []);
  }

  render() {
    return (
      <div className="position-search">
        <Pyr.Form.Form
          url={Pyr.URL(POSITIONS_URL).push("search")}
          method={Pyr.Method.POST}
          ref={(node) =>{ this.form = node; }}
          onPreSubmit={this.props.onPreSubmit}
          onPostSubmit={this.props.onPostSubmit}
          onSuccess={this.onSuccess}
          onError={this.props.onError}
          object={{}}
          model="search"
        >
          <Pyr.Form.Group name="key_words">
            <Pyr.Form.Label>Keywords</Pyr.Form.Label>
            <Pyr.Form.TextField />
          </Pyr.Form.Group>

          <Pyr.Form.Group name="companies">
            <Pyr.Form.Label>Companies</Pyr.Form.Label>
            <Pyr.Form.AutoComplete url={COMPANIES_URL} multiple valueByID bpSize="small"/>
          </Pyr.Form.Group>

          <Pyr.Form.Group name="categories">
            <Pyr.Form.Label>Categories</Pyr.Form.Label>
            <Pyr.Form.AutoComplete url={CATEGORIES_URL} multiple valueByID bpSize="small"/>
          </Pyr.Form.Group>

          <Pyr.Form.Group name="locations">
            <Pyr.Form.Label>Locations</Pyr.Form.Label>
            <Pyr.Form.AutoComplete url={LOCATIONS_URL} multiple labelKey="full_name" valueByID bpSize="small"/>
          </Pyr.Form.Group>

          <Pyr.Form.Group name="skills">
            <Pyr.Form.Label>Skills</Pyr.Form.Label>
            <Pyr.Form.AutoComplete url={SKILLS_URL} multiple bpSize="small"/>
          </Pyr.Form.Group>

          <Pyr.Form.Group name="age">
            <Pyr.Form.Label>Posting Age</Pyr.Form.Label>
            <Pyr.Form.Range
              minValue={0}
              maxValue={10}
              step={1}
              formatLabel={this.renderAge}
            />
          </Pyr.Form.Group>
        </Pyr.Form.Form>
        <div className="form-footer">
          <Pyr.Form.SubmitButton target={this.onGetTarget} disabled={this.props.isLoading}>Filter</Pyr.Form.SubmitButton>
        </div>
      </div>
    );
  }
}


class HeadPlaceholderItem extends Component {
  render() {
    return (
      <div className="placeholder section flx-col">
        <Pyr.UI.Icon name="plus" className="fa-align-center"/>
      </div>
    );
  }
}

class HeadItem extends Component {
  constructor(props) {
    super(props);

    this.onSetMe = this.setMe.bind(this);
  }

  setMe() {
    if (this.props.onSetSelected) {
      this.props.onSetSelected(this.props.head);
    }
  }

  render() {
    let position = this.props.position;
    let head = this.props.head;

    let full_name = head.full_name;
    let email = head.email;
    let title = "Sr. Programmer";
    let company = "Google";

    let phone_number = head.phone_number;

    let key = "head-" + head.id;

    let url = Pyr.URL(POSITIONS_URL).push(position.id).push("submit").push(head.id);

        //onClick={this.onSetMe}
    return (
      <Link to={url.toString()}>
      <div 
        className="head flx-row flx-1" 
        key={key}
      >
        <div className="flx-col flx-1">
          <div className="full_name">{ full_name }</div>
          <div className="current_title">{ title }</div>
          <div className="company">{ company }</div>
          <div className="phone_number">{ phone_number }</div>
          <div className="email">{ email }</div>
          <Pyr.UI.PrimaryButton className="mt-auto">Submit Me</Pyr.UI.PrimaryButton>
        </div>
      </div>
      </Link>
    );
  }
}

class Stuff extends Component {
  old_render() {
    return (
      <div className="stuff">
        <Pyr.Form.Group name="commission">
          <Pyr.Form.Label>Commission</Pyr.Form.Label>
          <Pyr.Form.TextField size={5}/>
        </Pyr.Form.Group>

        <Pyr.Form.Group name="availability">
          <Pyr.Form.Label>Availability</Pyr.Form.Label>
          <Pyr.Form.TextField />
        </Pyr.Form.Group>

        <Pyr.Form.Group name="salary_range">
          <Pyr.Form.Label>Salary Range</Pyr.Form.Label>
          <Pyr.Form.TextField />
        </Pyr.Form.Group>

        <Pyr.Form.Group name="location">
          <Pyr.Form.Label>Location</Pyr.Form.Label>
          <Pyr.Form.TextField />
        </Pyr.Form.Group>
      </div>
    );
  }

  renderComm(value) {
    return "" + value + "%";
  }

  render() {
    return (
      <div className="stuff">
        <Pyr.Form.Group name="commission">
          <Pyr.Form.Label>Commission</Pyr.Form.Label>
          <Pyr.Form.Range
            minValue={0}
            maxValue={100}
            step={1}
            formatLabel={this.renderComm}
          />
        </Pyr.Form.Group>
      </div>
    );
  }
}

class ActualForm extends Component {
}

class HeadForm extends Sheet.Form {
  constructor(props) {
    super(props);

    this.onSuccess = this.success.bind(this);
    this.onGetTarget = this.getTarget.bind(this);
  }

  success(data, textStatus, jqXHR) {
    this.goBack();
  }

  title() {
    let name = this.props.head.first_name;

    return "Submit " + name + " for " + this.props.position.title;
  }

  renderButton() {
    return (
      <Pyr.Form.SubmitButton target={this.onGetTarget} disabled={this.props.isLoading}>Submit Candidate</Pyr.Form.SubmitButton>
    );
  }

  renderActualForm() {
    let url = Pyr.URL(CANDIDATES_URL);

    let head = this.props.head;
    let position = this.props.position;

    return (
      <div className="head-form flx-1">
        <Pyr.Form.Form
          model="candidate"
          object={this.props.candidate}
          url={url}
          method={Pyr.Method.POST}
          id="candidate-form"
          ref={node => this.form = node}
          onSuccess={this.onSuccess}
        >
          <Stuff {...this.props}/>

          <Pyr.Form.Group name="message">
            <Pyr.Form.Label>Message for Hiring Manager</Pyr.Form.Label>
            <Pyr.Form.TextArea />
          </Pyr.Form.Group>

          <Pyr.Form.Group name="files">
            <Pyr.Form.Label>Attachments</Pyr.Form.Label>
            <Pyr.Form.FileSelector multiple/>
          </Pyr.Form.Group>



          <Pyr.Form.Group name="head" className="hidden">
            <Pyr.Form.Hidden value={head.id} />
          </Pyr.Form.Group>

          <Pyr.Form.Group name="job" className="hidden">
            <Pyr.Form.Hidden value={position.id} />
          </Pyr.Form.Group>

        </Pyr.Form.Form>
      </div>
    );
  }

  renderForm() {
    console.log("RENDER FORM");
    console.log(this.props);

    return (
      <div className="form-parent">
        <Job.Header {...this.props} />
        <div className="flx-row flx-1">
          <div className="section flx-4 left">
            { this.renderActualForm() }
          </div>
          <div className="section flx-5 right">
            <HeadDetails.Primary {...this.props} />
            <HeadDetails.SocialLinks {...this.props} />
            <HeadDetails.Skills {...this.props} />
            <HeadDetails.WorkHistory {...this.props} />
          </div>
        </div>
      </div>
    );
  }


}

class HeadIndexSheet extends Sheet.Index {
  key(item) {
    return item.id;
  }

  constructor(props) {
    super(props);
    this.initState({
      heads : null,
      selected: null,
      showSubmit: false
    });

    this.onLoadItems = this.loadItems.bind(this);
    this.onSetHeads = this.setHeads.bind(this);
    //this.onSetSelected = this.setSelected.bind(this);
    this.onCloseModal = this.closeModal.bind(this);
  }

  getItems() {
    return this.state.heads;
  }

  setSelected(unused) {
  }

  submitSelected(head) {

    this.getJSON({
      url: CANDIDATES_URL,
      context: this,
      type: Pyr.Method.POST,
      data: { candidate: {
        head: head.id,
        job: position.id
      }},
      onLoading: this.props.onLoading,

    }).done((data, textStatus, jqXHR) => {
        this.props.onAddCandidate(data.candidate);

    }).fail((jqXHR, textStatus, errorThrown) => {
      Pyr.Network.ajaxError(jqXHR, textStatus, errorThrown);
    });
  }

  setHeads(heads) {
    console.log("HEADS");
    console.log(heads);

    this.setState({
      heads
    });
  }

  loadItems(onLoading) {

    this.getJSON({
      url: HEADS_URL,
      context: this,
      onLoading: onLoading,

    }).done((data, textStatus, jqXHR) => {
        this.onSetHeads(data.heads || []);

    }).fail((jqXHR, textStatus, errorThrown) => {
      Pyr.Network.ajaxError(jqXHR, textStatus, errorThrown);
    });
  }

  componentDidMount() {
    if (!this.state.heads) {
      this.onLoadItems(this.props.onLoading);
    }
  }

  renderChild(item, isSelected) {
    let url = this.childURL(item, isSelected);

    return (
      <li
        key={this.key(item)}
      >{this.renderItem(item, isSelected)}</li>
    );
  }

  renderChildren(items, isSelected) {
    return super.renderChildren(items, isSelected, {className: "heads flx flx-col flx-1"})
  }

  renderItem(item) {
    return (
      <HeadItem 
        head={item} 
        position={this.props.position}
        onSetSelected={this.onSetSelected}
      />
    );
  }

  renderInner() {
    if (!this.getItems()) {
      return this.renderLoading();
    }

    if (this.getItems().length == 0) {
      return this.renderNone();
    }

    let leftClasses = "flx-col scroll chooser-search";
    let rightClasses = "flx-3 flx-col scroll chooser-heads";

    let url = Pyr.URL(HEADS_URL).push("new");

    return (
      <div className="chooser flx-row">
        <div className={leftClasses}>
          <SearchForm
            onSetItems={this.props.onSetItems}
            onPreSubmit={this.props.onPreSubmit}
            onPostSubmit={this.props.onPostSubmit}
            onError={this.props.onError}
          />
        </div>
        <div className={rightClasses}>
          { super.renderInnerNoScroll() }
        </div>
      </div>
    );
  }

  closeModal() {
    this.setState({
      selected: null
    });
  }

}

export {
  HeadForm,
  CandidateComponent,
};

export default HeadIndexSheet;
