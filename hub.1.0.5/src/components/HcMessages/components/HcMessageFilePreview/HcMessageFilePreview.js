
/* eslint-disable */

// ----- IMPORTS

import * as React from 'react';
import MOSUtilities from '../../../../services/MOSUtilities';

// ----- COMPONENT

export default class HcMessagesFilePreview extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		// console.log(this.props.imageContent);
		// if this image was uploaded successfully (error is false)
		if (!this.props.imageContent.error) {
			const backgroundImageUrl = MOSUtilities.ReplaceAll(' ', '%20', this.props.imageContent.urlTemp);
			const imagePreviewStyles = {
				backgroundImage: `url(${backgroundImageUrl})`,
			};
			// const fileSizeFormatted = this.ReturnFileSizeToReport(this.props.imageContent.size);
			return (
				<a 
					id={`hc-messages-images-image-container_${this.props.imageId}`}
					className="hc-messages-images-image-container file-upload-preview image-upload-success mos-react-component-root"
					href={this.props.imageContent.urlTemp} 
					target="_blank"
				>
					{/* image preview */}
					<div 
						id={`hc-messages-images-image-preview_${this.props.imageId}`}
						className="hc-messages-images-image-preview file-upload-preview__file-image specific-image"
						style={imagePreviewStyles}
					/>
					{/* file data text */}
					<div
						id={`hc-messages-images-image-file-name-and-size_${this.props.imageId}`}
						className="hc-messages-images-image-file-info file-upload-preview__file-info"
					>
						<div className="hc-messages-images-image-file-name file-upload-preview__file-info__file-name">{this.props.imageContent.name}</div>
						{/* <div className="hc-messages-images-image-file-size">{fileSizeFormatted}</div> */}
					</div>
					{/* delete control */}
					<button
						id={`hc-messages-images-image-file-control_${this.props.imageId}`} 
						className="hc-messages-images-image-file-control file-upload-preview__file-control"
						onClick={(e) => this.props.handleFileDeletion(this.props.imageId, e)}
					>
						<span className="button__icon"></span>
						<span className="button__text">Delete image</span>
					</button>
				</a>
			);
		}
		if (!this.props.imageContent.error && this.props.imageContent.migratedFromQuark) {
			return (
				<div id="new-message-image-preview-impossible-message" className="mos-react-form-warning-message banner banner--warning">
					<p className="banner__text">
						Files migrated from Quark cannot be edited. However, you can set this message's 
						expiration to a past date and create a new message.
					</p>
				</div>
			);
		}	
		// if this image was NOT uploaded successfully (error is true)
		return (
			<div className="hc-messages-images-image image-upload-error mos-react-component-root">
				{this.props.imageContent.name} could not be uploaded.
			</div>
		);
	}
}
