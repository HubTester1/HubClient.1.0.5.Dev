
// ----- IMPORTS

import APIClient from './APIClient';
import APIEndPoints from './APIEndpoints.json';


// ----- DATA

export default class APIAvailability {
	static ReturnAPIAvailability() {
		// return a new promise
		return new Promise(((resolve, reject) => {
			// get a promise to retrieve the health data from Neso
			APIClient
				.ReturnAPIData(`${APIEndPoints.dev.health.base}${APIEndPoints.dev.health.check}`)
				// if the promise is resolved with the data
				.then((result) => {
					// interpret the data and resolve the promise with the interpretation
					if (result && result.healthy) {
						resolve({ available: true });
					} else {
						resolve({ available: false });
					}
				})
				// if the promise is rejected with an error
				.catch((error) => {
					reject({ available: false });
				});
		}));
	}
}
