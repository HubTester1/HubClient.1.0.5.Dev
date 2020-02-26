
/* eslint-disable react/prefer-stateless-function */

// ----- IMPORTS

import * as React from 'react';
import HcOrganizationOtherContact from '../HcOrganizationOtherContact/HcOrganizationOtherContact';


// ----- COMPONENT

export default class HcOrganizationOtherContacts extends React.Component {
	render() {
		return (
			<div id="hc-organization-other-contacts" className="mos-react-component-root">
				<h3>Other Contacts</h3>
				<ul>
					{
						this.props.otherContactsArray.map(contactValue => (
							<HcOrganizationOtherContact
								key={contactValue.reactKey}
								contactId={contactValue.reactKey}
								contactContent={contactValue}
							/>
						))
					}
				</ul>
			</div>
		);
	}
}
