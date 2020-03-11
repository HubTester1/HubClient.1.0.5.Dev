
// ----- IMPORTS

import moment from 'moment';
import { Web } from 'sp-pnp-js';
import { v4 as uuidv4 } from 'uuid';
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
	static UploadOneMessagesFile(filesWeb, folderName, fileName, file) {
		// return a new promise
		return new Promise((resolve, reject) => {
			console.log('filesWeb');
			console.log(filesWeb);
			filesWeb.getFolderByServerRelativeUrl(`/MOSAPIMiscStorage/HubMessageAssets/${folderName}/`).files.add(fileName, file, true)
				// if the promise is resolved with a result
				.then((fileResult) => {
					console.log('fileResult.data.Name');
					console.log(fileResult.data.Name);
					// then resolve this promise with the file 
					// 		name, in case it's different from 
					// 		what we requested
					resolve({
						error: false,
						fileName: fileResult.data.Name,
					});
				})
				// if the promise is rejected with an error
				.catch((fileError) => {
					console.log('fileError');
					console.log(fileError);
					// reject this promise with the error
					reject(fileError);
				});
		});
	}
	static UploadMessagesFiles(messageID, filesArray) {
		// return a new promise
		return new Promise((resolve, reject) => {
			// get promise to create a folder named with message id
			APIClient.SendAPIData(
				`${APIEndPoints.dev.files.base}${APIEndPoints.dev.files.folder}`,
				{
					siteToken: 'root',
					driveToken: 'MOSAPIMiscStorage',
					parentToken: 'HubMessageAssets',
					newFolderName: messageID,
				},
			)
				// if the promise is resolved with a result
				.then((folderResult) => {
					console.log('folderResult');
					console.log(folderResult);
					const folderName = folderResult.createdName;
					const uploadPromises = [];
					const uploadsSucceeded = [];
					const uploadsFailed = [];
					// for each file in the passed array
					filesArray.forEach((file) => {
						// construct a file name
						const fileName = file.name.replace(/ /g, '-');
						// get the SP "web" for the storage location
						const filesWeb = new Web('https://bmos.sharepoint.com');
						// push to promises array a promise to store the file
						uploadPromises.push(this.UploadOneMessagesFile(filesWeb, folderName, fileName, file));
					});
					// when all upload promises have been fulfilled
					Promise.all(uploadPromises)
						// if the promise is resolved with a result
						.then((uploadResults) => {
							console.log('uploadResults');
							console.log(uploadResults);
							// for each result
							uploadResults.forEach((uploadResult) => {
								// if there was no upload error
								if (!uploadResult.error) {
									// push an object to uploads succeeded
									uploadsSucceeded.push({
										name: uploadResult.fileName,
										url: `https://bmos.sharepoint.com/_api/v2.0/sharePoint:/MOSAPIMiscStorage/HubMessageAssets/${folderName}/${uploadResult.fileName}:/driveItem/thumbnails/0/c600x999999/content`,
										key: uuidv4(),
									});
									// if there was an upload error
								} else {
									// push an object to uploads succeeded
									uploadsFailed.push(uploadResult);
								}
							});
							// resolve this promise with the uploads results
							resolve({
								uploadsSucceeded,
								uploadsFailed,
							});
						});
				})
				// if the promise is rejected with an error
				.catch((folderError) => {
					console.log('folderError');
					console.log(folderError);
					// reject this promise with the error
					reject(folderError);
				});
		});
	}
	static DeleteMessagesFile(messageID, fileName) {
		// return a new promise
		return new Promise((resolve, reject) => {
			const filesWeb = new Web('https://bmos.sharepoint.com');
			filesWeb.getFileByServerRelativeUrl(`/MOSAPIMiscStorage/HubMessageAssets/${messageID}/${fileName}`).recycle()
				// if the promise is resolved with a result
				.then((deletionResult) => {
					console.log('deletionResult');
					console.log(deletionResult);
					// then resolve this promise with the file 
					// 		name, in case it's different from 
					// 		what we requested
					resolve({
						error: false,
						result: deletionResult,
					});
				})
				// if the promise is rejected with an error
				.catch((deletionError) => {
					console.log('deletionError');
					console.log(deletionError);
					// reject this promise with the error
					reject(deletionError);
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
