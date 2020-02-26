/* eslint class-methods-use-this: 0 */
/* eslint no-underscore-dangle: 0 */
/* eslint max-len: 0 */

// ----- IMPORTS

import * as React from 'react';
import { NormalPeoplePicker, ValidationState } from 'office-ui-fabric-react/lib/Pickers';
// import MOSUtilities from '../../../../services/MOSUtilities';

// ----- COMPONENT

export default class HcStaffLookupPicker extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			mostRecentlyUsed: [],
		};
		this._returnMostRecentlyUsed = this._returnMostRecentlyUsed.bind(this);
		this._filterPersonasByText = this._filterPersonasByText.bind(this);
	}
	_onFilterChanged(filterText, currentPersonas, limitResults) {
		// console.log('_onFilterChanged');
		// console.log(filterText);
		// console.log(currentPersonas);
		// console.log(limitResults);
		if (filterText) {
			// console.log('filter text exists');
			// console.log(this);
			// console.log(this._filterPersonasByText);
			let filteredPersonas = this._filterPersonasByText(filterText);
			// console.log('filteredPersonas');
			// console.log(filteredPersonas);
			filteredPersonas = this._removeDuplicates(filteredPersonas, currentPersonas);
			filteredPersonas = limitResults ? filteredPersonas.splice(0, limitResults) : filteredPersonas;
			return this._filterPromise(filteredPersonas);
		}
		return [];
	}
	_getTextFromItem(persona) {
		return persona.primaryText;
	}
	_returnMostRecentlyUsed(currentPersonas) {
		let { mostRecentlyUsed } = this.state;
		mostRecentlyUsed = this._removeDuplicates(mostRecentlyUsed, currentPersonas);
		return this._filterPromise(mostRecentlyUsed);
	}
	_filterPromise(personasToReturn) {
		if (this.state.delayResults) {
			return this._convertResultsToPromise(personasToReturn);
		}
		return personasToReturn;
	}
	_filterPersonasByText(filterText) {
		// console.log('_filterPersonasByText');
		// console.log(filterText);
		// console.log(this.props.peopleOptions);
		return this.props.peopleOptions.filter(item => this._doesTextStartWith(item.primaryText, filterText));
	}
	_doesTextStartWith(text, filterText) {
		return text.toLowerCase().indexOf(filterText.toLowerCase()) === 0;
	}
	_convertResultsToPromise(results) {
		return new Promise((resolve, reject) => setTimeout(() => resolve(results), 2000));
	}
	_removeDuplicates(personas, possibleDupes) {
		return personas.filter(persona => !this._listContainsPersona(persona, possibleDupes));
	}
	_validateInput(input) {
		if (input.indexOf('@') !== -1) {
			return ValidationState.valid;
		} else if (input.length > 1) {
			return ValidationState.warning;
		}
		return ValidationState.invalid;
	}
	_onInputChange(input) {
		console.log('input changed');
		const outlookRegEx = /<.*>/g;
		const emailAddress = outlookRegEx.exec(input);

		if (emailAddress && emailAddress[0]) {
			return emailAddress[0].substring(1, emailAddress[0].length - 1);
		}

		return input;
	}
	/* _onRemoveSuggestion(item) {
		const { peopleList, mostRecentlyUsed } = this.state;
		const indexPeopleList: number = peopleList.indexOf(item);
		const indexMostRecentlyUsed: number = mruState.indexOf(item);

		if (indexPeopleList >= 0) {
			const newPeople: IPersonaProps[] = peopleList.slice(0, indexPeopleList).concat(peopleList.slice(indexPeopleList + 1));
			this.setState({ peopleList: newPeople });
		}

		if (indexMostRecentlyUsed >= 0) {
			const newSuggestedPeople: IPersonaProps[] = mruState.slice(0, indexMostRecentlyUsed).concat(mruState.slice(indexMostRecentlyUsed + 1));
			this.setState({ mostRecentlyUsed: newSuggestedPeople });
		}
	} */
	render() {
		// console.log(this.props);
		const suggestionProps = {
			suggestionsHeaderText: 'Suggested People',
			mostRecentlyUsedHeaderText: 'Suggested Contacts',
			noResultsFoundText: 'No results found',
			loadingText: 'Loading',
			showRemoveButtons: true,
			suggestionsAvailableAlertText: 'People Picker Suggestions available',
			suggestionsContainerAriaLabel: 'Suggested contacts',
		};
		return (
			<NormalPeoplePicker
				onResolveSuggestions={this._onFilterChanged}
				onEmptyInputFocus={this._returnMostRecentlyUsed}
				getTextFromItem={this._getTextFromItem}
				pickerSuggestionsProps={suggestionProps}
				className="ms-PeoplePicker"
				key="normal"
				// onRemoveSuggestion={this._onRemoveSuggestion}
				onValidateInput={this._validateInput}
				removeButtonAriaLabel="Remove"
				/* inputProps={{
					onBlur: ev => console.log('onBlur called'),
					onFocus: ev => console.log('onFocus called'),
					'aria-label': 'People Picker',
				}} */
				/* componentRef={this._resolveRef('_picker')} */
				onInputChange={this._onInputChange}
				resolveDelay={300}
			/>

		);
	}
}
