

/* eslint class-methods-use-this: 0 */
/* eslint no-underscore-dangle: 0 */
/* eslint max-len: 0 */

// ----- IMPORTS

import { HttpClient } from 'sp-pnp-js';
import shortid from 'shortid';

import APIClient from '../../services/APIClient';
import MOSUtilities from '../../services/MOSUtilities';

// ----- DATA

export default class HcStaffLookupData {
	static ReturnPersonaDataUsingPeoplePickerData(peoplePickerData) {
		// return a promise to return the persona data
		return new Promise((resolve, reject) => {
			// get the last array element; we handle one at a time, 
			// 		so the others have been handled already
			const lastPersonInPicker = peoplePickerData[peoplePickerData.length - 1];
			// extract the account value
			const lastPersonInPickerAccount = MOSUtilities.ReplaceAll('@mos.org', '', lastPersonInPicker._user.Key
				.substr(lastPersonInPicker._user.Key.lastIndexOf('|') + 1));
			// get a promise to get the relevant person's full set of data using lastPersonInPickerAccount
			APIClient.ReturnAPIData(`https://neso.mos.org/activeDirectory/user/${lastPersonInPickerAccount}`)
				// if the promise was resolved with the full set of data
				.then((response) => {
					if (response !== null) {
						// extract the persona data from the full set of data
						const personaData = {
							key: shortid.generate(),
							account: response.account,
							displayName: response.displayName,
							firstInitial: response.firstInitial,
							lastInitial: response.lastInitial,
							title: response.title,
							department: response.department,
							officePhone: response.officePhone,
							email: response.email,
							photoURL: `/_layouts/15/userphoto.aspx?size=M&accountname=${response.account}@mos.org`,							
						};
						if (response.officePhone && response.officePhone !== '-') {
							personaData.officePhone = response.officePhone;
						}
						if (response.mobilePhone && response.mobilePhone !== '-') {
							personaData.mobilePhone = response.mobilePhone;
						}
						if (lastPersonInPicker._user.EntityData.ObjectId) {
							personaData.profileToken = lastPersonInPicker._user.EntityData.ObjectId;
						}
						// resolve this promise with the persona data
						resolve(personaData);
					} else {
						// construct a placeholder persona
						const personaData = {
							key: shortid.generate(),
							account: lastPersonInPickerAccount,
							displayName: lastPersonInPicker._user.DisplayText,
							uiMessage: 'Sorry, I can\'t find much information about this person',
						};
						// respond with placeholder persona
						resolve(personaData);
					}
				})
				// if the promse was not resolved with the full set of data
				.catch((error) => {
					// construct a placeholder persona
					const personaData = {
						key: shortid.generate(),
						account: lastPersonInPickerAccount,
						displayName: lastPersonInPicker._user.DisplayText,
						uiMessage: 'Sorry, I can\'t find much information about this person',
					};
					// respond with placeholder persona
					resolve(personaData);
				});
		});
	}
	
	static ReturnPeoplePickerOptions(terms, results) {
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
						PrincipalType: 1,
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
