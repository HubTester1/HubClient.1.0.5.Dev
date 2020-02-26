
// ----- IMPORTS

import * as React from 'react';
import Dropzone from 'react-dropzone';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';
import HcMessageFilePreview from '../HcMessageFilePreview/HcMessageFilePreview';

// ----- COMPONENT

/* eslint react/prefer-stateless-function: 0 */
export default class HcMessagesFiles extends React.Component {
	render() {
		const dropzoneInputProps = { id: 'hc-messages-images-file-input' };
		return (
			<div className="hc-messages-images mos-react-component-root">
				{!this.props.newMessageImagesAreUploading && 
					<div className="hc-messages-images-file-input-container">
						{/* note: eslint isn't recognizing that Dropzone is associate with this label */}
						{/* eslint-disable jsx-a11y/label-has-for */}
						<label htmlFor="hc-messages-images-file-input">Images</label>
						<Dropzone
							onDrop={this.props.handleDroppedFiles}
							accept="image/jpeg,image/jpg,image/png,image/gif"
							multiple
							name="hc-messages-images-file-input"
							inputProps={dropzoneInputProps}
							className="mos-file-input"
						>
							Drag images here, or click or tap here to browse
						</Dropzone>
					</div>
				}
				{
					this.props.newMessageImagesAreUploading && 
					
					<div className="hc-messages-images-file-input-container">
						{/* note: eslint isn't recognizing that Dropzone is associate with this label */}
						{/* eslint-disable jsx-a11y/label-has-for */}
						<label htmlFor="hc-messages-images-file-input">Images</label>
						{/* to do - need a 1rem margin above this banner */}
						<div className="banner">
							<Spinner
								size={SpinnerSize.medium}
								label="Uploading"
							/>
						</div>
					</div>
				}
				{
					this.props.newMessageImagesWrongTypesWarning &&

					<div id="mos-react-form-field-error-wrong-image-type" className="mos-react-form-error-message banner banner--warning">
						<p className="banner__text">
							<span className="urgent">Oops!</span> No images were uploaded. Only JPG, 
							JPEG, GIF, and PNG files are allowed. Please try again.
						</p>
					</div>
				}
				{
					this.props.newMessageImageSomeOrAllUploadsFailedWarning &&
					!this.props.newMessageImageUploadsImpossible &&
					this.props.newMessageImages[0] &&

					<div id="some-image-uploads-failed-message" className="mos-react-form-warning-message banner banner--warning">
						<p className="banner__text">
							<span className="urgent">Hmmm...</span> Successful uploads can be previewed here, 
							but at least one of your uploads failed. Feel free to try again.
						</p>
					</div>
				}
				{
					this.props.newMessageImageSomeOrAllUploadsFailedWarning &&
					!this.props.newMessageImageUploadsImpossible &&
					!this.props.newMessageImages[0] &&

					<div id="some-image-uploads-failed-message" className="mos-react-form-warning-message banner banner--critical">
						<p className="banner__text"><span className="urgent">On no!</span> None of your images could be uploaded.</p>
					</div>
				}
				{
					this.props.newMessageImageUploadsImpossible &&

					<div id="image-uploads-are-not-possible-message" className="mos-react-form-error-message banner banner--critical">
						<p className="banner__text"><span className="urgent">Whoopsie!</span> We can&apos;t save your images right now. Please try later.</p>
					</div>
				}
				{
					!this.props.newMessageImagesAreUploading && 
					this.props.newMessageImages[0] && 

					this.props.newMessageImages.map(imageValue => (
						<HcMessageFilePreview
							key={imageValue.key}
							imageId={imageValue.key}
							imageContent={imageValue}
							handleFileDeletion={this.props.handleFileDeletion}
						/>))
				}
			</div>
		);
	}
}
