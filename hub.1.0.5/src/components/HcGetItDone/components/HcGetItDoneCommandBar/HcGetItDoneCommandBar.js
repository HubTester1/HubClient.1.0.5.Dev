
// ----- IMPORTS

import * as React from 'react';
import CommandBar from '../../../CommandBar/CommandBar';

// ----- COMPONENT

const HcGetItDoneCommandBar = props => (
	<div id="hc-get-it-done-command-bar" className="mos-react-component-root">
		<CommandBar
			screenType={props.screenType}
			collapseOnScreenTypes={['small']}
			scopeName="Get it Done"
			items={[
				{
					type: 'button',
					key: 'grouped',
					name: 'Grouped',
					icon: 'GridViewSmall',
					ariaLabel: 'Grouped items',
					onClick: props.handleClickViewByGroupButton,
				}, {
					type: 'button',
					key: 'alphabetical',
					name: 'Alphabetical',
					icon: 'HalfAlpha',
					ariaLabel: 'Alphabetical list',
					onClick: props.handleClickViewByAlphaButton,
				}, {
					type: 'searchBox',
					key: 'search',
					placeholder: 'Enter text to filter',
					onChange: props.handleFilterTextChange,
				},
			]}
		/>
	</div>
);

export default HcGetItDoneCommandBar;
