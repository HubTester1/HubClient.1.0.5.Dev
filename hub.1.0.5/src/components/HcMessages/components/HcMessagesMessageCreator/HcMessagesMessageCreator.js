
// ----- IMPORTS

import * as React from 'react';

// ----- COMPONENT

const HcMessagesMessage = props => (
	<p className="hc-messages-message-creator mos-react-component-root">
		{/* switch to button, not anchor */}
		<span data-creator-account={props.creator.account} >
			{props.creator.displayName}
		</span>
	</p>
);

export default HcMessagesMessage;
