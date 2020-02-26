
// ----- IMPORTS

import pnp, { Web } from 'sp-pnp-js';
import MOSUtilities from './MOSUtilities';
import HttpClient from './APIClient';


// ----- DATA

export default class HcContainerData {
	static GetFileContent(urlToLoad) {
		// return a new promise
		return new Promise((resolve, reject) => {
			const httpRequest = new XMLHttpRequest();
			httpRequest.onreadystatechange = function () {
				if (httpRequest.readyState === XMLHttpRequest.DONE) {
					if (httpRequest.status === 200) {
						resolve({ content: httpRequest.responseText });
					} else {
						console.log(`__failed to load: ${urlToLoad}`);
						reject({ error: true, status: httpRequest.status });
					}
				}
			};
			httpRequest.open('GET', urlToLoad, true);
			httpRequest.send();
		});
	}
	static ReturnMaintenanceModeData() {
		// return a new promise
		return new Promise((resolve, reject) => {
			// get a promise to retrieve the data
			this.GetFileContent('https://bmos.sharepoint.com/sites/hubprod/Code4/js/mos-maintenance-mode.js')
				// if the promise was resolved with the data
				.then((result) => {
					let maintenanceModeString = result.content;
					const regexOne = new RegExp('\r', 'g');
					const regexTwo = new RegExp('\n', 'g');
					const regexThree = new RegExp('\t', 'g');
					maintenanceModeString = maintenanceModeString.replace(regexOne, '');
					maintenanceModeString = maintenanceModeString.replace(regexTwo, '');
					maintenanceModeString = maintenanceModeString.replace(regexThree, '');
					const maintenanceMode = JSON.parse(maintenanceModeString);
					resolve(maintenanceMode);
				})
				// if the promise was rejected with an error, reject this promise with the error
				.catch((error) => { reject(error); });
		});
	}
	static ReturnMaintenanceModeThisUser(uData) {
		// return a new promise
		return new Promise(((resolve, reject) => {
			// if this user is a component group admin
			if (uData.roles.indexOf('componentGrpAdmin') !== -1) {
				// resolve this promise with maintenance mode false
				resolve({ maintenanceModeThisUser: false });
			} else {
				// get a promise to retrieve maintenance mode data
				this.ReturnMaintenanceModeData()
					// if the promise was resolved with the data
					.then((result) => {
						// if the data shows that either hub central or all components are in maintenance mode
						if (result.allComponentsInMaintenanceMode || result.hubCentralInMaintenanceMode) {
							// resolve this promise with maintenance mode true
							resolve({ maintenanceModeThisUser: true });
						} else {
							// resolve this promise with maintenance mode false
							resolve({ maintenanceModeThisUser: false });
						}
					})
					// if the promise was rejected with an error, 
					// 		reject this promise with maintenance mode true
					.catch((error) => { console.log('maintenance mode error'); console.log(error); reject({ maintenanceModeThisUser: true }); });
			}
		}));
	}
}
