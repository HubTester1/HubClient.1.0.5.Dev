

/* eslint class-methods-use-this: 0 */
/* eslint no-underscore-dangle: 0 */
/* eslint max-len: 0 */

// ----- IMPORTS

import * as React from 'react';
import { NormalPeoplePicker } from 'office-ui-fabric-react/lib/Pickers';
import { assign } from 'office-ui-fabric-react/lib/Utilities';
import { HttpClient } from 'sp-pnp-js';

import { people } from './PeoplePickerExampleData';
import EnvironmentDetector from '../../../../services/EnvironmentDetector';

// ----- COMPONENT

export default class OfficeUiFabricPeoplePicker extends React.Component {
	peopleList;
	contextualMenuItems = [
		{
			key: 'newItem',
			icon: 'circlePlus',
			name: 'New',
		}, {
			key: 'upload',
			icon: 'upload',
			name: 'Upload',
		}, {
			key: 'divider_1',
			name: '-',
		}, {
			key: 'rename',
			name: 'Rename',
		}, {
			key: 'properties',
			name: 'Properties',
		}, {
			key: 'disabled',
			name: 'Disabled item',
			disabled: true,
		},
	];


	constructor() {
		super();
		// set up container for all of the... idk
		this.peopleList = [];

		people.forEach((persona) => {
			const target = {};
			assign(target, persona, { menuItems: this.contextualMenuItems });
			this.peopleList.push(target);
		});
		this.state = {
			pickedPeople: [],
		};
		this._onFilterChanged = this._onFilterChanged.bind(this);
		this._onChange = this._onChange.bind(this);
	}

	render() {
		const suggestionProps = {
			suggestionsHeaderText: 'Suggested People',
			noResultsFoundText: 'No results found',
			loadingText: 'Loading',
		};
		return (
			<NormalPeoplePicker
				onChange={this._onChange}
				onResolveSuggestions={this._onFilterChanged}
				getTextFromItem={persona => persona.primaryText}
				pickerSuggestionsProps={suggestionProps}
				className="ms-PeoplePicker"
				key="normal"
			/>
		);
	}

	/* 
		called happen when someone enters text into the input;
		(Returns the already selected items so the resolver can filter them out. 
		If used in conjunction with resolveDelay this will ony kick off after the delay throttle.)
	*/
	_onFilterChanged(filterText, currentPersonas, limitResults) {
		// 
		if (filterText) {
			// if (filterText.length > 2) {
			return this._searchPeople(filterText, this.peopleList);
			// }
		}
		return [];
	}

	/* 
		called when a person is picked
	*/
	_onChange(pickedPeopleReturnedFromPicker) {
		this.setState({
			pickedPeople: pickedPeopleReturnedFromPicker,
		});
		this.props.setSelectedPersonas(pickedPeopleReturnedFromPicker);
	}


	_searchPeople(terms, results) {
		console.log(terms, results);
		// if environment is SharePoint
		if (EnvironmentDetector.ReturnIsSPO()) {
			return new Promise((resolve, reject) => {
				const client = new HttpClient();
				const searchString = terms;
				const endpointUrl = 'https://bmos.sharepoint.com/_api/SP.UI.ApplicationPages.ClientPeoplePickerWebServiceInterface.clientPeoplePickerSearchUser';
				client.post(endpointUrl, {
					headers: {
						Accept: 'application/json; odata=verbose',
					},
					body: JSON.stringify({
						queryParams: {
							__metadata: {
								type: 'SP.UI.ApplicationPages.ClientPeoplePickerQueryParameters',
							},
							AllowEmailAddresses: true,
							AllowMultipleEntities: false,
							AllUrlZones: false,
							MaximumEntitySuggestions: 50,
							PrincipalSource: 15,
							// PrincipalType controls the type of entities that are returned in the results.
							// Choices are All - 15, Distribution List - 2 , Security Groups - 4, SharePoint Groups - 8, User - 1.
							// These values can be combined (example: 13 is security + SP groups + users)
							PrincipalType: 15,
							QueryString: searchString,
						},
					}),
				})
					.then(response => response.json())
					.then((data) => {
						const userQueryResults = JSON.parse(data.d.ClientPeoplePickerSearchUser);
						const persons = userQueryResults.map(personData => ({
							_user: personData,
							primaryText: personData.DisplayText,
							secondaryText: personData.EntityData.Title,
							// tertiaryText: personData.EntityData.Department,
							imageShouldFadeIn: true,
							imageUrl: `/_layouts/15/userphoto.aspx?size=S&accountname=${personData.Key.substr(personData.Key.lastIndexOf('|') + 1)}`,
						}));
						resolve(persons);
					});


				/* .then((persons) => {
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
					})); */
			});
			// if environment is NOT SharePoint
		}
		return this.searchPeopleFromMock();
	}
	searchPeopleFromMock() {
		this.peopleList = [
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
		return this.peopleList;
	}


	/* _filterPersonasByText(filterText) {
		return this.peopleList.filter(item => this._doesTextStartWith(item.primaryText, filterText));
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
	} */
}
