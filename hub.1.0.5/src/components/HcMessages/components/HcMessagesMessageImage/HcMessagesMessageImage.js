
// ----- IMPORTS

import * as React from 'react';
import MediaQuery from 'react-responsive';
import ScreenSizes from '../../../../services/ScreenSizes';
import './HcMessagesMessageImage.sass';


// ----- COMPONENT

const HcMessagesMessageImage = (props) => {
	if (props.imageContent) {
		return (
			<div
				id={`hc-messages-message-image-container_${props.imageID}`}
				className="hc-messages-message-image-container mos-react-component-root"
			>
				{
					props.imageContent.migratedFromQuark &&

					<img
						id={`hc-messages-message-image_${props.imageID}`}
						className="hc-messages-message-image"
						src={props.imageContent.uriQuark}
					/>
				}
				{
					!props.imageContent.migratedFromQuark &&

					<MediaQuery minWidth={ScreenSizes.ReturnMediumMin()}>
						<img
							id={`hc-messages-message-image_${props.imageID}`}
							className="hc-messages-message-image"
							src={props.imageContent.urlLarge}
						/>
					</MediaQuery>
				}
				{
					!props.imageContent.migratedFromQuark &&
					
					<MediaQuery maxWidth={ScreenSizes.ReturnSmallMax()}>
						<img
							id={`hc-messages-message-image_${props.imageID}`}
							className="hc-messages-message-image"
							src={props.imageContent.urlSmall}
						/>
					</MediaQuery>
				}
			</div>
		);
	}
	return (null);
};

export default HcMessagesMessageImage;
