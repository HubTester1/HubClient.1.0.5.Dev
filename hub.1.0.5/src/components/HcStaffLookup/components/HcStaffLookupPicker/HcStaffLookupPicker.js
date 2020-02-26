

/* eslint class-methods-use-this: 0 */
/* eslint no-underscore-dangle: 0 */
/* eslint max-len: 0 */

// ----- IMPORTS

import * as React from 'react';
import { NormalPeoplePicker } from 'office-ui-fabric-react/lib/Pickers';
import HcStaffLookupData from '../../HcStaffLookupData';

// ----- COMPONENT

export default class HcStaffLookupPicker extends React.Component {
	constructor() {
		super();
		this.state = {
			pickedPeople: [],
		};
		this.handleTextInputChange = this.handleTextInputChange.bind(this);
		this.handlePick = this.handlePick.bind(this);
	}
	/* 
		called happen when someone enters text into the input;
		(Returns the already selected items so the resolver can filter them out. 
		If used in conjunction with resolveDelay this will ony kick off after the delay throttle.)
	*/
	handleTextInputChange(filterText, currentPersonas, limitResults) {
		if (filterText) {
			return HcStaffLookupData.ReturnPeoplePickerOptions(filterText, this.state.pickedPeople);
		}
		return [];
	}
	// called when a person is picked
	handlePick(pickedPeopleReturnedFromPicker) {
		this.setState({
			pickedPeople: pickedPeopleReturnedFromPicker,
		});
		this.props.setSelectedPersonasFromPeoplePickerData(pickedPeopleReturnedFromPicker);
	}
	render() {
		const suggestionProps = {
			suggestionsHeaderText: 'Suggested People',
			noResultsFoundText: 'No results found',
			loadingText: 'Loading',
		};
		return (
			<NormalPeoplePicker
				onChange={this.handlePick}
				onResolveSuggestions={this.handleTextInputChange}
				getTextFromItem={persona => persona.primaryText}
				pickerSuggestionsProps={suggestionProps}
				className="ms-PeoplePicker"
				key="normal"
			/>
		);
	}
}
