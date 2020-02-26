
// ----- IMPORTS

import * as React from 'react';
import { Dropdown } from 'office-ui-fabric-react/lib/Dropdown';

// ----- COMPONENT

export default class HcMessagesTagDropdown extends React.Component {
	returnTagDropdownOptions() {
		const tagsArray = this.props.tagsArray.map(tag => ({
			key: tag,
			text: tag,
		}));
		tagsArray.unshift({ key: '', text: '' });
		return tagsArray;
	}
	/**
	 * @todo Change hubMessagesSettings tags to have only their name
	 * @todo Change Dropdown to use name as key
	 * @todo Migrate messages with tag names only, as string, not array
	 */
	render() {
		return (
			<div className="hc-messages-tag-dropdown mos-react-component-root">
				<Dropdown
					label="Category"
					ariaLabel="Message category"
					options={this.returnTagDropdownOptions()}
					selectedKey={this.props.selectedKey}
					onChanged={this.props.onChanged}
					required
				/>
			</div>
		);
	}
}
