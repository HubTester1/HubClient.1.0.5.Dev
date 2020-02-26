
// ----- IMPORTS

import * as React from 'react';
import CommandBar from '../../../CommandBar/CommandBar';

// ----- COMPONENT

export default class HcMessagesCommandBar extends React.Component {
	returnCommandBarItems() {
		let hideShowButton = {
			type: 'button',
			key: 'newMessage',
			name: 'New',
			icon: 'Add',
			ariaLabel: 'Add a message',
			onClick: this.props.handleClickNewMessageButton,
		};
		if (this.props.showingNewMessageForm && !this.props.updatingMessage) {
			hideShowButton = {
				type: 'button',
				key: 'hideNewMessage',
				name: 'Hide New Message',
				icon: 'ChevronUpMed',
				ariaLabel: 'Hide the new message form',
				onClick: this.props.handleClickHideNewMessageButton,
			};
		}
		if (this.props.showingNewMessageForm && this.props.updatingMessage) {
			hideShowButton = {
				type: 'button',
				key: 'hideUpdateMessage',
				name: 'Cancel Message Modification',
				icon: 'ChevronUpMed',
				ariaLabel: 'Hide the message modification form',
				onClick: this.props.handleClickHideNewMessageButton,
			};
		}

		return [
			hideShowButton,
			{
				type: 'contextualMenu',
				key: 'tagFilter',
				name: 'Category',
				icon: 'Filter',
				items: this.returnTagFilterItems(),
				onClick: this.props.handleClickTagFilterMenuLabel,
			}, {
				type: 'searchBox',
				key: 'search',
				placeholder: 'Enter text to filter',
				onChange: this.props.handleFilterTextChange,
			},
		];
	}
	returnTagFilterItems() {
		const tagFilterItemsGenerated = this.props.tagsArray.map(tag => ({
			type: 'button',
			key: tag,
			name: tag,
			onClick: this.props.handleClickTagFilterMenuItem,
		}));
		const tagFilterItems = [
			{
				type: 'button',
				key: 'All',
				name: 'All',
				onClick: this.props.handleClickTagFilterMenuItem,
			},
			...tagFilterItemsGenerated,
		];
		return tagFilterItems;
	}
	render() {
		return (
			<div id="hc-messages-command-bar" className="mos-react-component-root">
				<CommandBar
					screenType={this.props.screenType}
					collapseOnScreenTypes={['small']}
					scopeName="Messages"
					items={this.returnCommandBarItems()}
				/>
			</div>
		);
	}
}
