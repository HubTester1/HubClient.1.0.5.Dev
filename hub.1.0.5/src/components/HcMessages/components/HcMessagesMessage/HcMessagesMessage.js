
// ----- IMPORTS

import * as React from 'react';
import MediaQuery from 'react-responsive';

import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import HcMessagesMessageCreator from '../HcMessagesMessageCreator/HcMessagesMessageCreator';
import HcMessagesMessageImage from '../HcMessagesMessageImage/HcMessagesMessageImage';
import MOSUtilities from '../../../../services/MOSUtilities';
import ScreenSizes from '../../../../services/ScreenSizes';

// ----- COMPONENT

function ReturnMessageBody(html) {
	let htmlCopy = html;
	htmlCopy = htmlCopy.replace(/(\r\n|\n|\r)/gm, '<br />');
	return { __html: `<div>${htmlCopy}</div>` };
}

const HcMessagesMessage = (props) => {
	console.log(props); return (
		<div id={`hc-messages-message_${props.messageId}`} className="hc-messages-message mos-react-component-root">
			<MediaQuery minWidth={ScreenSizes.ReturnMediumMin()}>
				{/* <div className="hc-messages-message-control"> */}
				<DefaultButton
					className="hc-messages-message-control"
					iconProps={{ iconName: 'ChromeClose' }}
					text="Back"
					onClick={props.handleCloseModalClick}
				/>
				{/* </div> */}
			</MediaQuery>
			<MediaQuery maxWidth={ScreenSizes.ReturnSmallMax()}>
				{/* <div className="hc-messages-message-control"> */}
				{/* <DefaultButton
				className="hc-messages-message-control"
				iconProps={{ iconName: 'Back' }}
				text="Back to Preview"
				onClick={props.handleCloseInlineFullClick}
			/> */}
				{/* </div> */}
			</MediaQuery>
			<h3 className="hc-messages-message-subject">
				{props.messageContent.subject}
			</h3>
			<HcMessagesMessageCreator
				creator={props.messageContent.creator}
			/>
			<p className="hc-messages-message-created">
				{MOSUtilities.ReturnFormattedDateTime({
					incomingDateTimeString: props.messageContent.created,
					incomingReturnFormat: 'MMMM D, YYYY',
					determineYearDisplayDynamically: 1,
				})}
			</p>
			{
				props.messageContent.images &&
				props.messageContent.images.map(imageValue => (
					<HcMessagesMessageImage
						key={imageValue.key}
						imageID={imageValue.key}
						imageContent={imageValue}
					/>
				))
			}

			<div className="hc-messages-message-body" dangerouslySetInnerHTML={ReturnMessageBody(props.messageContent.body)} />
			<p className="hc-messages-message-tag">#{props.messageContent.tag}</p>
			<MediaQuery minWidth={ScreenSizes.ReturnMediumMin()}>
				{/* <div className="hc-messages-message-control"> */}
				<DefaultButton
					className="hc-messages-message-control"
					iconProps={{ iconName: 'ChromeClose' }}
					text="Back"
					onClick={props.handleCloseModalClick}
				/>
				{/* </div> */}
			</MediaQuery>
			<MediaQuery maxWidth={ScreenSizes.ReturnSmallMax()}>
				{/* <div className="hc-messages-message-control"> */}
				<DefaultButton
					className="hc-messages-message-control"
					iconProps={{ iconName: 'Back' }}
					text="Back to Preview"
					onClick={props.handleCloseInlineFullClick}
				/>
				{/* </div> */}
			</MediaQuery>
		</div>
	);
};
export default HcMessagesMessage;

