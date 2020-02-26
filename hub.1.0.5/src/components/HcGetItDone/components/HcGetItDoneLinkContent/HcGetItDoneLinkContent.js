
// ----- IMPORTS

import * as React from 'react';

// ----- COMPONENT

const HcGetItDoneLinkContent = props => (
	<div className="hc-get-it-done-item-content mos-react-component-root">
		<p className="hc-get-it-done-item-link-container"><a href={props.listItemContent.url} className={`hc-get-it-done-item-link ${props.listItemContent.type}`}>{props.listItemContent.anchorText}</a></p>
		<p className="hc-get-it-done-item-description-container">{props.listItemContent.description}</p>
	</div>
);

export default HcGetItDoneLinkContent;
