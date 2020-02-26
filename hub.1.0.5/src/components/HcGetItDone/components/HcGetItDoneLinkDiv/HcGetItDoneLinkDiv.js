
// ----- IMPORTS

import * as React from 'react';
import HcGetItDoneLinkContent from '../HcGetItDoneLinkContent/HcGetItDoneLinkContent';

// ----- COMPONENT

const HcGetItDoneLinkDiv = props => (
	<div id={`hc-get-it-done-item_${props.listItemKey}`} className="hc-get-it-done-item mos-react-component-root">
		<HcGetItDoneLinkContent
			listItemContent={props.listItemContent}
		/>
	</div>
);

export default HcGetItDoneLinkDiv;
