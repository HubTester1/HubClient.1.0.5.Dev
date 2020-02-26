

/* eslint class-methods-use-this: 0 */
/* eslint no-underscore-dangle: 0 */
/* eslint max-len: 0 */


import * as React from 'react';
// import { IOfficeUiFabricPeoplePickerProps } from './IOfficeUiFabricPeoplePickerProps';
import {
	// CompactPeoplePicker,
	// IBasePickerSuggestionsProps,
	NormalPeoplePicker,
} from 'office-ui-fabric-react/lib/Pickers';
import {
	assign,
	// autobind,
} from 'office-ui-fabric-react/lib/Utilities';
import { people } from './PeoplePickerExampleData';
// import { IContextualMenuItem } from 'office-ui-fabric-react/lib/ContextualMenu';
/* import {
	SPHttpClient,
	SPHttpClientBatch,
	SPHttpClientResponse,
} from '@microsoft/sp-http';
import {
	Environment,
	EnvironmentType,
} from '@microsoft/sp-core-library';
import { Promise } from 'es6-promise'; */
// import * as lodash from 'lodash';
/* import {
	IClientPeoplePickerSearchUser,
	IEnsurableSharePointUser,
	IEnsureUser,
	IOfficeUiFabricPeoplePickerState,
	SharePointUserPersona,
} from '../models/OfficeUiFabricPeoplePicker'; */
// import { IPersonaWithMenu } from 'office-ui-fabric-react/lib/components/pickers/PeoplePicker/PeoplePickerItems/PeoplePickerItem.Props';

const suggestionProps = {
	suggestionsHeaderText: 'Suggested People',
	noResultsFoundText: 'No results found',
	loadingText: 'Loading',
};

export default class OfficeUiFabricPeoplePicker extends React.Component {
	_peopleList;
	contextualMenuItems = [
		{
			key: 'newItem',
			icon: 'circlePlus',
			name: 'New',
		},
		{
			key: 'upload',
			icon: 'upload',
			name: 'Upload',
		},
		{
			key: 'divider_1',
			name: '-',
		},
		{
			key: 'rename',
			name: 'Rename',
		},
		{
			key: 'properties',
			name: 'Properties',
		},
		{
			key: 'disabled',
			name: 'Disabled item',
			disabled: true,
		},
	];
	constructor() {
		super();
		this._peopleList = [];
		people.forEach((persona) => {
			const target = {};
			assign(target, persona, { menuItems: this.contextualMenuItems });
			this._peopleList.push(target);
		});
		this.state = {
			// currentPicker: 1,
			delayResults: false,
			selectedItems: [],
		};
		this._onFilterChanged = this._onFilterChanged.bind(this);
	}

	render() {
		return (
			<NormalPeoplePicker
				onChange={this._onChange.bind(this)}
				onResolveSuggestions={this._onFilterChanged}
				getTextFromItem={persona => persona.primaryText}
				pickerSuggestionsProps={suggestionProps}
				className="ms-PeoplePicker"
				key="normal"
			/>
		);
	}

	_onChange(items) {
		this.setState({
			selectedItems: items,
		});
		if (this.props.onChange) {
			this.props.onChange(items);
		}
	}

	/* 
		A callback for what should happen when someone types text into the input. 
		Returns the already selected items so the resolver can filter them out. 
		If used in conjunction with resolveDelay this will ony kick off after the delay throttle.
	*/
	_onFilterChanged(filterText, currentPersonas, limitResults) {
		console.log('on filter changed');
		console.log(filterText);
		console.log(currentPersonas);
		console.log(limitResults);
		// 
		if (filterText) {
			if (filterText.length > 2) {
				return this._searchPeople(filterText, this._peopleList);
			}
		}
		return [];
	}

	/**
	 * @function
	 * Returns fake people results for the Mock mode
	 */
	searchPeopleFromMock() {
		this._peopleList = [
			{
				imageUrl: './images/persona-female.png',
				imageInitials: 'PV',
				primaryText: 'Annie Lindqvist',
				secondaryText: 'Designer',
				tertiaryText: 'In a meeting',
				optionalText: 'Available at 4:00pm',
			},
			{
				imageUrl: './images/persona-male.png',
				imageInitials: 'AR',
				primaryText: 'Aaron Reid',
				secondaryText: 'Designer',
				tertiaryText: 'In a meeting',
				optionalText: 'Available at 4:00pm',
			},
			{
				imageUrl: './images/persona-male.png',
				imageInitials: 'AL',
				primaryText: 'Alex Lundberg',
				secondaryText: 'Software Developer',
				tertiaryText: 'In a meeting',
				optionalText: 'Available at 4:00pm',
			},
			{
				imageUrl: './images/persona-male.png',
				imageInitials: 'RK',
				primaryText: 'Roko Kolar',
				secondaryText: 'Financial Analyst',
				tertiaryText: 'In a meeting',
				optionalText: 'Available at 4:00pm',
			},
		];
		return this._peopleList;
	}

