
// ----- IMPORTS

import { Web } from 'sp-pnp-js';
import shortID from 'shortid';
import APIClient from '../../services/APIClient';

// ----- DATA

export default class HcGetItDoneData {
	static ReturnHRDocsForHcOrg() {
		const hrDocsWeb = new Web('https://bmos.sharepoint.com');
		return hrDocsWeb.lists.getByTitle('HR Docs').items
			.select('FileLeafRef', 'ServerRedirectedEmbedUrl', 'Title', 'HubKey')
			.filter("Category eq 'Organization Charts'")
			.get();
	}

	static ReturnHubDocsForHcOrg() {
		const hrDocsWeb = new Web('https://bmos.sharepoint.com');
		return hrDocsWeb.lists.getByTitle('HubDocs').items
			.select('FileLeafRef', 'ServerRedirectedEmbedUrl', 'Title', 'HcOrgName')
			.filter('HcOrgName ne null')
			.get();
	}

	static ReturnAPIDataForHcOrg() {
		return new Promise((resolve, reject) => {
			APIClient
				.ReturnAPIData('https://neso.mos.org/hcOrg/allOrg')
				.then((response) => {
					resolve(response);
				})
				.catch((error) => {
					reject(error);
				});
		});
	}

	static ReturnAllOrganizationData() {
		// return a new promise
		return new Promise(((resolve, reject) => {
			// collect data async from multiple sources
			const listItemQueryPromises = [
				this.ReturnHRDocsForHcOrg(),
				this.ReturnHubDocsForHcOrg(),
				this.ReturnAPIDataForHcOrg(),
			];
			// wait for the promises for all queries
			Promise.all(listItemQueryPromises)
				// if the promises are resolved with the data
				.then((resultsReturnArray) => {
					// set up vars
					let orgChartsReturn;
					let divDeptWTeamsReturn;
					let otherContactsReturn;
					const finalResolution = {
						divDeptWTeams: [],
						nonDivDeptTeams: [],
						otherContacts: [],
					};
					// extract data from the queries
					resultsReturnArray.forEach((resultValue) => {
						if (resultValue[0] && resultValue[0]['odata.type']) {
							if (resultValue[0]['odata.type'] === 'SP.Data.HRDocsItem') {
								orgChartsReturn = resultValue;
							}
							if (resultValue[0]['odata.type'] === 'SP.Data.HubDocsItem') {
								otherContactsReturn = resultValue;
							}
						}
						if (resultValue.divDeptWTeams) {
							divDeptWTeamsReturn = resultValue.divDeptWTeams;
							finalResolution.nonDivDeptTeams = resultValue.nonDivDeptTeams;
						}
					});
					// note: we're going to mash up the org charts and the divDeptWTeams
					// note: in divDeptWReturn, divs and depts already have keys for react
					// for each division
					divDeptWTeamsReturn.forEach((divisionValue) => {
						// preserve parameter
						const divisionCopy = divisionValue;
						// for each org chart
						orgChartsReturn.forEach((orgChart) => {
							// if this org chart is for this division
							if (orgChart.HubKey === divisionCopy.name) {
								divisionCopy.orgChart = orgChart.ServerRedirectedEmbedUrl;
							}
						});
						// check the departments for corresponding org charts
						divisionValue.depts.forEach((departmentValue) => {
							// preserve parameter
							const departmentCopy = departmentValue;
							// for each org chart
							orgChartsReturn.forEach((orgChart) => {
								// if this org chart is for this department
								if (orgChart.HubKey === departmentCopy.name) {
									departmentCopy.orgChart = orgChart.ServerRedirectedEmbedUrl;
								}
							});
						});
						// push this copy of the division (with or without org chart) 
						// 		to the final array
						finalResolution.divDeptWTeams.push(divisionCopy);
					});
					// add a react key to each item
					otherContactsReturn.forEach((otherContact) => {
						// preserve parameter
						const otherContactCopy = otherContact;
						// generate a key for this item
						otherContactCopy.reactKey = shortID.generate();
						// push this copy of the item to finalResolution
						finalResolution.otherContacts.push(otherContactCopy);
					});
					// resolve this promise with finalResolution
					resolve(finalResolution);
				})
				// if any single promise is rejected with an error
				.catch((queryError) => {
					// console.log('was rejected');
					// console.log(queryError);
					// reject this promise with the first error (because that's all we get)
					reject({
						error: true,
						queryError,
					});
				});
		}));
	}
}
