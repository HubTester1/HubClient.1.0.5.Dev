
/* eslint-disable max-len */

// ----- IMPORTS

import * as React from 'react';
import ReactPlaceholder from 'react-placeholder';
import { RectShape } from 'react-placeholder/lib/placeholders';
import {
	AccordionItem,
	AccordionItemTitle,
	AccordionItemBody,
} from 'react-accessible-accordion';
import MediaQuery from 'react-responsive';
import Pagination from 'react-js-pagination';
import shortid from 'shortid';
import { v4 as uuidv4 } from 'uuid';
import HcMessagesData from './HcMessagesData';
import HcMessagesCommandBar from './components/HcMessagesCommandBar/HcMessagesCommandBar';
import HcMessagesList from './components/HcMessagesList/HcMessagesList';
import HcMessagesNewMessageForm from './components/HcMessagesNewMessageForm/HcMessagesNewMessageForm';
import ScreenSizes from '../../services/ScreenSizes';
import MOSUtilities from '../../services/MOSUtilities';

import './HcMessages.sass';
import './HcMessagesSmall.sass';
import './HcMessagesMediumLarge.sass';


// ----- COMPONENT

const messagesPerPageSmallScreen = 8;
const messagesPerPageLargeScreen = 16;
const startingPageNumber = 1;

