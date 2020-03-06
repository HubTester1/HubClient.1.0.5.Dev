
// ----- IMPORTS

import moment from 'moment';
import { Web } from 'sp-pnp-js';
import APIClient from '../../services/APIClient';
import APIEndPoints from '../../services/APIEndpoints.json';

const shortid = require('shortid');

// ----- DATA

export default class HcMessagesData {
	constructor() {
		this.UploadMessagesFiles = this.UploadMessagesFiles.bind(this);
	}
	static UploadMessagesFiles(messageID, filesArray) {
		// return a new promise
		return new Promise((resolve, reject) => {
			const file = filesArray[0];
			const filesWeb = new Web('https://bmos.sharepoint.com');
			filesWeb.getFolderByServerRelativeUrl('/MOSAPIMiscStorage/HubMessageAssets').files.add('custom-name.jpg', file, true)
			
			/* .lists.getByTitle('MOSAPIMiscStorage').items
				.select('File/ServerRelativeUrl', 'FileLeafRef', 'ServerRedirectedEmbedUrl', 'Title')
				.expand('File')
				.get() */
				// if the promise is resolved with a result
				.then((result) => {
					console.log('result');
					console.log(result);
					// then resolve this promise with the result
					resolve(result);
				})
				// if the promise is rejected with an error
				.catch((error) => {
					console.log('error');
					console.log(error);
					// reject this promise with the error
					reject(error);
				});
		});
	}
	static ReturnHcMessagesTags() {
		// return a new promise
		return new Promise((resolve, reject) => {
			// get a promise to retrieve the settings
			APIClient
				.ReturnAPIData(`${APIEndPoints.dev.hubMessages.base}${APIEndPoints.dev.hubMessages.settings}`)
				// if the promise is resolved with the settings
				.then((settingsResults) => {
					// set up var to receive all tags
					const allMessageTags = settingsResults[0].tags;
					// sort allListItems by name properties
					allMessageTags.sort((a, b) => {
						if (a.name < b.name) return -1;
						if (a.name > b.name) return 1;
						return 0;
					});
					// resolve this promise with the requested items
					resolve(allMessageTags);
				});
		});
	}
	static ReturnHcMessagesAllMessages() {
		// return a new promise
		return new Promise(((resolve, reject) => {
			// get a promise to retrieve the settings
			APIClient
				.ReturnAPIData(`${APIEndPoints.dev.hubMessages.base}${APIEndPoints.dev.hubMessages.messages}?expiration=unexpired`)
				// if the promise is resolved with the settings
				.then((messagesResults) => {
					console.log('messagesResults');
					console.log(messagesResults);
					// set up var to receive all messages
					const allMessagesMessages = [];
					// iterate over the results and push them to allListItems
					messagesResults.forEach((messageValues) => {
						const messageFormatted = {
							tags: [],
							subject: '',
							created: '',
							modified: '',
							creator: '',
							body: '',
							images: [],
							expiration: '',

							key: '',
						};
						if (messageValues.messageBody) {
							allMessagesMessages
								.push(this.ReturnFormattedMessage(messageValues, messageFormatted));
						}
					});
					// resolve this promise with the requested items
					resolve(allMessagesMessages);
				});
		}));
	}
	static ReturnFormattedMessage(messageValues, messageFormatted) {
		const messageFormattedCopy = messageFormatted;
		messageFormattedCopy.messageID = messageValues.messageID;
		messageFormattedCopy.tag = messageValues.messageTag;
		messageFormattedCopy.subject = messageValues.messageSubject;
		messageFormattedCopy.created = messageValues.messageCreated;
		messageFormattedCopy.modified = messageValues.messageModified;
		messageFormattedCopy.creator = messageValues.messageCreator;
		messageFormattedCopy.body = messageValues.messageBody;
		messageFormattedCopy.expiration = messageValues.messageExpiration;
		messageFormattedCopy.key = shortid.generate();

		if (messageValues.messageImages && messageValues.messageImages[0]) {
			messageValues.messageImages.forEach((imageValue) => {
				const imageValueCopy = imageValue;
				// add a separate, unique key for use solely in displaying inside in full message
				imageValueCopy.imageKey = shortid.generate();
				// this is leftover from when it was anticiapted that message previews would show images
				// imageValueCopy.previewKey = shortid.generate();
				messageFormattedCopy.images.push(imageValueCopy);
			});
		}
		return messageFormattedCopy;
	}
	static ReturnHcMessagesTopMessages() {
		// return a new promise
		return new Promise(((resolve, reject) => {
			// get a promise to retrieve the settings
			APIClient
				.ReturnAPIData(`${APIEndPoints.dev.hubMessages.base}${APIEndPoints.dev.hubMessages.messages}?expiration=unexpired&limit=4`)
				// if the promise is resolved with the settings
				.then((messagesResults) => {
					// set up var to receive all messages
					const allMessagesMessages = [];
					// iterate over the results and push them to allListItems
					messagesResults.forEach((messageValues) => {
						const messageFormatted = {
							tag: '',
							subject: '',
							created: '',
							modified: '',
							creator: '',
							body: '',
							images: [],
							expiration: '',
							key: '',
						};
						if (messageValues.messageBody) {
							allMessagesMessages
								.push(this.ReturnFormattedMessage(messageValues, messageFormatted));
						}
					});
					// sort messages according to modified property
					// allMessagesMessages.sort((a, b) => {
					// 	if (moment(a.modified).isBefore(moment(b.modified))) {
					// 		return 1;
					// 	}
					// 	return -1;
					// });
					// resolve this promise with the requested items
					resolve(allMessagesMessages);
				});
		}));
	}
	static ReturnHcMessagesAllMessagesWSpecifiedTag(name) {
		// return a new promise
		return new Promise(((resolve, reject) => {
			// get a promise to retrieve the settings
			APIClient
				.ReturnAPIData(`${APIEndPoints.dev.hubMessages.base}${APIEndPoints.dev.hubMessages.messages}?expiration=unexpired&tag=${name}`)
				// if the promise is resolved with the settings
				.then((messagesResults) => {
					// set up var to receive all messages
					const allMessagesMessages = [];
					// iterate over the results and push them to allListItems
					messagesResults.forEach((messageValues) => {
						const messageFormatted = {
							tag: '',
							subject: '',
							created: '',
							modified: '',
							creator: '',
							body: '',
							images: [],
							expiration: '',

							key: '',
						};
						if (messageValues.messageBody) {
							allMessagesMessages
								.push(this.ReturnFormattedMessage(messageValues, messageFormatted));
						}
					});
					// sort messages according to modified property
					allMessagesMessages.sort((a, b) => {
						if (moment(a.modified).isBefore(moment(b.modified))) {
							return 1;
						}
						return -1;
					});
					// resolve this promise with the requested items
					resolve(allMessagesMessages);
				});
		}));
	}
	static SendSaveErrorEmail(stateData) {
		// return a new promise
		return new Promise(((resolve, reject) => {
			// get a promise to send the email
			APIClient.SendAPIData(
				`${APIEndPoints.dev.email.base}${APIEndPoints.dev.email.send}`,
				{
					to: 'hubhelp@mos.org',
					from: 'The Hub <noreply@mos.org>',
					subject: 'HcMessages Save Error',
					html: JSON.stringify(stateData),
					system: 'hub',
					type: 'HcMessages Save Error',
					event: 'HcMessages Save Error',
				},
			)
				.then((response) => {
					resolve(response);
				})
				.catch((error) => {
					reject(error);
				});
		}));
	}
	static SendNesoMessagesMessage(newMessageProperties) {
		// return a new promise
		return new Promise(((resolve, reject) => {
			// get a promise to send the email
			APIClient.SendAPIData(
				`${APIEndPoints.dev.hubMessages.base}${APIEndPoints.dev.hubMessages.add}`,
				newMessageProperties,
			)
				.then((response) => {
					resolve(response);
				})
				.catch((error) => {
					reject(error);
				});
		}));
	}
	static SendNesoMessagesMessageUpdate(newMessageProperties) {
		// return a new promise
		return new Promise(((resolve, reject) => {
			// get a promise to send the email
			APIClient.SendAPIData(
				`${APIEndPoints.dev.hubMessages.base}${APIEndPoints.dev.hubMessages.update}`,
				newMessageProperties,
			)
				.then((response) => {
					resolve(response);
				})
				.catch((error) => {
					reject(error);
				});
		}));
	}
	static ReturnNextMessageID() {
		// return a new promise
		return new Promise((resolve, reject) => {
			// get a promise to retrieve the settings
			APIClient
				.ReturnAPIData(`${APIEndPoints.dev.hubMessages.base}${APIEndPoints.dev.hubMessages.nextID}`)
				// if the promise is resolved with the ID
				.then((nextMessageIDResults) => {
					// resolve this promise with the requested items
					resolve(nextMessageIDResults);
				})
				.catch((axiosError) => {
					reject(axiosError);
				});
		});
	}
	static ReturnFileBuffer(file) {
		// return a new promise
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			
			reader.onload = (e) => {
				resolve(e.target.result);
			};

			reader.onerror = (e) => {
				reject(e.target.error);
			};

			reader.readAsArrayBuffer(file);
		});
	}
	/* static UploadMessagesFiles(messageID, filesArray) {
		// return a promise to upload the fies
		return new Promise((resolve, reject) => {
			const endpoint = 'https://graph.microsoft.com/v1.0/drives/b!aLEmESK8e0Wx9dvsau4QEacBcz241XVJgYLGTNWsG8JrBW8yXr2HQ4wKyeACjW1H/items/01OO6BYSXPXJOZSUGFZVCJFELM57U5S3MC:/fileName.txt:/content';

			const config = {
				'Content-Type': 'text/plain',
				Authorization: 'Bearer eyJ0eXAiOiJKV1QiLCJub25jZSI6IjRGRndUajUwVnBjVTJLRXYtdEQ5Z3pTQ0IzcGpqTGlVZE1CRHV1UVBtT3ciLCJhbGciOiJSUzI1NiIsIng1dCI6IkhsQzBSMTJza3hOWjFXUXdtak9GXzZ0X3RERSIsImtpZCI6IkhsQzBSMTJza3hOWjFXUXdtak9GXzZ0X3RERSJ9.eyJhdWQiOiJodHRwczovL2dyYXBoLm1pY3Jvc29mdC5jb20iLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC8yZmI5NTJlYS01NWI4LTQyZTgtOGYxMy0zN2RjMGQ4ODhkNGQvIiwiaWF0IjoxNTgzNTEzMjk2LCJuYmYiOjE1ODM1MTMyOTYsImV4cCI6MTU4MzUxNzE5NiwiYWlvIjoiNDJOZ1lGaTJwb1ZiZVpxR3NwL3Y3NnBIdCtaK0J3QT0iLCJhcHBfZGlzcGxheW5hbWUiOiJNT1MgTVNHcmFwaCBBcHAiLCJhcHBpZCI6ImNiNDhmM2IxLWMwZDEtNDQxYy1hMWM0LTk1NzEyMzQzMGJkNiIsImFwcGlkYWNyIjoiMSIsImlkcCI6Imh0dHBzOi8vc3RzLndpbmRvd3MubmV0LzJmYjk1MmVhLTU1YjgtNDJlOC04ZjEzLTM3ZGMwZDg4OGQ0ZC8iLCJvaWQiOiI2YjhlNzAyMy0zNWZkLTQ1MmUtYTgzZS1jOGYyOGMwNTllMmQiLCJyb2xlcyI6WyJQbGFjZS5SZWFkLkFsbCIsIlRlYW1zQWN0aXZpdHkuUmVhZC5BbGwiLCJNYWlsLlJlYWRXcml0ZSIsIkFkbWluaXN0cmF0aXZlVW5pdC5SZWFkLkFsbCIsIlRlYW1zQWN0aXZpdHkuU2VuZCIsIkdyb3VwLlJlYWRXcml0ZS5BbGwiLCJGaWxlcy5SZWFkV3JpdGUuQWxsIiwiRGlyZWN0b3J5LlJlYWQuQWxsIiwiVXNlci5SZWFkLkFsbCIsIlVzZXJOb3RpZmljYXRpb24uUmVhZFdyaXRlLkNyZWF0ZWRCeUFwcCIsIkdyb3VwTWVtYmVyLlJlYWQuQWxsIiwiQ2hhbm5lbE1lc3NhZ2UuUmVhZC5BbGwiLCJDYWxlbmRhcnMuUmVhZFdyaXRlIiwiTWFpbC5TZW5kIiwiQ2hhdC5SZWFkV3JpdGUuQWxsIiwiU2l0ZXMuRnVsbENvbnRyb2wuQWxsIiwiTm90ZXMuUmVhZFdyaXRlLkFsbCJdLCJzdWIiOiI2YjhlNzAyMy0zNWZkLTQ1MmUtYTgzZS1jOGYyOGMwNTllMmQiLCJ0aWQiOiIyZmI5NTJlYS01NWI4LTQyZTgtOGYxMy0zN2RjMGQ4ODhkNGQiLCJ1dGkiOiJnX2FERlpfT0hrVzV3SzZfbU4wREFBIiwidmVyIjoiMS4wIiwieG1zX3RjZHQiOjEzMTI5NDQ0Nzh9.H3AhjvnR25tTOxZ7z1zJmkVQ6iEdsSuWKzCs2fvOaOlBOLMf1QdTzdMwfPBX5xUtSQx5A6Rtb38l0HydkRWGFaHfNRI-xJk-PIiKkg3ONVz-HHhG8wT9pq38anhOY21tMPIutwUIZQ2ESpgm5dAileRmTOtvkt9oTymGdIBr1DtRefXNb8EOmK4CCgq0EleU-8dImDpQcuHojc1O6zlnkhJtCs5Q0LfGx-KOj5ppXlTMyhKD0v89eFswkH1AmvZKiID6tlzBQFEchOH8Zs5Kk2ZRK0DsnAV7XECZiDCyOunAVfIFb6aD7l1t1clQyNYDXcSAwLGl2TbTib86qyP1nw',
			};
			const file = filesArray[0];
			// get a promise to 
			this.ReturnFileBuffer(file)
				// if the promise is resolved with a result
				.then((buffer) => {
					let binary = '';
					const bytes = new Uint8Array(buffer);
					let i = bytes.byteLength;

					// convert it to binary
					while (i--) {
						binary = String.fromCharCode(bytes[i]) + binary;
					}
					console.log('binary');
					console.log(binary);
					// get a promise to post the data
					axios.put(endpoint, binary, config)
					// if the promise is resolved
						.then((result) => {
							console.log('result');
							console.log(result);
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
							console.log('error');
							console.log(error);
							// reject this promise with an error
							reject({
								error: true,
								errorDetails: error,
							});
						});
				})
				// if the promise is rejected with an error
				.catch((error) => {
					// reject this promise with the error
					reject(error);
				});
		});
	} */


	/* static UploadMessagesFiles(messageID, filesArray) {
		// return a promise to upload the fies
		return new Promise((resolve, reject) => {
			// get a promise to 
			this.ReturnAWSCredentials()
				// if the promise is resolved with a result
				.then((credentialsResult) => {
					const config = {
						bucketName: 'mos-api-misc-storage',
						dirName: `hub-message-assets/incoming/${messageID}`,
						region: 'us-east-1',
						accessKeyId: credentialsResult.authMOSAPISLSAdminAccessKeyID,
						secretAccessKey: credentialsResult.authMOSAPISLSAdminSecretAccessKey,
					};
					const uploadPromises = [];
					filesArray.forEach((file) => {
						uploadPromises.push(uploadFile(file, config));
					});
					Promise.all(uploadPromises)
						.then((uploadResultsArray) => {
							// get a promise to 
							APIClient.SendAPIData(
								`${APIEndPoints.dev.hubMessages.base}${APIEndPoints.dev.hubMessages.images}`,
								{
									messageID,
								},
							)
								// if the promise is resolved with a result
								.then((formattingResult) => {
									// then resolve this promise with the result
									resolve(formattingResult);
								})
								// if the promise is rejected with an error
								.catch((formattingError) => {
									// reject this promise with the error
									reject(formattingError);
								});
						})
						.catch((uploadError) => {
							reject(uploadError);
						});
				})
				// if the promise is rejected with an error
				.catch((credentialsError) => {
					// reject this promise with the error
					reject(credentialsError);
				});
		});
	} */
	static DeleteMessagesFile(messageID, fileName) {
		// return a promise to upload the fies
		return new Promise((resolve, reject) => {
			// get a promise to send the email
			APIClient.SendAPIDeleteRequest(
				`${APIEndPoints.dev.hubMessages.base}${APIEndPoints.dev.hubMessages.images}`,
				{
					data: {
						messageID,
						fileName,
					},
				},
			)
				.then((response) => {
					resolve(response);
				})
				.catch((error) => {
					reject(error);
				});
		});
	}
	static ReturnAWSCredentials() {
		// return a new promise
		return new Promise((resolve, reject) => {
			// get a promise to retrieve the settings
			APIClient
				.ReturnAPIData(`${APIEndPoints.dev.access.base}${APIEndPoints.dev.access.awsCredentials}`)
				// if the promise is resolved with the settings
				.then((settingsResults) => {
					if (
						settingsResults.authMOSAPISLSAdminAccessKeyID && 
						settingsResults.authMOSAPISLSAdminSecretAccessKey 
					) {
						// resolve this promise with the requested items
						resolve(settingsResults);
					} else {
						reject({
							error: true,
						});
					}
				})
				.catch((settingsError) => {
					reject({
						error: true,
					});
				});
		});
	}
}
