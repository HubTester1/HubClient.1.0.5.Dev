
// ----- IMPORTS

import moment from 'moment';
import { uploadFile } from 'react-s3';
import APIClient from '../../services/APIClient';
import APIEndPoints from '../../services/APIEndpoints.json';

const shortid = require('shortid');

// ----- DATA

export default class HcMessagesData {
	constructor() {
		this.UploadMessagesFiles = this.UploadMessagesFiles.bind(this);
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
	static UploadMessagesFiles(messageID, filesArray) {
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
	}
	static DeleteMessagesFile(messageID, fileName) {
		// return a promise to upload the fies
		return new Promise((resolve, reject) => {
			// get a promise to send the email
			APIClient.SendAPIDeleteRequest(
				`${APIEndPoints.dev.hubMessages.base}${APIEndPoints.dev.hubMessages.images}`,
				{
					messageID,
					fileName,
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