	/**
	 * @function
	 * Returns people results after a REST API call
	 */
	_searchPeople(terms, results) {
		/* if (DEBUG && Environment.type === EnvironmentType.Local) { */
		// If the running environment is local, load the data from the mock
		return this.searchPeopleFromMock();
		/* } else {
			const userRequestUrl = `${this.props.siteUrl}/_api/SP.UI.ApplicationPages.ClientPeoplePickerWebServiceInterface.clientPeoplePickerSearchUser`;
			let principalType: number = 0;
			if (this.props.principalTypeUser === true) {
				principalType += 1;
			}
			if (this.props.principalTypeSharePointGroup === true) {
				principalType += 8;
			}
			if (this.props.principalTypeSecurityGroup === true) {
				principalType += 4;
			}
			if (this.props.principalTypeDistributionList === true) {
				principalType += 2;
			}
			const userQueryParams = {
				'queryParams': {
					'AllowEmailAddresses': true,
					'AllowMultipleEntities': false,
					'AllUrlZones': false,
					'MaximumEntitySuggestions': this.props.numberOfItems,
					'PrincipalSource': 15,
					// PrincipalType controls the type of entities that are returned in the results.
					// Choices are All - 15, Distribution List - 2 , Security Groups - 4, SharePoint Groups - 8, User - 1.
					// These values can be combined (example: 13 is security + SP groups + users)
					'PrincipalType': principalType,
					'QueryString': terms
				}
			};

			return new Promise<SharePointUserPersona[]>((resolve, reject) =>
				this.props.spHttpClient.post(userRequestUrl,
					SPHttpClient.configurations.v1, { body: JSON.stringify(userQueryParams) })
					.then((response: SPHttpClientResponse) => {
						return response.json();
					})
					.then((response: { value }) => {
						let userQueryResults: IClientPeoplePickerSearchUser[] = JSON.parse(response.value);
						let persons = userQueryResults.map(p => new SharePointUserPersona(p as IEnsurableSharePointUser));
						return persons;
					})
					.then((persons) => {
						const batch = this.props.spHttpClient.beginBatch();
						const ensureUserUrl = `${this.props.siteUrl}/_api/web/ensureUser`;
						const batchPromises: Promise<IEnsureUser>[] = persons.map(p => {
							var userQuery = JSON.stringify({ logonName: p.User.Key });
							return batch.post(ensureUserUrl, SPHttpClientBatch.configurations.v1, {
								body: userQuery
							})
								.then((response: SPHttpClientResponse) => response.json())
								.then((json: IEnsureUser) => json);
						});

						var users = batch.execute().then(() => Promise.all(batchPromises).then(values => {
							values.forEach(v => {
								let userPersona = lodash.find(persons, o => o.User.Key == v.LoginName);
								if (userPersona && userPersona.User) {
									let user = userPersona.User;
									lodash.assign(user, v);
									userPersona.User = user;
								}
							});

							resolve(persons);
						}));
					}, (error: any): void => {
						reject(this._peopleList = []);
					}));
		} */
	}

	_filterPersonasByText(filterText) {
		return this._peopleList.filter(item => this._doesTextStartWith(item.primaryText, filterText));
	}

	_removeDuplicates(personas, possibleDupes) {
		return personas.filter(persona => !this._listContainsPersona(persona, possibleDupes));
	}
	_listContainsPersona(persona, personas) {
		if (!personas || !personas.length || personas.length === 0) {
			return false;
		}
		return personas.filter(item => item.primaryText === persona.primaryText).length > 0;
	}
	_filterPromise(personasToReturn) {
		if (this.state.delayResults) {
			return this._convertResultsToPromise(personasToReturn);
		}
		return personasToReturn;
	}
	_convertResultsToPromise(results) {
		return new Promise((resolve, reject) => setTimeout(() => resolve(results), 2000));
	}
	_doesTextStartWith(text, filterText) {
		return text.toLowerCase().indexOf(filterText.toLowerCase()) === 0;
	}
}
