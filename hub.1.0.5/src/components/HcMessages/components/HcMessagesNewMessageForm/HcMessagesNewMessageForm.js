
/* eslint-disable max-len */
/* eslint-disable no-useless-constructor */
/* eslint-disable react/prefer-stateless-function */

// ----- IMPORTS

import * as React from 'react';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import HcMessagesTagDropdown from '../HcMessagesTagDropdown/HcMessagesTagDropdown';
import HcMessagesFiles from '../HcMessagesFiles/HcMessagesFiles';
import HcMessagesExpirationDate from '../HcMessagesExpirationDate/HcMessagesExpirationDate';

// ----- COMPONENT

export default class HcMessagesNewMessageForm extends React.Component {
	constructor(props) {
		super(props);
		// this.props = {
		// };
	}
	render() {
		if (this.props.showNewMessageForm) {
			console.log('props');
			console.log(this.props);
			return (
				<div id="hc-messages-new-message-form" className="mos-react-component-root">
					{
						!this.props.updatingMessage &&

						<h3>New Message</h3>
					}
					{
						this.props.updatingMessage &&

						<h3>Modify Message</h3>
					}
					<div className="requirement-legend">
						<span className="requirement-indicator" />
						<span className="requirement-indicator-label" />
					</div>
					<div className={this.props.returnFormFieldContainerClassNameString('newMessageTagError')}>
						<HcMessagesTagDropdown
							tagsArray={this.props.tagsArray}
							onChanged={this.props.handleChangedTag}
							selectedKey={this.props.newMessageTag}
							tabIndex="1"
						/>
						<div className="mos-react-form-field-error">
							{this.props.newMessageTagError}
						</div>
					</div>
					<div className={this.props.returnFormFieldContainerClassNameString('newMessageSubjectError')}>
						<TextField
							label="Subject"
							value={this.props.newMessageSubject}
							onChanged={this.props.handleChangedSubject}
							required
						/>
						<div className="mos-react-form-field-error">
							{this.props.newMessageSubjectError}
						</div>
					</div>
					<div className={this.props.returnFormFieldContainerClassNameString('newMessageBodyError')}>
						<TextField
							label="Body"
							multiline
							rows={5}
							autoAdjustHeight
							value={this.props.newMessageBody}
							onChanged={this.props.handleChangedBody}
							required
						/>
						<div className="mos-react-form-field-error">
							{this.props.newMessageBodyError}
						</div>
					</div>
					<div className="mos-react-form-field">
						<HcMessagesFiles
							handleDroppedFiles={this.props.handleDroppedFiles}
							handleFileDeletion={this.props.handleFileDeletion}
							newMessageImagesAreUploading={this.props.newMessageImagesAreUploading}
							newMessageImages={this.props.newMessageImages}
							newMessageImagesWrongTypesWarning={this.props.newMessageImagesWrongTypesWarning}
							newMessageImageSomeOrAllUploadsFailedWarning={
								this.props.newMessageImageSomeOrAllUploadsFailedWarning
							}
							newMessageImageUploadsImpossible={this.props.newMessageImageUploadsImpossible}
						/>
					</div>
					<div className={this.props.returnFormFieldContainerClassNameString(null)}>
						<HcMessagesExpirationDate 
							value={this.props.newMessageExpirationDate}
							onSelectDate={this.props.handleChangedExpirationDate}
						/>
						<div className="mos-react-form-field-error">
							{this.props.newMessageExpirationDateError}
						</div>
					</div>
					{
						this.props.newMessageIDError && 

						<div id="new-message-id-error-message" className="mos-react-form-error-message banner banner--critical">
							<p className="banner__text">
								<span className="urgent">Whoopsie!</span> We can&apos;t save your stuff right now. Please try later.
							</p>
						</div>
					}
					{
						this.props.newMessageIsInvalid &&

						<div id="form-entries-invalid-error-message" className="mos-react-form-error-message banner banner--critical">
							<p className="banner__text">The highlighted fields contain errors. Please make changes and try again.</p>
						</div>
					}
					{
						this.props.newMessageSaveFailure &&

						<div id="new-message-save-failure-error-message" className="mos-react-form-error-message banner banner--critical">
							<span className="urgent">Whoopsie!</span> We can&apos;t save your stuff right now. Please try later.
						</div>
					}
					{
						this.props.newMessageIITNotificationFailure &&

						<div id="new-message-iit-notification-failure-error-message" className="mos-react-form-error-message banner banner--critical">
							<p className="banner__text">
								<span className="urgent">Oh no!</span> We couldn&apos;t notify IIT, either. 
								Are you connected to the Internet?
							</p>
						</div>
					}
					{
						!this.props.updatingMessage &&

						<div className="new-message-button-container">
							<button id="new-message-save-button" onClick={this.props.handleAddMessage}>Save</button>
						</div>
					}
					{
						this.props.updatingMessage &&

						<div className="new-message-button-container">
							<button id="new-message-save-button" onClick={this.props.handleMessageUpdate}>Save</button>
						</div>
					}
					<div className="new-message-button-container">
						<button id="new-message-close-button" onClick={this.props.handleClickHideNewMessageButton}>Close</button>
					</div>
					{
						this.props.newMessageSaveSuccess &&

						<div id="new-message-save-success-message" className="mos-react-form-success-message banner banner--success">
							<p className="banner__text">Your message was saved.</p>
						</div>
					}
				</div>
			);
		} 
		return (null);
	}
}
