
// ----- IMPORTS

import * as React from 'react';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';

// ----- COMPONENT

export default (props) => (
		<div className="command-bar__contextual-menu mos-react-component-root">
			<DefaultButton
				iconProps={{ iconName: props.icon }}
				text={props.text}
				className="command-bar__button"
				menuProps={{
					shouldFocusOnMount: true,
					isBeakVisible: false,
					items: props.items,
				}}
			/>
		</div>
	);
