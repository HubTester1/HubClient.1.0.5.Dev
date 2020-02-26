import axios from 'axios';

export default class HttpClient {
	static ReturnAPIData(endpoint) {
		// return a new promise
		return new Promise((resolve, reject) => {
			// get a promise to retrieve the data
			axios({
				method: 'get',
				url: endpoint,
				timeout: 10000,
			})
				// if the promise is resolved 
				.then((result) => {
					// if the response status is 200
					if (result.status === 200) {
						/**
						 * @todo Delete conditional when Neso is gone. MOSAPI always returns payload.
						 */
						if (result.data.payload) {
							// resolve this promise with the payload
							resolve(result.data.payload);
						} else {
							// resolve this promise with the payload
							resolve(result.data.docs);
						}
					// if the response status is NOT 200
					} else {
						// reject this promise with whatever result
						//		was returned
						reject({
							error: true,
							errorDetails: result,
						});
					}
				})
				// if the promise is rejected with an error
				.catch((error) => {
					// reject this promise with an error
					reject({
						error: true,
						errorDetails: error,
					});
				});
		});
	}
	static SendAPIData(endpoint, dataObject, config) {
		// return a new promise
		return new Promise((resolve, reject) => {
			// get a promise to post the data
			axios.post(endpoint, dataObject, config)
				// if the promise is resolved 
				.then((result) => {
					// if the response status is 200
					if (result.status === 200) {
						// resolve this promise with the payload
						resolve(result.data.payload);
						// if the response status is NOT 200
					} else {
						// reject this promise with whatever result
						//		was returned
						reject({
							error: true,
							errorDetails: result,
						});
					}
				})
				// if the promise is rejected with an error
				.catch((error) => {
					// reject this promise with an error
					reject({
						error: true,
						errorDetails: error,
					});
				});
		});
	}
	static SendAPIDeleteRequest(endpoint, configWithData) {
		// return a new promise
		return new Promise((resolve, reject) => {
			// get a promise to post the data
			axios.delete(endpoint, configWithData)
				// if the promise is resolved 
				.then((result) => {
					// if the response status is 200
					if (result.status === 200) {
						// resolve this promise with the payload
						resolve(result.data.payload);
						// if the response status is NOT 200
					} else {
						// reject this promise with whatever result
						//		was returned
						reject({
							error: true,
							errorDetails: result,
						});
					}
				})
				// if the promise is rejected with an error
				.catch((error) => {
					// reject this promise with an error
					reject({
						error: true,
						errorDetails: error,
					});
				});
		});
	}
}
