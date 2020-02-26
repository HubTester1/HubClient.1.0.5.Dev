
// ----- IMPORTS

import { Web } from 'sp-pnp-js';
import shortID from 'shortid';
import APIClient from '../../services/APIClient';
import MOSUtilities from '../../services/MOSUtilities';
import AccessControl from '../../services/AccessControl';

// ----- DATA

export default class HcGetItDoneData {
	static ReturnHRDocsForHcGetItDone() {
		const hrDocsWeb = new Web('https://bmos.sharepoint.com');
		return hrDocsWeb.lists.getByTitle('HR Docs').items
			.select('File/ServerRelativeUrl', 'FileLeafRef', 'ServerRedirectedEmbedUrl', 'Title', 'GetItDoneProminent')
			.expand('File')
			.filter("Category eq 'Request Forms'")
			.get();
	}
	static ReturnCRMDocsForHcGetItDone() {
		const crmDocsWeb = new Web('https://bmos.sharepoint.com');
		return crmDocsWeb.lists.getByTitle('CRMDocs').items
			.select('File/ServerRelativeUrl', 'FileLeafRef', 'ServerRedirectedEmbedUrl', 'Title')
			.expand('File')
			// .filter("Category eq 'Request Forms'")
			.get();
	}
	static ReturnAccountingFormsForHcGetItDone() {
		const hrDocsWeb = new Web('https://bmos.sharepoint.com');
		return hrDocsWeb.lists.getByTitle('Accounting Documents').items
			.select('File/ServerRelativeUrl', 'FileLeafRef', 'ServerRedirectedEmbedUrl', 'Title', 'GetItDoneProminent')
			.expand('File')
			.filter("Custom1 eq 'Forms'")
			.get();
	}
	static ReturnAccountingTaxDocsForHcGetItDone() {
		const hrDocsWeb = new Web('https://bmos.sharepoint.com');
		return hrDocsWeb.lists.getByTitle('Accounting Documents').items
			.select('File/ServerRelativeUrl', 'FileLeafRef', 'ServerRedirectedEmbedUrl', 'Title', 'GetItDoneProminent')
			.expand('File')
			.filter("Custom1 eq 'Tax Documents'")
			.get();
	}
	static ReturnAPIDataForHcGetItDone() {
		return APIClient
			.ReturnAPIData('https://neso.mos.org/hcGetItDone/settings');
	}
	static ReturnNesoSettngsForHcGetItDone() {
		return APIClient
			.ReturnAPIData('https://neso.mos.org/hcGetItDone/allItems');
	}
	static ReturnAllGetItDoneData(uData) {
		// return a new promise
		return new Promise(((resolve, reject) => {
			// collect data async from multiple sources
			const listItemQueryPromises = [
				this.ReturnNesoSettngsForHcGetItDone(),
				this.ReturnHRDocsForHcGetItDone(),
				this.ReturnAccountingFormsForHcGetItDone(),
				this.ReturnAccountingTaxDocsForHcGetItDone(),
				this.ReturnAPIDataForHcGetItDone(),
				this.ReturnCRMDocsForHcGetItDone(),
			];
				// wait for all queries to be completed
			Promise.all(listItemQueryPromises)
			// if the promise is resolved with the settings
				.then((resultsReturnArray) => {
					// set up var to receive all list items
					const allListItemsAlpha = [];
					const allListItemsGroupedTempHolder = {};
					let allListItemsGroupedTempHolderKeys;
					const allListItemsGrouped = [];
					let collapsedGroups;
					const allListItemsGroupedSegmented = [];
					// iterate over the results and push them to allListItemsAlpha
					resultsReturnArray.forEach((resultValue) => {
						// if this result's first child contains a collapsedGroups property
						if (resultValue[0].collapsedGroups) {
							// this is settings; extract the collapsed groups
							// eslint-disable-next-line prefer-destructuring
							collapsedGroups = resultValue[0].collapsedGroups;
						// if this result's first child does NOT contain a collapsedGroups property
						} else {
							// this is content; extract the content items
							resultValue.forEach((itemValue) => {
								let userHasPermission = false;
								if (!itemValue.restrictedToRoles) {
									userHasPermission = true;
								} else {
									userHasPermission = AccessControl
										.UserRolesAllowAccess(uData.roles, itemValue.restrictedToRoles, itemValue.restrictedFromRoles);
								}
								if (userHasPermission) {
									const itemFormatted = {
										url: '',
										anchorText: '',
										type: '',
									};
									if (itemValue.ServerRedirectedEmbedUrl) {
										itemFormatted.url = itemValue.File.ServerRelativeUrl;
										// itemFormatted.url = itemValue.ServerRedirectedEmbedUrl;
										itemFormatted.anchorText =
											MOSUtilities.ReplaceAll('.pdf', '', MOSUtilities.ReplaceAll('.doc', '', MOSUtilities.ReplaceAll('.docx', '', MOSUtilities.ReplaceAll('.xls', '', MOSUtilities.ReplaceAll('.xlsx', '', itemValue.FileLeafRef.toString())))));
										itemFormatted.description = itemValue.Title;
										itemFormatted.groups = ['HR'];
										if (itemValue['odata.type'] === 'SP.Data.HRDocsItem') {
											itemFormatted.groups = ['HR'];
										} else if (itemValue['odata.type'] === 'SP.Data.CRMDocsItem') {
											itemFormatted.groups = ['CRM', 'Tessitura'];
										} else {
											itemFormatted.groups = ['Accounting'];
										}
										if (itemValue.GetItDoneProminent) {
											itemFormatted.prominent = true;
										}
										itemFormatted.type = 'file';
										itemFormatted.key = shortID.generate();
									}

									if (itemValue.URL) {
										itemFormatted.url = itemValue.URL;
										itemFormatted.anchorText = itemValue.Name;
										itemFormatted.description = itemValue.Description;
										itemFormatted.groups = itemValue.Groups;
										if (itemValue.GetItDoneProminent) {
											itemFormatted.prominent = true;
										}
										itemFormatted.type = 'swf';
										itemFormatted.key = shortID.generate();
									}
									if (itemFormatted.url) {										
										allListItemsAlpha.push(itemFormatted);
									}
								}
							});
						}
					});

					// sort allListItemsAlpha by anchorText properties
					allListItemsAlpha.sort((a, b) => {
						if (a.anchorText < b.anchorText) return -1;
						if (a.anchorText > b.anchorText) return 1;
						return 0;
					});

					// for each item in allListItemsAlpha
					allListItemsAlpha.forEach((itemValue) => {
						// for each group in the item
						itemValue.groups.forEach((groupValue) => {
							// if this group isn't already in the container, add it with 
							// 		a key and an empty items array
							if (!allListItemsGroupedTempHolder[groupValue]) {
								allListItemsGroupedTempHolder[groupValue] = {};
								allListItemsGroupedTempHolder[groupValue].key = shortID.generate();
								allListItemsGroupedTempHolder[groupValue].items = [];
							}
							// add the item to the group
							allListItemsGroupedTempHolder[groupValue].items.push(itemValue);
						});
					});

					// extract into array from object its "child" / first level keys;
					// 		these keys correspond to group names
					// eslint-disable-next-line
					allListItemsGroupedTempHolderKeys = Object.keys(allListItemsGroupedTempHolder);
					// sort groups key alphabetically
					allListItemsGroupedTempHolderKeys.sort();
					// for each group key
					allListItemsGroupedTempHolderKeys.forEach((keyValue) => {
						allListItemsGrouped.push({
							name: keyValue,
							key: allListItemsGroupedTempHolder[keyValue].key,
							items: allListItemsGroupedTempHolder[keyValue].items,
						});
					});


					// for each group
					allListItemsGrouped.forEach((groupValue) => {
						// set up var
						let thisGroupShouldBeSegmented = false;
						// for each group that can be collapsed
						collapsedGroups.forEach((collapsedValue) => {
							// if this group name matches the name of this group that can be collapsed
							if (collapsedValue === groupValue.name) {
								// indicate that this group should be segmented
								thisGroupShouldBeSegmented = true;
							}
						});
						// if this group should not be segmented
						if (!thisGroupShouldBeSegmented) {
							allListItemsGroupedSegmented.push(groupValue);
						} else {
							const segmentedGroup = {
								name: groupValue.name,
								key: groupValue.key,
								items: {
									prominent: [],
									collapsed: [],
								},
							};
							groupValue.items.forEach((itemValue) => {
								if (itemValue.prominent) {
									segmentedGroup.items.prominent.push(itemValue);
								} else {
									segmentedGroup.items.collapsed.push(itemValue);
								}
							});
							allListItemsGroupedSegmented.push(segmentedGroup);
						}
					});


					// resolve this promise with the requested items
					resolve({
						allListItemsAlpha,
						allListItemsGrouped,
						allListItemsGroupedSegmented,
					});
				})
				.catch((queryError) => {
					reject({
						error: true,
						queryError,
					});
				});
		}));
	}
}
