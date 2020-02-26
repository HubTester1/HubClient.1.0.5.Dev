
// ----- IMPORTS

import * as React from 'react';
import CommandBar from '../../../CommandBar/CommandBar';


// ----- COMPONENT

const HcOrganizationCommandBar = props => (
	<div id="hc-organization-command-bar" className="mos-react-component-root">
		<CommandBar
			screenType={props.screenType}
			collapseOnScreenTypes={['small']}
			scopeName="Organization, Teams, &amp; Staff"
			items={
				[
					{
						type: 'button',
						key: 'teams',
						name: 'Divisions, Departments, & Other Teams',
						icon: 'Group',
						ariaLabel: 'Divisions, Departments, and Other Teams',
						onClick: props.handleClickShowTeams,
					}, {
						type: 'button',
						key: 'staffLookup',
						name: 'Staff Lookup',
						icon: 'TestUserSolid',
						ariaLabel: 'Staff Lookup',
						onClick: props.handleClickShowStaffLookup,
					}, {
						type: 'button',
						key: 'othercontacts',
						name: 'Other Contacts',
						icon: 'Megaphone',
						ariaLabel: 'Other Contacts',
						onClick: props.handleClickOtherContacts,
					},
				]
			}
		/>
	</div>
);

export default HcOrganizationCommandBar;