export default class HcMessages extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			categoryFilter: '',
			textFilter: '',
			messagesArray: [],
			messagesToRenderArray: [],
			messagesThisPageSmallScreen: [],
			messagesThisPageLargeScreen: [],
			activePage: startingPageNumber,
			tagsArray: [],

			showNewMessageForm: false,
			updatingMessage: false,

			newMessageID: undefined,
			newMessageTag: '',
			newMessageSubject: '',
			newMessageBody: '',
			newMessageImages: [],
			newMessageExpirationDate: '',
			newMessageImagesAreUploading: false,
			newMessageIDError: undefined,
			newMessageTagError: undefined,
			newMessageSubjectError: undefined,
			newMessageBodyError: undefined,
			newMessageImageSomeOrAllUploadsFailedWarning: undefined,
			newMessageImagesWrongTypesWarning: undefined,
			newMessageIsInvalid: undefined,
			newMessageImageUploadsImpossible: undefined,
			newMessageSaveFailure: undefined,
			newMessageSaveSuccess: undefined,
			newMessageIITNotificationFailure: undefined,
			ready: false,
			fakeReady: false,
		};
		this.addMessageToList = this.addMessageToList.bind(this);
		this.handleClickNewMessageButton = this.handleClickNewMessageButton.bind(this);
		this.handleClickHideNewMessageButton = this.handleClickHideNewMessageButton.bind(this);
		this.handleClickTagFilterMenuLabel = this.handleClickTagFilterMenuLabel.bind(this);
		this.handleClickTagFilterMenuItem = this.handleClickTagFilterMenuItem.bind(this);
		this.handleFilterTextChange = this.handleFilterTextChange.bind(this);
		this.handlePageChange = this.handlePageChange.bind(this);
		this.returnHcMessagesAllBody = this.returnHcMessagesAllBody.bind(this);
		this.enableMessageUpdate = this.enableMessageUpdate.bind(this);
		this.handleChangedTag = this.handleChangedTag.bind(this);
		this.handleChangedSubject = this.handleChangedSubject.bind(this);
		this.handleChangedBody = this.handleChangedBody.bind(this);
		this.handleDroppedFiles = this.handleDroppedFiles.bind(this);
		this.handleFileDeletion = this.handleFileDeletion.bind(this);
		this.handleChangedExpirationDate = this.handleChangedExpirationDate.bind(this);
		this.handleAddMessage = this.handleAddMessage.bind(this);
		this.handleMessageUpdate = this.handleMessageUpdate.bind(this);
		this.returnFormFieldContainerClassNameString =
			this.returnFormFieldContainerClassNameString.bind(this);
		this.handleChangedSubject = this.handleChangedSubject.bind(this);
	}
	componentDidMount() {
		HcMessagesData.ReturnHcMessagesTags()
			.then((allMessageTags) => {
				this.setState(() => ({
					tagsArray: allMessageTags,
				}));
			});
		if (this.props.allOrTop === 'all') {
			HcMessagesData.ReturnHcMessagesTags()
				.then((allMessageTags) => {
					this.setState(() => ({
						tagsArray: allMessageTags,
					}));
				});
			HcMessagesData.ReturnHcMessagesAllMessages()
				.then((allMessageMessages) => {
					const messagesThisPage =
						this.returnMessagesThisPage(startingPageNumber, allMessageMessages);
					this.setState(() => ({
						messagesArray: allMessageMessages,
						messagesToRenderArray: allMessageMessages,
						messagesThisPageSmallScreen: messagesThisPage.messagesThisPageSmallScreen,
						messagesThisPageLargeScreen: messagesThisPage.messagesThisPageLargeScreen,
						ready: true,
					}));
				});
		}
		if (this.props.allOrTop === 'top') {
			HcMessagesData.ReturnHcMessagesTopMessages()
				.then((allMessageMessages) => {
					this.setState(() => ({
						messagesArray: allMessageMessages,
						messagesToRenderArray: allMessageMessages,
						ready: true,
					}));
				});
		}
	}
	setAndReturnMessageFormIsInvalid() {
		// set up new errors; default to no errors
		const newErrors = {
			newMessageTagError: undefined,
			newMessageSubjectError: undefined,
			newMessageBodyError: undefined,
			newMessageIsInvalid: undefined,
		};
		// if there's no tag
		if (!this.state.newMessageTag) {
			// prepare tag error
			newErrors.newMessageTagError = 'Cannot be blank';
		}
		// if there's no subject
		if (!this.state.newMessageSubject) {
			// prepare subject error
			newErrors.newMessageSubjectError = 'Cannot be blank';
		}
		// if there's no body
		if (!this.state.newMessageBody) {
			// prepare body error
			newErrors.newMessageBodyError = 'Cannot be blank';
		}

		// if there's no tag, subject, or body; if there is a messageID error
		if (!this.state.newMessageTag || !this.state.newMessageSubject ||
			!this.state.newMessageBody || this.state.newMessageIDError) {
			// prepare form validation error
			newErrors.newMessageIsInvalid = true;
		}
		// set state to indicate errors
		this.setState(() => ({
			newMessageTagError: newErrors.newMessageTagError,
			newMessageSubjectError: newErrors.newMessageSubjectError,
			newMessageBodyError: newErrors.newMessageBodyError,
			newMessageIsInvalid: newErrors.newMessageIsInvalid,
		}));
		// return to caller
		return newErrors.newMessageIsInvalid;
	}
	handleChangedTag(value) {
		if (value && value.key) {
			this.setState(() => ({
				newMessageTag: value.text,
				newMessageTagError: undefined,
			}));
		} else {
			this.setState(() => ({
				newMessageTag: '',
				newMessageTagError: 'Cannot be blank',
			}));
		}
	}
	handleChangedSubject(value) {
		if (value) {
			this.setState(() => ({
				newMessageSubject: value,
				newMessageSubjectError: undefined,
			}));
		} else {
			this.setState(() => ({
				newMessageSubject: undefined,
				newMessageSubjectError: 'Cannot be blank',
			}));
		}
	}
	handleChangedBody(value) {
		if (value) {
			this.setState(() => ({
				newMessageBody: value,
				newMessageBodyError: undefined,
			}));
		} else {
			this.setState(() => ({
				newMessageBody: undefined,
				newMessageBodyError: 'Cannot be blank',
			}));
		}
	}
	returnAndConditionallySetMessageID() {
		// return a promise to return the message ID
		return new Promise((resolve, reject) => {
			// if the message ID is already in state
			if (this.state.newMessageID) {
				// resolve this promise with the message ID
				resolve(this.state.newMessageID);
				// if the message ID is NOT in state
			} else {
				// get a new message ID
				HcMessagesData.ReturnNextMessageID()
					.then((newMessageIDResults) => {
						this.setState({
							newMessageID: newMessageIDResults.nextMessageID,
						});
						resolve(newMessageIDResults.nextMessageID);
					})
					.catch((axiosError) => {
						this.setState({
							newMessageIDError: true,
						});
						reject(axiosError);
					});
			}
		});
	}
	returnFileAsDataURL(fileAsReceived) {
		// return a promise
		return new Promise((resolve, reject) => {
			console.log('got to 3');
			const fileReaderInstance = new FileReader();
			fileReaderInstance.onload = () => {
				resolve(fileReaderInstance.result);
			};
			fileReaderInstance.readAsDataURL(fileAsReceived);
		});
	}
	returnFileAsText(fileAsReceived) {
		// return a promise
		return new Promise((resolve, reject) => {
			console.log('got to 2');
			const fileReaderInstance = new FileReader();
			fileReaderInstance.onload = () => {
				resolve(fileReaderInstance.result);
			};
			fileReaderInstance.readAsText(fileAsReceived);
		});
	}
	returnFileAsBinary(fileAsReceived) {
		// return a promise
		return new Promise((resolve, reject) => {
			console.log('got to 2b');
			const fileReaderInstance = new FileReader();
			fileReaderInstance.onload = () => {
				resolve(fileReaderInstance.result);
			};
			fileReaderInstance.readAsText(fileAsReceived);
		});
	}
	returnFileObject(fileAsReceived) {
		// return a promise
		return new Promise((resolve, reject) => {
			console.log('got to 1b');
			// get a promise to 
			this.returnFileAsBinary(fileAsReceived)
				// if the promise is resolved with a result
				.then((filesAsBinary) => {
					const formattedFile = {
						fileName: fileAsReceived.name,
						fileType: fileAsReceived.type,
						fileBinaryContent: filesAsBinary,
					};
					resolve(formattedFile);
				})
				// if the promise is rejected with an error
				.catch((error) => {
					// reject this promise with the error
					reject(error);
				});
		});
	}
	handleDroppedFiles(acceptedFiles, rejectedFiles) {
		// if all files submitted for upload are of the right type (none were rejected by Dropzone)
		if (!rejectedFiles[0]) {
			// set state to indicate that images are processing and unset warnings
			this.setState({
				newMessageImagesAreUploading: true,
				newMessageImageSomeOrAllUploadsFailedWarning: undefined,
				newMessageImagesWrongTypesWarning: undefined,
			});
			// note: will use messageID as folder name for uploaded files
			// get a promise to get a new messageID
			this.returnAndConditionallySetMessageID()
				// if the promise was resolved with the messageID
				.then((messageID) => {
					// get a promise to upload the files
					HcMessagesData.UploadMessagesFiles(messageID, acceptedFiles)
					// if the promise was *resolved* with some results
					// note: here, results could contain errors; results are for
					// 		one upload attempt per file
						.then((fileUploadResults) => {
							const uploadsSucceeded = [];
							const uploadsFailed = [];
							let newMessageImageSomeOrAllUploadsFailedWarningValue = false;
							fileUploadResults.forEach((resultValue) => {
								console.log('resultValue');
								console.log(resultValue);
								if (resultValue.result.status === 204) {
									const finalStoragePath = `https://mos-api-misc-storage.s3.amazonaws.com/hub-message-assets/formatted/${messageID}`;
									const name = resultValue.location.substring(resultValue.location.lastIndexOf('/') + 1);
									uploadsSucceeded.push({
										name,
										urlTemp: resultValue.location,
										urlFinal: `${finalStoragePath}/${name}`,
										key: uuidv4(),
									});
								} else {
									uploadsFailed.push(resultValue);
								}
							});
							if (uploadsFailed[0]) {
								newMessageImageSomeOrAllUploadsFailedWarningValue = true;
							}
							// set state to reflect results of all image uploads to this point
							// note: accounts for the possibility of multiple rounds of uploads
							this.setState((prevState) => {
								const previousFileArray = prevState.newMessageImages;
								const currentFileArray
											= [...uploadsSucceeded, ...previousFileArray];
								console.log('the files after dropping and before saving');
								console.log(currentFileArray);
								return {
									newMessageImagesAreUploading: false,
									newMessageImages: currentFileArray,
									newMessageImageSomeOrAllUploadsFailedWarning:
												newMessageImageSomeOrAllUploadsFailedWarningValue,
								};
							});
						})
					// if the promise to upload the files was rejected with an error
					// note: could be because a folder couldn't be created, or some other reason
						.catch((error) => {
							console.log('error');
							console.log(error);
							// set state to indicate that images are no longer processing and image upload error
							this.setState({
								newMessageImagesAreUploading: false,
								newMessageImageUploadsImpossible: true,
							});
						});
					/* })
						.catch((fileFormattingError) => {
							console.log(fileFormattingError);
						}); */
				})
				// if the promise was rejected with an error
				// note: messageIDError already set
				.catch((error) => {
					// set state to indicate that images are no longer processing
					this.setState({
						newMessageImagesAreUploading: false,
						newMessageImageUploadsImpossible: true,
					});
				});
			// if 1+ files of the wrong type were submitted for upload (some were reject by Dropzone)
		} else {
			// set state to indicate an images wrong type error
			this.setState(() => ({
				newMessageImagesWrongTypesWarning: true,
			}));
		}
	}
	handleFileDeletion(imageID, e) {
		// prevent navigating to image (because the control is inside a link)
		e.preventDefault();
		// set state to reflect all image uploads to this point minus the one whose button was clicked
		this.setState((prevState) => {
			const previousFileArray = prevState.newMessageImages;
			const currentFileArray = [];
			previousFileArray.forEach((file) => {
				if (file.key !== imageID) {
					currentFileArray.push(file);
				}
			});
			return {
				newMessageImages: currentFileArray,
			};
		});
	}
	handleChangedExpirationDate(value) {
		if (value) {
			this.setState(() => ({
				newMessageExpirationDate: value,
			}));
		} else {
			this.setState(() => ({
				newMessageExpirationDate: undefined,
			}));
		}
	}
	handleAddMessage(e) {
		// prevent submitting using the SP form tag
		e.preventDefault();
		// if the form is not invalid
		if (!this.setAndReturnMessageFormIsInvalid()) {
			// get a promise to retrieve a message ID
			this.returnAndConditionallySetMessageID()
				// if the message ID was retrieved
				.then((newMessageIDResult) => {
					// use the message ID + other message properties to construct a new message object
					const newMessageCreatorObject = {
						account: this.props.uData.account,
						displayName: this.props.uData.displayName,
					};
					const newMessageProperties = {
						newMessageID: newMessageIDResult,
						newMessageTag: this.state.newMessageTag,
						newMessageSubject: this.state.newMessageSubject,
						newMessageBody: this.state.newMessageBody,
						newMessageImages: this.state.newMessageImages,
						newMessageExpirationDate: this.state.newMessageExpirationDate,
						newMessageKey: shortid.generate(),
						newMessageCreated: MOSUtilities.ReturnFormattedDateTime({
							incomingDateTimeString: 'nowLocal',
						}),
						newMessageCreator: newMessageCreatorObject,
					};
					// send message to Neso
					HcMessagesData.SendNesoMessagesMessage(newMessageProperties)
						.then((response) => {
							this.handleSaveSuccess(newMessageProperties);
						})
						.catch((error) => {
							this.handleSaveError();
						});
				})
				.catch((newMessageIDError) => {
					this.handleSaveError();
				});
		}
	}
	resetNewMessageStateAndSetSaveSuccess() {
		this.setState(() => ({
			updatingMessage: false,
			newMessageID: undefined,
			newMessageTag: '',
			newMessageSubject: '',
			newMessageBody: '',
			newMessageImages: [],
			newMessageExpirationDate: '',
			newMessageImagesAreUploading: false,
			newMessageIDError: undefined,
			newMessageTagError: undefined,
			newMessageSubjectError: undefined,
			newMessageBodyError: undefined,
			newMessageImageSomeOrAllUploadsFailedWarning: undefined,
			newMessageImagesWrongTypesWarning: undefined,
			newMessageIsInvalid: undefined,
			newMessageImageUploadsImpossible: undefined,
			newMessageSaveFailure: undefined,
			newMessageSaveSuccess: true,
			newMessageIITNotificationFailure: undefined,
		}));
	}
	resetNewMessageStateWithNoSaveSuccess() {
		this.setState(() => ({
			updatingMessage: false,
			newMessageID: undefined,
			newMessageTag: '',
			newMessageSubject: '',
			newMessageBody: '',
			newMessageImages: [],
			newMessageExpirationDate: '',
			newMessageImagesAreUploading: false,
			newMessageIDError: undefined,
			newMessageTagError: undefined,
			newMessageSubjectError: undefined,
			newMessageBodyError: undefined,
			newMessageImageSomeOrAllUploadsFailedWarning: undefined,
			newMessageImagesWrongTypesWarning: undefined,
			newMessageIsInvalid: undefined,
			newMessageImageUploadsImpossible: undefined,
			newMessageSaveFailure: undefined,
			newMessageSaveSuccess: undefined,
			newMessageIITNotificationFailure: undefined,
		}));
	}
	handleSaveError() {
		HcMessagesData.SendSaveErrorEmail(this.state)
			.then((response) => {
				this.setState(() => ({
					newMessageSaveFailure: true,
				}));
			})
			.catch((error) => {
				this.setState(() => ({
					newMessageSaveFailure: true,
					newMessageIITNotificationFailure: true,
				}));
			});
	}
	handleSaveSuccess(newMessageProperties) {
		this.addMessageToList(newMessageProperties);
		this.resetNewMessageStateAndSetSaveSuccess();
	}
	returnFormFieldContainerClassNameString(errorPropertyName) {
		return errorPropertyName && this.state[errorPropertyName] ?
			'mos-react-form-field contains-errors' :
			'mos-react-form-field';
	}
	handlePageChange(pageNumber) {
		const messagesThisPage =
			this.returnMessagesThisPage(pageNumber, this.state.messagesToRenderArray);
		this.setState({
			activePage: pageNumber,
			messagesThisPageSmallScreen: messagesThisPage.messagesThisPageSmallScreen,
			messagesThisPageLargeScreen: messagesThisPage.messagesThisPageLargeScreen,
		});
	}
	returnMessagesThisPage(pageNumber, messagePool) {
		// preserve function parameter; subtract 1, because pages logically start with 1
		// 		 but technically with 0
		const pageNumberCopy = pageNumber - 1;
		// return corresponding sections of array
		return {
			messagesThisPageSmallScreen:
				messagePool
					.slice(
						pageNumberCopy * messagesPerPageSmallScreen,
						(pageNumberCopy + 1) * messagesPerPageSmallScreen,
					),
			messagesThisPageLargeScreen:
				messagePool
					.slice(
						pageNumberCopy * messagesPerPageLargeScreen,
						(pageNumberCopy + 1) * messagesPerPageLargeScreen,
					),
		};
	}
	addMessageToList(newMessageProperties) {
		this.setState((prevState) => {
			const newMessageArray = [{
				body: newMessageProperties.newMessageBody,
				created: newMessageProperties.newMessageCreated,
				creator: newMessageProperties.newMessageCreator,
				images: newMessageProperties.newMessageImages,
				subject: newMessageProperties.newMessageSubject,
				tag: newMessageProperties.newMessageTag,
				expirationDate: newMessageProperties.newMessageExpirationDate,
				key: newMessageProperties.newMessageKey,
			}, ...prevState.messagesArray];
			const messagesThisPage =
				this.returnMessagesThisPage(startingPageNumber, newMessageArray);
			return {
				messagesArray: newMessageArray,
				messagesToRenderArray: newMessageArray,
				messagesThisPageSmallScreen: messagesThisPage.messagesThisPageSmallScreen,
				messagesThisPageLargeScreen: messagesThisPage.messagesThisPageLargeScreen,
			};
		});
	}
	handleClickNewMessageButton(e) {
		// prevent submitting using the SP form tag
		e.preventDefault();
		// reset state
		this.resetNewMessageStateWithNoSaveSuccess();
		// set state
		this.setState(() => ({
			showNewMessageForm: true,
		}));
	}
	handleClickHideNewMessageButton(e) {
		// prevent submitting using the SP form tag
		e.preventDefault();
		// set state
		this.setState(() => ({
			showNewMessageForm: false,
		}));
	}
	handleClickTagFilterMenuLabel(e) {
		// prevent submitting using the SP form tag
		e.preventDefault();
	}
	handleClickTagFilterMenuItem(e, menuItem) {
		// must prevent default or else *#@^$#%^ SP page will try to submit a form (because
		// 		a button has been clicked inside a form tag); unfortunately, this also
		// 		prevents the menu from closing
		e.preventDefault();
		let categoryFilter = '';
		if (menuItem.name !== 'All') {
			categoryFilter = menuItem.name;
		}
		this.setState(() => ({
			categoryFilter,
		}));
		this.filterMessages(this.state.textFilter, categoryFilter);
		// return true to close the menu
		return true;
	}
	handleFilterTextChange(filterText) {
		const newFilterText = (filterText.length > 1) ? filterText : '';
		this.setState(() => ({
			textFilter: newFilterText,
		}));
		this.filterMessages(newFilterText, this.state.categoryFilter);
	}
	filterMessages(textFilter, categoryFilter) {
		// if both filters are clear
		let messagesToRenderArray;
		if (!textFilter && !categoryFilter) {
			// use all messages
			messagesToRenderArray = this.state.messagesArray;
			// if there's a cateogry filter and no text filter
		} else if (!textFilter && categoryFilter) {
			// get a filtered array from a deep copy of all messages
			messagesToRenderArray =
				this.returnCategoryFilteredMessages(JSON.parse(JSON.stringify(this.state.messagesArray)), categoryFilter);
		} else if (textFilter && !categoryFilter) {
			// get a filtered array from a deep copy of all messages
			messagesToRenderArray =
				this.returnTextFilteredMessages(JSON.parse(JSON.stringify(this.state.messagesArray)), textFilter);
		} else if (textFilter && categoryFilter) {
			// text filtering will probably eliminate the most messages; 
			// 		starting there will make the second filtering more efficient
			// get a text filtered array from a deep copy of all messages
			const textFilteredMessages =
				this.returnTextFilteredMessages(JSON.parse(JSON.stringify(this.state.messagesArray)), textFilter);
			// get a category-filtered array from the text-filtered array
			messagesToRenderArray =
				this.returnCategoryFilteredMessages(textFilteredMessages, categoryFilter);
		}
		// get paginated messages
		const messagesThisPage =
			this.returnMessagesThisPage(startingPageNumber, messagesToRenderArray);
		// set state with paginated messages
		this.setState(() => ({
			messagesToRenderArray,
			messagesThisPageSmallScreen: messagesThisPage.messagesThisPageSmallScreen,
			messagesThisPageLargeScreen: messagesThisPage.messagesThisPageLargeScreen,
		}));
	}
	returnCategoryFilteredMessages(messagePool, categoryFilter) {
		return messagePool
			.filter(this.returnItemIncludesCategoryTag(categoryFilter));
	}
	returnTextFilteredMessages(messagePool, textFilter) {
		return messagePool
			.filter(this.returnItemIncludesFilterTextCaseInsensitive(textFilter));
	}
	returnItemIncludesFilterTextCaseInsensitive(textFilter) {
		return message =>
			(message.body && message.body.toLowerCase().includes(textFilter.toLowerCase())) ||
			(message.subject && message.subject.toLowerCase().includes(textFilter.toLowerCase())) ||
			(
				message.creator &&
				message.creator.displayName &&
				message.creator.displayName.toLowerCase().includes(textFilter.toLowerCase())
			);
	}
	returnItemIncludesCategoryTag(categoryFilter) {
		return (message) => {
			if (message.tag === categoryFilter) {
				return true;
			}
			return false;
		};
	}
	returnSortedMessages(messages) {

		/* // sort messages according to modified property
		allMessagesMessages.sort((a, b) => {
			if (moment(a.modified).isBefore(moment(b.modified))) {
				return 1;
			}
			return -1;
		}); */
	}
	returnHcMessagesAllBody() {
		return (
			<div id="hc-messages-all-body">
				{/* <div className="section-notice section-notice__neutral">
					<p className="section-notice__text">
						Learn about&nbsp;
						<a
							target="_blank"
							rel="noopener noreferrer"
							href="https://bmos.sharepoint.com/SitePages/Messages%20Update,%20April%202019.aspx"
						>
							April 2019 updates to Messages
						</a>
						.
					</p>
				</div> */}
				<HcMessagesCommandBar
					screenType={this.props.screenType}
					tagsArray={this.state.tagsArray}
					handleClickNewMessageButton={this.handleClickNewMessageButton}
					handleClickHideNewMessageButton={this.handleClickHideNewMessageButton}
					showingNewMessageForm={this.state.showNewMessageForm}
					updatingMessage={this.state.updatingMessage}
					handleClickTagFilterMenuLabel={this.handleClickTagFilterMenuLabel}
					handleClickTagFilterMenuItem={this.handleClickTagFilterMenuItem}
					handleFilterTextChange={this.handleFilterTextChange}
				/>
				<HcMessagesNewMessageForm
					showNewMessageForm={this.state.showNewMessageForm}
					updatingMessage={this.state.updatingMessage}
					tagsArray={this.state.tagsArray}
					addMessageToList={this.addMessageToList}
					uData={this.props.uData}
					newMessageID={this.state.newMessageID}
					newMessageTag={this.state.newMessageTag}
					newMessageSubject={this.state.newMessageSubject}
					newMessageBody={this.state.newMessageBody}
					newMessageImages={this.state.newMessageImages}
					newMessageExpirationDate={this.state.newMessageExpirationDate}
					newMessageImagesAreUploading={this.state.newMessageImagesAreUploading}
					newMessageIDError={this.state.newMessageExpinewMessageIDErrorrationDate}
					newMessageTagError={this.state.newMessageTagError}
					newMessageSubjectError={this.state.newMessageSubjectError}
					newMessageBodyError={this.state.newMessageBodyError}
					newMessageImageSomeOrAllUploadsFailedWarning={this.state.newMessageImageSomeOrAllUploadsFailedWarning}
					newMessageImagesWrongTypesWarning={this.state.newMessageImagesWrongTypesWarning}
					newMessageIsInvalid={this.state.newMessageIsInvalid}
					newMessageImageUploadsImpossible={this.state.newMessageImageUploadsImpossible}
					newMessageSaveFailure={this.state.newMessageSaveFailure}
					newMessageSaveSuccess={this.state.newMessageSaveSuccess}
					newMessageIITNotificationFailure={this.state.newMessageIITNotificationFailure}

					returnFormFieldContainerClassNameString={this.returnFormFieldContainerClassNameString}
					handleChangedTag={this.handleChangedTag}
					handleChangedSubject={this.handleChangedSubject}
					handleChangedBody={this.handleChangedBody}
					handleDroppedFiles={this.handleDroppedFiles}
					handleFileDeletion={this.handleFileDeletion}
					handleMessageUpdate={this.handleMessageUpdate}
					handleChangedExpirationDate={this.handleChangedExpirationDate}
					handleAddMessage={this.handleAddMessage}
					handleClickHideNewMessageButton={this.handleClickHideNewMessageButton}
				/>
				<MediaQuery maxWidth={ScreenSizes.ReturnSmallMax()}>
					<HcMessagesList
						messagesThisPage={this.state.messagesThisPageSmallScreen}
						uData={this.props.uData}
						enableMessageUpdate={this.enableMessageUpdate}
					/>
					<Pagination
						activePage={this.state.activePage}
						itemsCountPerPage={messagesPerPageSmallScreen}
						totalItemsCount={this.state.messagesToRenderArray.length}
						pageRangeDisplayed={
							((this.state.messagesToRenderArray.length / messagesPerPageSmallScreen) + 1) > 3 ?
								3 :
								(this.state.messagesToRenderArray.length / messagesPerPageSmallScreen) + 1
						}
						onChange={this.handlePageChange}
						hideDisabled
						hideFirstLastPages
					/>
				</MediaQuery>
				<MediaQuery
					minWidth={ScreenSizes.ReturnMediumMin()}
					maxWidth={ScreenSizes.ReturnMediumMax()}
				>
					<HcMessagesList
						messagesThisPage={this.state.messagesThisPageLargeScreen}
						uData={this.props.uData}
						enableMessageUpdate={this.enableMessageUpdate}
					/>
					<Pagination
						activePage={this.state.activePage}
						itemsCountPerPage={messagesPerPageLargeScreen}
						totalItemsCount={this.state.messagesToRenderArray.length}
						pageRangeDisplayed={
							((this.state.messagesToRenderArray.length / messagesPerPageLargeScreen) + 1) > 7 ?
								7 :
								(this.state.messagesToRenderArray.length / messagesPerPageLargeScreen) + 1
						}
						onChange={this.handlePageChange}
					/>
				</MediaQuery>
				<MediaQuery minWidth={ScreenSizes.ReturnLargeMin()}>
					<HcMessagesList
						messagesThisPage={this.state.messagesThisPageLargeScreen}
						uData={this.props.uData}
						enableMessageUpdate={this.enableMessageUpdate}
					/>
					<Pagination
						activePage={this.state.activePage}
						itemsCountPerPage={messagesPerPageLargeScreen}
						totalItemsCount={this.state.messagesToRenderArray.length}
						pageRangeDisplayed={
							((this.state.messagesToRenderArray.length / messagesPerPageLargeScreen) + 1) > 10 ?
								10 :
								(this.state.messagesToRenderArray.length / messagesPerPageLargeScreen) + 1
						}
						onChange={this.handlePageChange}
					/>
				</MediaQuery>
			</div>
		);
	}
	enableMessageUpdate(incomingMessageID, e) {
		// prevent submitting using the SP form tag
		e.preventDefault();
		// set state
		this.state.messagesToRenderArray.forEach((message) => {
			const messageCopy = message;
			if (messageCopy.messageID === incomingMessageID) {
				if (typeof (messageCopy.expiration) === 'string') {
					messageCopy.expiration = new Date(messageCopy.expiration);
				}
				this.setState({
					showNewMessageForm: true,
					updatingMessage: true,
					newMessageID: messageCopy.messageID,
					newMessageSubject: messageCopy.subject,
					newMessageTag: messageCopy.tag,
					newMessageBody: messageCopy.body,
					newMessageExpirationDate: messageCopy.expiration,
					newMessageImages: messageCopy.images,
					newMessageSaveSuccess: undefined,
				});
			}
		});
	}
	handleMessageUpdate(e) {
		// prevent submitting using the SP form tag
		e.preventDefault();
		// if the form is not invalid
		if (!this.setAndReturnMessageFormIsInvalid()) {
			// use the message ID + other message properties to construct a new message object
			const newMessageProperties = {
				newMessageID: this.state.newMessageID,
				newMessageTag: this.state.newMessageTag,
				newMessageSubject: this.state.newMessageSubject,
				newMessageBody: this.state.newMessageBody,
				newMessageImagesToCheck: this.state.newMessageImages,
				newMessageImages: [],
				newMessageExpirationDate: this.state.newMessageExpirationDate,
			};
			newMessageProperties.newMessageImagesToCheck.forEach((checkingImage) => {
				const checkingImageCopy = checkingImage;
				if (!checkingImageCopy.imageKey) {
					checkingImageCopy.imageKey = shortid.generate();
				}
				newMessageProperties.newMessageImages.push(checkingImageCopy);
			});
			// send message to Neso
			HcMessagesData.SendNesoMessagesMessageUpdate(newMessageProperties)
				.then((response) => {
					this.handleUpdateSuccess(newMessageProperties);
				})
				.catch((error) => {
					this.handleSaveError();
				});
		}
	}
	handleUpdateSuccess(newMessageProperties) {
		this.updateMessageInList(newMessageProperties);
		this.resetNewMessageStateAndSetSaveSuccess();
	}
	updateMessageInList(newMessageProperties) {
		this.setState((prevState) => {
			// set up container for updated messages
			const newMessageArray = [];
			// iterate over the existing message
			prevState.messagesToRenderArray.forEach((prevMessage) => {
				const prevMessageCopy = prevMessage;
				// if this is the message to update
				if (prevMessageCopy.messageID === newMessageProperties.newMessageID) {
					// replace previous properties with new properties
					prevMessageCopy.tag = newMessageProperties.newMessageTag;
					prevMessageCopy.subject = newMessageProperties.newMessageSubject;
					prevMessageCopy.body = newMessageProperties.newMessageBody;
					prevMessageCopy.images = newMessageProperties.newMessageImages;
					prevMessageCopy.expirationDate = newMessageProperties.newMessageExpirationDate;
				}
				// push message, updated or not, to container
				newMessageArray.push(prevMessageCopy);
			});
			const messagesThisPage =
				this.returnMessagesThisPage(startingPageNumber, newMessageArray);
			return {
				messagesArray: newMessageArray,
				messagesToRenderArray: newMessageArray,
				messagesThisPageSmallScreen: messagesThisPage.messagesThisPageSmallScreen,
				messagesThisPageLargeScreen: messagesThisPage.messagesThisPageLargeScreen,
			};
		});
	}
	returnPlaceholder(screenType) {
		if (screenType === 'medium') {
			return (
				<div
					className="mos-placeholder-column-container hc-messages-placeholder"
				>
					<RectShape className="mos-placeholder-column hc-messages-placeholder-column" />
					<RectShape className="mos-placeholder-column hc-messages-placeholder-column" />
				</div>
			);
		}
		return (
			<div
				className="mos-placeholder-column-container hc-messages-placeholder"
			>
				<RectShape className="mos-placeholder-column hc-messages-placeholder-column" />
				<RectShape className="mos-placeholder-column hc-messages-placeholder-column" />
				<RectShape className="mos-placeholder-column hc-messages-placeholder-column" />
				<RectShape className="mos-placeholder-column hc-messages-placeholder-column" />
			</div>
		);
	}
	render() {
		if (
			this.props.allOrTop === 'all' &&
			(this.props.screenType === 'medium' || this.props.screenType === 'large')
		) {
			return (
				<div id="hc-messages-all" className="mos-react-component-root" name="hc-messages-all">
					<h2>Messages</h2>
					<ReactPlaceholder
						customPlaceholder={this.returnPlaceholder(this.props.screenType)}
						ready={this.state.ready}
						showLoadingAnimation
					>
						{this.returnHcMessagesAllBody()}
					</ReactPlaceholder>
				</div>
			);
		}
		if (this.props.allOrTop === 'all' && this.props.screenType === 'small') {
			return this.returnHcMessagesAllBody();
			/* return (
				<AccordionItem
					id="hc-messages-all"
					className="hc-messages-all mos-react-component-root accordion__item"
					hideBodyClassName="accordion__item--hidden"
					name="hc-messages-all"
				>
					<AccordionItemTitle
						className="hc-messages-all__title accordion__title accordion__title--animated"
					>
						<h2 className="u-position-relative">
							<div className="accordion__title__text">Messages</div>
							<div className="accordion__arrow" role="presentation" />
						</h2>
					</AccordionItemTitle>
					<AccordionItemBody
						className="hc-messages-all__body accordion__body"
					>
						{this.returnHcMessagesAllBody()}
					</AccordionItemBody>
				</AccordionItem>
			); */
		}
		return (
			<div id="hc-messages-top" className="mos-react-component-root">
				<HcMessagesNewMessageForm
					showNewMessageForm={this.state.showNewMessageForm}
					updatingMessage={this.state.updatingMessage}
					tagsArray={this.state.tagsArray}
					addMessageToList={this.addMessageToList}
					uData={this.props.uData}

					newMessageID={this.state.newMessageID}
					newMessageTag={this.state.newMessageTag}
					newMessageSubject={this.state.newMessageSubject}
					newMessageBody={this.state.newMessageBody}
					newMessageImages={this.state.newMessageImages}
					newMessageExpirationDate={this.state.newMessageExpirationDate}
					newMessageImagesAreUploading={this.state.newMessageImagesAreUploading}
					newMessageIDError={this.state.newMessageExpinewMessageIDErrorrationDate}
					newMessageTagError={this.state.newMessageTagError}
					newMessageSubjectError={this.state.newMessageSubjectError}
					newMessageBodyError={this.state.newMessageBodyError}
					newMessageImageSomeOrAllUploadsFailedWarning={this.state.newMessageImageSomeOrAllUploadsFailedWarning}
					newMessageImagesWrongTypesWarning={this.state.newMessageImagesWrongTypesWarning}
					newMessageIsInvalid={this.state.newMessageIsInvalid}
					newMessageImageUploadsImpossible={this.state.newMessageImageUploadsImpossible}
					newMessageSaveFailure={this.state.newMessageSaveFailure}
					newMessageSaveSuccess={this.state.newMessageSaveSuccess}
					newMessageIITNotificationFailure={this.state.newMessageIITNotificationFailure}

					returnFormFieldContainerClassNameString={this.returnFormFieldContainerClassNameString}
					handleChangedTag={this.handleChangedTag}
					handleChangedSubject={this.handleChangedSubject}
					handleChangedBody={this.handleChangedBody}
					handleDroppedFiles={this.handleDroppedFiles}
					handleFileDeletion={this.handleFileDeletion}
					handleMessageUpdate={this.handleMessageUpdate}
					handleChangedExpirationDate={this.handleChangedExpirationDate}
					handleAddMessage={this.handleAddMessage}
					handleClickHideNewMessageButton={this.handleClickHideNewMessageButton}
				/>
				{
					!this.state.showNewMessageForm &&

					<h2>Latest Messages</h2>
				}
				{
					!this.state.showNewMessageForm &&

					<ReactPlaceholder
						customPlaceholder={this.returnPlaceholder(this.props.screenType)}
						ready={this.state.ready}
						showLoadingAnimation
					>
						<HcMessagesList
							messagesThisPage={this.state.messagesToRenderArray}
							enableMessageUpdate={this.enableMessageUpdate}
							uData={this.props.uData}
						/>
					</ReactPlaceholder>
				}
			</div>
		);
	}
}
