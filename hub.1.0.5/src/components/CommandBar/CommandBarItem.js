
// ----- IMPORTS

import * as React from 'react';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { SearchBox } from 'office-ui-fabric-react/lib/SearchBox';
import CommandBarContextualMenu from '../CommandBar/CommandBarContextualMenu';

// ----- COMPONENT

export default props => (
	<div className="command-bar__item mos-react-component-root">
		{
			props.type === 'button' &&

			<DefaultButton
				iconProps={{ iconName: props.icon }}
				text={props.name}
				key={props.name}
				ariaLabel={props.ariaLabel}
				className="command-bar__button"
				onClick={props.onClick}
			/>
		}
		{
			props.type === 'searchBox' &&

			<SearchBox
				iconProps={{ iconName: props.icon }}
				placeholder={props.placeholder}
				className="command-bar__search-box"
				onChange={props.onChange}
			/>
		}
		{
			props.type === 'contextualMenu' &&

			<CommandBarContextualMenu
				icon={props.icon}
				key={props.key}
				text={props.name}
				items={props.items}
			/>
		}
	</div>
);
