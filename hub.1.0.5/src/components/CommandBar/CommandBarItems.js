
// ----- IMPORTS

import * as React from 'react';
import CommandBarItem from '../CommandBar/CommandBarItem';


// ----- COMPONENT

export default props => (
	<div className="command-bar__items-container mos-react-component-root">
		{
			// if there are multiple items
			props.items[1] &&

			<ul className="command-bar__items-list mos-react-component-root">
				{
					props.items.map(itemValue => (
						<li
							className="command-bar__items-list__list-item"
							key={itemValue.key}
						>
							<CommandBarItem
								type={itemValue.type}
								name={itemValue.name}
								icon={itemValue.icon}
								ariaLabel={itemValue.ariaLabel}
								placeholder={itemValue.placeholder}
								items={itemValue.items}
								onClick={itemValue.onClick}
								onChange={itemValue.onChange}
							/>
						</li>
					))
				}
			</ul>
		}
		{
			// if there's only one item
			props.items[0] && !props.items[1] &&

			<CommandBarItem
				type={props.items[0].type}
				key={props.items[0].key}
				name={props.items[0].name}
				icon={props.items[0].icon}
				ariaLabel={props.items[0].ariaLabel}
				placeholder={props.items[0].placeholder}
				onClick={props.items[0].onClick}
				onChange={props.items[0].onChange}
			/>
		}
	</div>
);
