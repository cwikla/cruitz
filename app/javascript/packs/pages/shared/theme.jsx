import React, {
} from 'react';

import Pyr, {
  Component
} from '../../pyr/pyr';

const SectionTitle = (props) => (
  <div {...Pyr.Util.propsMergeClassName(props, "section-title")}>
    <h3 className="mr-auto mb-auto mt-auto">{props.children}</h3>
  </div>
);

const Title = {
  Section: SectionTitle
};

const Theme = {
  Title
};

export default Theme;
