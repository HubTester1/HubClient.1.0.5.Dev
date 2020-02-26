
// ----- IMPORTS

import * as React from 'react';
import Collapsible from '../Collapsible/Collapsible';
import CommandBarItems from '../CommandBar/CommandBarItems';

// ----- COMPONENT

export default (props) => {
	// assume we won't collapse
	let collapse = false;
	// if there are 2+ items to render; there's no point in collapsing only one item
	if (props.items[1]) {
		// if this screenType is one of those on which to collapse
		props.collapseOnScreenTypes.forEach((screenTypeToCollapseOnValue) => {
			if (screenTypeToCollapseOnValue === props.screenType) {
				// indicate collapse
				collapse = true;
			}
		});
	}
	return (
		<div className="command-bar mos-react-component-root">
			{
				props.items[0] && collapse && 

				<Collapsible
					textCollapsed={`Reveal ${props.scopeName} commands`}
					textExpanded={`Hide ${props.scopeName} commands`}
					iconNameCollapsed="More"
					iconNameExpanded="More"
					buttonClassName="command-bar__collapsible-button"
					buttonPosition="beforeContent"
				>
					<CommandBarItems
						items={props.items}
					/>
				</Collapsible>
			}
			{
				props.items[0] && !collapse &&

				<CommandBarItems
					items={props.items}
				/>
			}
		</div>
	); 
};
