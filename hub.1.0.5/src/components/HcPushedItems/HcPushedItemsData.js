
// ----- IMPORTS

import { Web } from 'sp-pnp-js';

const shortid = require('shortid');

// ----- DATA

export default class HcPushedItemsData {
	static ReturnHubDocsForHcPushedDocs() {
		const hubDocsWeb = new Web('https://bmos.sharepoint.com');
		return hubDocsWeb.lists.getByTitle('HubDocs').items
			.select('File/ServerRelativeUrl', 'ServerRedirectedEmbedUrl', 'PushToHCName')
			.expand('File')
			.filter("PushToHC eq '1'")
			.get();
	}

	static ReturnHcPushedLinksForHcPushedDocs() {
		const pushedLinksWeb = new Web('https://bmos.sharepoint.com');
		return pushedLinksWeb.lists.getByTitle('HCPushedLinks').items.get();
	}

	static ReturnAllPushedItemsData() {
		// return a new promise
		return new Promise(((resolve, reject) => {
			// collect data async from multiple sources
			const listItemQueryPromises = [
				this.ReturnHubDocsForHcPushedDocs(),
				this.ReturnHcPushedLinksForHcPushedDocs(),
			];
			// wait for all queries to be completed
			Promise.all(listItemQueryPromises)
				// if the promise is resolved with the settings
				.then((resultsReturnArray) => {
					// console.log('resultsReturnArray');
					// console.log(resultsReturnArray);
					// set up var to receive all list items
					const alllistItems = [];
					// iterate over the results and push them to allListItems
					resultsReturnArray.forEach((listValue) => {
						// console.log(listValue);
						listValue.forEach((itemValue) => {
							const itemFormatted = {
								url: '',
								anchorText: '',
								type: '',
							};
							if (itemValue.ServerRedirectedEmbedUrl) {
								itemFormatted.url = itemValue.File.ServerRelativeUrl;
								itemFormatted.anchorText = itemValue.PushToHCName;
								itemFormatted.type = 'file';
								itemFormatted.key = shortid.generate();

								alllistItems.push(itemFormatted);
							}
							if (itemValue.URL) {
								itemFormatted.url = itemValue.URL.Url;
								itemFormatted.anchorText = itemValue.URL.Description;
								itemFormatted.type = 'page';
								itemFormatted.key = shortid.generate();

								alllistItems.push(itemFormatted);
							}
						});
					});

					// sort allListItems by anchorText properties
					alllistItems.sort((a, b) => {
						if (a.anchorText < b.anchorText) return -1;
						if (a.anchorText > b.anchorText) return 1;
						return 0;
					});
					// resolve this promise with the requested items
					resolve(alllistItems);
				});
		}));
	}
}
