
// ----- IMPORTS

import * as React from 'react';
import HcGetItDoneLinkContent from '../HcGetItDoneLinkContent/HcGetItDoneLinkContent';

// ----- COMPONENT

const HcGetItDoneLink = props => (
	<li id={`hc-get-it-done-item_${props.listItemKey}`} className="hc-get-it-done-item mos-react-component-root">
		<HcGetItDoneLinkContent
			listItemContent={props.listItemContent}
		/>
	</li>
);

export default HcGetItDoneLink;
