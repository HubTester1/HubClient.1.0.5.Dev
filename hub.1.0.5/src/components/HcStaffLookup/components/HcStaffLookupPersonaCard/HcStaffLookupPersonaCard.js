
/* eslint class-methods-use-this: 0 */
/* eslint no-underscore-dangle: 0 */
/* eslint max-len: 0 */

// ----- IMPORTS

import * as React from 'react';
import { Icon } from 'office-ui-fabric-react/lib/Icon';

// ----- COMPONENT

const HcStaffLookupPersonaCard = (props) => {
	let photoStyleObject = {};
	if (props.personaContent.photoURL) {
		photoStyleObject = {
			backgroundImage: `url(${props.personaContent.photoURL})`,
		};
	}
	return (
		<li id={`hc-staff-lookup-persona_${props.personaId}`} className="hc-staff-lookup-persona mos-react-component-root">
			<div className="persona-card-dialog-header">
				{
					props.personaContent.firstInitial &&
					props.personaContent.lastInitial &&
					<span className="avatar">
						<span className="avatar-initials">{props.personaContent.firstInitial}{props.personaContent.lastInitial}
						</span>
					</span>
				}
				{
					/* props.personaContent.photoURL &&
					<span className="avatar" style={photoStyleObject} /> */
				}
				{
					/* !props.personaContent.photoURL &&
					<span className="avatar">
						<span className="avatar-initials">{props.personaContent.firstInitial}{props.personaContent.lastInitial}
						</span>
					</span> */
				}
				<span className="name_title_department">
					{
						props.personaContent.displayName &&
						<p className="name">{props.personaContent.displayName}</p>
					}
					{
						props.personaContent.title &&
						<p className="title">{props.personaContent.title}</p>
					}
					{
						props.personaContent.department &&
						<p className="department">{props.personaContent.department}</p>
					}
				</span>
			</div>
			<ul className="persona-card-dialog-body">
				{
					props.personaContent.uiMessage &&

					<p className="ui-message">{props.personaContent.uiMessage}</p>
				}
				{
					/* props.personaContent.officePhone &&
					props.personaContent.mobilePhone &&

					<li className="phone-numbers office-and-mobile-phone-number">
						<span className="persona-card-body-list-item-content">
							<ul>
								<li className="office-phone-number"><span className="phone-number-label">Office</span><span className="phone-number-separator">: </span>{props.personaContent.officePhone}</li>
								<li className="mobile-phone-number"><span className="phone-number-label">Mobile</span><span className="phone-number-separator">: </span>{props.personaContent.mobilePhone}</li>
							</ul>
							<Icon iconName="Phone" className="section-icon--phone" />
						</span>
					</li> */
				}
				{
					/* props.personaContent.officePhone &&
					!props.personaContent.mobilePhone &&

					<li className="phone-numbers office-phone-number">
						<span className="persona-card-body-list-item-content">
							<span className="phone-number-label">Office</span>
							<span className="phone-number-separator">: </span>{props.personaContent.officePhone}
							<Icon iconName="Phone" className="section-icon--phone" />
						</span>
					</li> */
				}
				{
					/* !props.personaContent.officePhone &&
					props.personaContent.mobilePhone &&

					<li className="phone-numbers mobile-phone-number">
						<span className="persona-card-body-list-item-content">
							<span className="phone-number-label">Mobile</span>
							<span className="phone-number-separator">: </span>{props.personaContent.mobilePhone}
							<Icon iconName="Phone" className="section-icon--phone" />
						</span>
					</li> */
				}
				{
					props.personaContent.officePhone &&

					<li className="phone-numbers office-phone-number">
						<span className="persona-card-body-list-item-content">
							<span className="phone-number-label">Office</span>
							<span className="phone-number-separator">: </span>{props.personaContent.officePhone}
							<Icon iconName="Phone" className="section-icon--phone" />
						</span>
					</li>
				}
				{
					props.personaContent.email &&

					<li className="email">
						<a href={`mailto:${props.personaContent.email}`}>
							<span className="persona-card-body-list-item-content">
								{props.personaContent.email}
								<Icon iconName="Mail" className="section-icon--email" />
							</span>
						</a>
					</li>
				}
				{
					/* props.personaContent.profileToken &&
					
					<li className="profile">
						<span className="persona-card-body-list-item-content">
							<a 
								href={`https://bmos-my.sharepoint.com/_layouts/15/me.aspx?u=${props.personaContent.profileToken}`}
								target="_blank"
							>
							Profile
							</a>
							<Icon iconName="DelveLogo" className="section-icon--profile" />
						</span>
					</li> */
				}
			</ul>
		</li>
	);
};

export default HcStaffLookupPersonaCard;
