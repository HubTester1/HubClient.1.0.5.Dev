
// ----- IMPORTS

import APIAvailability from './APIAvailability';
import User from './User';
import MaintenanceMode from './MaintenanceMode';


// ----- DATA

// use uData and mData.componentID to get maintenance

export default class HCContext {
	static ReturnHCContext() {
		// return a new promise
		return new Promise(((resolve, reject) => {
			// set up context container
			const hcContext = {
				apiIsAvailable: undefined,
				uData: {},
				maintenanceModeThisUser: undefined,
			};
			// get a promise to retrieve Neso's availability
			APIAvailability.ReturnAPIAvailability()
				// if the promise is resolved with the data
				.then((nesoAvailabilityResult) => {
					// if neso is available
					if (nesoAvailabilityResult.available) {
						// update context
						hcContext.apiIsAvailable = true;
						// get a promise to retrieve the user's data
						User.ReturnUData()
							// if the promise was resolved with the data
							.then((uDataResponse) => {
								// update context
								hcContext.uData = uDataResponse;
								// get a promise to retrieve comp
								MaintenanceMode.ReturnMaintenanceModeThisUser(hcContext.uData)
									// if the promise was resolved with the data
									.then((maintenanceModeResponse) => {
										// update context
										hcContext.maintenanceModeThisUser = 
											maintenanceModeResponse.maintenanceModeThisUser;
										resolve(hcContext);
									})
									// if the promise is rejected with an error
									.catch((error) => {
										// update context
										hcContext.maintenanceModeThisUser = undefined;
										// reject this promise with the context
										reject(hcContext);
									});
							})
							// if the promise is rejected with an error
							.catch((error) => {
								// reject this promise with the context
								reject(hcContext);
							});
					} else {
						// reject this promise with the context
						reject(hcContext);
					}
				})
				// if the promise is rejected with an error
				.catch((error) => {
					// reject this promise with the context
					reject(hcContext);
				});
		}));
	}
}
