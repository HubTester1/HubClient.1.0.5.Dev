
// ----- IMPORTS

import * as React from 'react';
import moment from 'moment';
import Modal from 'react-modal';
import MediaQuery from 'react-responsive';

import HcMessagesMessage from '../HcMessagesMessage/HcMessagesMessage';
import ScreenSizes from '../../../../services/ScreenSizes';
import MOSUtilities from '../../../../services/MOSUtilities';

const StripTags = require('locutus/php/strings/strip_tags');

// ----- COMPONENT

export default class HcMessagesMessagePreview extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			showModalFull: false,
			showInlineFull: false,
		};
		this.handleOpenModalClick = this.handleOpenModalClick.bind(this);
		this.handleAfterModalOpens = this.handleAfterModalOpens.bind(this);
		this.handleCloseModalClick = this.handleCloseModalClick.bind(this);
		this.handleOpenInlineFullClick = this.handleOpenInlineFullClick.bind(this);
		this.handleCloseInlineFullClick = this.handleCloseInlineFullClick.bind(this);
	}
	handleOpenModalClick(e) {
		e.preventDefault();
		this.setState({ showModalFull: true });
	}
	handleAfterModalOpens() {
		// console.log('after open modal');
	}
	handleCloseModalClick() {
		this.setState({ showModalFull: false });
	}
	handleOpenInlineFullClick() {
		this.setState({ showInlineFull: true });
	}
	handleCloseInlineFullClick() {
		this.setState({ showInlineFull: false });
	}
	returnHtml(html) {
		return { __html: `${html}` };
	}
	returnFriendlyDate(dateString) {
		if (moment().isSame(dateString, 'day')) {
			return MOSUtilities.ReturnFormattedDateTime({ incomingDateTimeString: dateString, incomingReturnFormat: 'h:mm a' });
		// } else if (moment(dateString).isAfter(moment().subtract(8, 'days'), 'day')) {
		} else if (moment().isSame(dateString, 'week')) {
			return MOSUtilities.ReturnFormattedDateTime({ incomingDateTimeString: dateString, incomingReturnFormat: 'ddd h:mm a' });
		} else if (moment(dateString).isAfter(moment().subtract(1, 'month'))) {
			return MOSUtilities.ReturnFormattedDateTime({ incomingDateTimeString: dateString, incomingReturnFormat: 'ddd M/D' });
		}
		return MOSUtilities.ReturnFormattedDateTime({ incomingDateTimeString: dateString, incomingReturnFormat: 'M/D/YYYY' });
	}
	render() {
		Modal.setAppElement('#hub-central-mount-point');
		return (
			<li className="mos-react-component-root">
			
				{
					!this.state.showInlineFull &&
					
					<div className="hc-messages-message-preview">
						<h3 className="hc-messages-message-preview-subject">
							{this.props.messageContent.subject.slice(0, 49)}
						</h3>
						<p className="hc-messages-message-preview-author">
							<span className="hc-messages-message-author-prefix">Posted by: </span>
							{this.props.messageContent.creator.displayName}
						</p>
						<p className="hc-messages-message-preview-date">
							<span className="hc-messages-message-date-prefix">Last Modified: </span>
							{this.returnFriendlyDate(this.props.messageContent.modified)}
						</p>
						<p
							className="hc-messages-message-preview-body"
							// eslint-disable-next-line react/no-danger
							dangerouslySetInnerHTML={
								this.returnHtml(StripTags(this.props.messageContent.body).slice(0, 99))
							}
						/>
						<div className="hc-messages-message-preview-button-container">
							<MediaQuery maxWidth={ScreenSizes.ReturnSmallMax()}>
								<button
									className="hc-messages-message-preview-full-message-button"
									onClick={this.handleOpenInlineFullClick}
								>
									<span className="button-text-container">Full message</span>
								</button>
							</MediaQuery>
							<MediaQuery minWidth={ScreenSizes.ReturnMediumMin()}>
								<button
									className="hc-messages-message-preview-full-message-button"
									onClick={this.handleOpenModalClick}
								>
									<span className="button-text-container">Full message</span>
								</button>
							</MediaQuery>
							{
								this.props.messageContent.creator.account === this.props.uData.account &&

								<div className="hc-messages-message-button-container">
									<span className="hc-messages-message-conditional-button-container">
										<span className="hc-messages-message-conditional-button-separator" />
										<button
											className="hc-messages-message-preview-enable-message-update-button"
											onClick={
												e => this.props.enableMessageUpdate(this.props.messageContent.messageID, e)
											}
										>
											<span className="button-text-container">Modify message</span>
										</button>
									</span>
								</div>
							}
						</div>
						<MediaQuery minWidth={ScreenSizes.ReturnMediumMin()}>
							<Modal
								className="hc-messages-message-full-message-modal"
								isOpen={this.state.showModalFull}
								onAfterOpen={this.handleAfterModalOpens}
								onRequestClose={this.handleCloseModalClick}
								contentLabel="More"
								ariaHideApp={false}
							>
								<HcMessagesMessage
									messageId={this.props.messageId}
									messageContent={this.props.messageContent}
									handleCloseModalClick={this.handleCloseModalClick}
									handleCloseInlineFullClick={this.handleCloseInlineFullClick}
								/>
							</Modal>
						</MediaQuery>
					</div>
				}
				{
					this.state.showInlineFull &&

					<div className="hc-messages-message-inline-message">
						<HcMessagesMessage
							messageId={this.props.messageId}
							messageContent={this.props.messageContent}
							handleCloseModalClick={this.handleCloseModalClick}
							handleCloseInlineFullClick={this.handleCloseInlineFullClick}
						/>
					</div>
				}
			</li>
		);
	}
}
