
// ----- IMPORTS

import * as React from 'react';

// ----- COMPONENT

const HcPushedDocsLink = props => (
	<li id={`hc-pushed-items-item_${props.listItemId}`} className={`hc-pushed-items-item ${props.listItemContent.type} mos-react-component-root`}>
		<a href={props.listItemContent.url} className={`hc-pushed-items-item-link ${props.listItemContent.type}`}>{props.listItemContent.anchorText}</a>
	</li>
);

export default HcPushedDocsLink;
